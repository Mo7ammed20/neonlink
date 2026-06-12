import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { rateLimit, cacheDel } from "@/lib/redis";
import { generateSlug, isValidUrl, buildShortUrl, getClientIp } from "@/lib/utils";
import { z } from "zod";

const shortenSchema = z.object({
  url: z.string().url("Invalid URL format").max(2048),
  customSlug: z.string()
    .min(3, "Alias must be at least 3 characters")
    .max(50, "Alias too long")
    .regex(/^[a-zA-Z0-9_-]+$/, "Only letters, numbers, hyphens, and underscores")
    .optional(),
  title: z.string().max(200).optional(),
  password: z.string().min(4).max(100).optional(),
  expiresAt: z.string().datetime().optional(),
  maxClicks: z.number().int().positive().optional(),
  tags: z.array(z.string()).max(10).optional(),
  category: z.string().max(50).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    // Rate limiting: 20 requests per minute per IP
    const { allowed, remaining } = await rateLimit(`shorten:${ip}`, 20, 60);
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded. Please wait a moment." },
        { status: 429, headers: { "X-RateLimit-Remaining": "0" } }
      );
    }

    // Parse and validate body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
    }

    const result = shortenSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.errors[0]?.message ?? "Validation failed" },
        { status: 400 }
      );
    }

    const { url, customSlug, title, password, expiresAt, maxClicks, tags, category } = result.data;

    if (!isValidUrl(url)) {
      return NextResponse.json({ success: false, error: "Invalid URL" }, { status: 400 });
    }

    // Check auth — session OR API key
    const session = await auth();
    let userId = session?.user?.id ?? null;

    // Fallback: API key auth for programmatic/developer access
    if (!userId) {
      const { validateApiKey } = await import("@/lib/api-auth");
      const keyUserId = await validateApiKey(req);
      if (keyUserId) userId = keyUserId;
    }

    // Handle custom slug
    let slug = customSlug;
    if (slug) {
      // Check availability
      const existing = await prisma.link.findUnique({ where: { slug } });
      if (existing) {
        return NextResponse.json(
          { success: false, error: "This alias is already taken" },
          { status: 409 }
        );
      }
    } else {
      // Generate unique slug
      let attempts = 0;
      do {
        slug = generateSlug(attempts > 5 ? 9 : 7);
        const existing = await prisma.link.findUnique({ where: { slug } });
        if (!existing) break;
        attempts++;
      } while (attempts < 10);

      if (attempts >= 10) {
        return NextResponse.json(
          { success: false, error: "Could not generate unique slug. Try again." },
          { status: 500 }
        );
      }
    }

    // Create link
    const link = await prisma.link.create({
      data: {
        slug: slug!,
        originalUrl: url,
        title: title || null,
        password: password || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        maxClicks: maxClicks || null,
        tags: tags || [],
        category: category || null,
        userId,
      },
    });

    // Update user stats
    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: { totalLinks: { increment: 1 } },
      }).catch(() => null);
    }

    const shortUrl = buildShortUrl(link.slug);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: link.id,
          slug: link.slug,
          shortUrl,
          originalUrl: link.originalUrl,
          title: link.title,
          expiresAt: link.expiresAt,
          createdAt: link.createdAt,
        },
      },
      { status: 201, headers: { "X-RateLimit-Remaining": String(remaining) } }
    );
  } catch (err) {
    console.error("[POST /api/shorten]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// GET: Fetch user's links
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20"), 100);
    const search = searchParams.get("search") ?? "";
    const sortBy = searchParams.get("sortBy") ?? "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";
    const category = searchParams.get("category") ?? undefined;
    const isActive = searchParams.get("active");

    const where = {
      userId: session.user.id,
      ...(search && {
        OR: [
          { slug: { contains: search, mode: "insensitive" as const } },
          { originalUrl: { contains: search, mode: "insensitive" as const } },
          { title: { contains: search, mode: "insensitive" as const } },
        ],
      }),
      ...(category && { category }),
      ...(isActive !== null && { isActive: isActive === "true" }),
    };

    const [links, total] = await Promise.all([
      prisma.link.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          slug: true,
          originalUrl: true,
          title: true,
          clickCount: true,
          uniqueCount: true,
          isActive: true,
          expiresAt: true,
          tags: true,
          category: true,
          createdAt: true,
        },
      }),
      prisma.link.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: links.map((l: { id: string; slug: string; originalUrl: string; title: string | null; clickCount: number; uniqueCount: number; isActive: boolean; expiresAt: Date | null; tags: string[]; category: string | null; createdAt: Date }) => ({
        ...l,
        shortUrl: buildShortUrl(l.slug),
      })),
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("[GET /api/shorten]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// PATCH: Update link (toggle active, edit)
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id, isActive, title } = await req.json();
    if (!id) return NextResponse.json({ success: false, error: "Link ID required" }, { status: 400 });

    const link = await prisma.link.findFirst({ where: { id, userId: session.user.id } });
    if (!link) return NextResponse.json({ success: false, error: "Link not found" }, { status: 404 });

    const updated = await prisma.link.update({
      where: { id },
      data: {
        ...(isActive !== undefined && { isActive }),
        ...(title !== undefined && { title }),
      },
    });

    await cacheDel(`link:${link.slug}`);
    return NextResponse.json({ success: true, link: updated });
  } catch (err) {
    console.error("[PATCH /api/shorten]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// DELETE: Delete a link
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "Link ID required" }, { status: 400 });

    const link = await prisma.link.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!link) return NextResponse.json({ success: false, error: "Link not found" }, { status: 404 });

    await prisma.link.delete({ where: { id } });
    await cacheDel(`link:${link.slug}`);

    return NextResponse.json({ success: true, message: "Link deleted" });
  } catch (err) {
    console.error("[DELETE /api/shorten]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
