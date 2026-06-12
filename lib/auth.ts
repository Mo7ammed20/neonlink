import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

// Define Role locally so build works even before `prisma generate`
type Role = "USER" | "ADMIN" | "SUPERADMIN";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),

  session: { strategy: "jwt" },

  pages: {
    signIn: "/login",
    error: "/login",
    verifyRequest: "/verify-email",
  },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            password: true,
            role: true,
            plan: true,
            status: true,
            emailVerified: true,
          },
        });

        if (!user || !user.password) {
          throw new Error("No account found with this email");
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) {
          throw new Error("Incorrect password");
        }

        if (user.status === "SUSPENDED") {
          throw new Error("Your account has been suspended");
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          plan: user.plan,
        };
      },
    }),

    ...(process.env.GOOGLE_CLIENT_ID
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),

    ...(process.env.GITHUB_CLIENT_ID
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
          }),
        ]
      : []),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id;
        token.role = (user as { role?: Role }).role ?? "USER";
        token.plan = (user as { plan?: string }).plan ?? "FREE";
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id   = token.id as string;
        session.user.role = token.role as Role;
        session.user.plan = token.plan as string;
      }
      return session;
    },

    async signIn({ user, account }) {
      if (account?.provider === "credentials") return true;

      // For OAuth providers, auto-verify email
      if (user?.email) {
        await prisma.user.update({
          where: { email: user.email },
          data: {
            emailVerified: new Date(),
            status: "ACTIVE",
          },
        }).catch(() => null);
      }
      return true;
    },
  },

  events: {
    async signIn({ user }) {
      if (user?.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        }).catch(() => null);
      }
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
});

// Helper: hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Helper: verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Helper: require auth in server components
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) return null;
  return session.user;
}

// Helper: require admin
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) return null;
  if (!["ADMIN", "SUPERADMIN"].includes(session.user.role as string)) return null;
  return session.user;
}

// Type augmentation
declare module "next-auth" {
  interface User {
    role?: Role;
    plan?: string;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: Role;
      plan: string;
    };
  }
}
