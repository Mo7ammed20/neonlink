import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: {
    default: "NeonLink — Premium URL Shortener",
    template: "%s | NeonLink",
  },
  description:
    "Shorten links, track analytics, and monetize your traffic with NeonLink — the premium URL shortener platform with advanced analytics and ad monetization.",
  keywords: [
    "url shortener", "link shortener", "analytics", "monetization",
    "short links", "qr code", "link management", "traffic analytics",
  ],
  authors: [{ name: "NeonLink" }],
  creator: "NeonLink",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "NeonLink — Premium URL Shortener",
    description: "Shorten, track, and monetize your links with powerful analytics.",
    siteName: "NeonLink",
  },
  twitter: {
    card: "summary_large_image",
    title: "NeonLink — Premium URL Shortener",
    description: "Shorten, track, and monetize your links.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#00BFFF",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Orbitron:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="bg-dark-base text-[#F0F4FF] font-body antialiased">
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#0F0F1A",
                color: "#F0F4FF",
                border: "1px solid rgba(0, 191, 255, 0.2)",
                borderRadius: "12px",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "14px",
              },
              success: {
                iconTheme: { primary: "#00FF88", secondary: "#0F0F1A" },
              },
              error: {
                iconTheme: { primary: "#FF007F", secondary: "#0F0F1A" },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
