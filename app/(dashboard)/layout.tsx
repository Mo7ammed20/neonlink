"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Link2, BarChart3, Settings, Key,
  LogOut, Menu, X, Zap, Bell, User, ChevronDown,
  Crown, Sparkles, TrendingUp
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/links", icon: Link2, label: "My Links" },
  { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/dashboard/api-keys", icon: Key, label: "API Keys" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <>
      {/* Overlay (mobile) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: open ? 0 : -280 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className={cn(
          "fixed lg:static top-0 left-0 h-full z-40 flex flex-col",
          "w-72 glass border-r border-[rgba(0,191,255,0.1)]",
          "lg:translate-x-0 lg:!transform-none"
        )}
        style={{ display: open || typeof window !== "undefined" && window.innerWidth >= 1024 ? "flex" : "none" }}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00BFFF] to-[#8A2BE2] flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-white tracking-wide">NEON<span className="text-[#00BFFF]">LINK</span></span>
          </Link>
          <button onClick={onClose} className="lg:hidden p-1 text-[#6B7280] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User card */}
        <div className="mx-4 mb-4 p-4 rounded-2xl bg-gradient-to-br from-[rgba(0,191,255,0.05)] to-[rgba(138,43,226,0.05)] border border-[rgba(0,191,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00BFFF] to-[#8A2BE2] flex items-center justify-center font-bold text-sm text-white">
              {session?.user?.name?.charAt(0).toUpperCase() ?? "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{session?.user?.name ?? "User"}</p>
              <p className="text-xs text-[#6B7280] truncate">{session?.user?.email}</p>
            </div>
            <div className="badge-neon text-xs">
              {session?.user?.plan ?? "Free"}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <p className="px-4 text-xs font-semibold text-[#4B5563] uppercase tracking-widest mb-2">Main</p>
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link key={href} href={href} onClick={onClose}>
                <div className={cn("sidebar-item", isActive && "active")}>
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00BFFF]"
                    />
                  )}
                </div>
              </Link>
            );
          })}

          <div className="divider-neon my-4" />

          {/* Upgrade prompt */}
          {session?.user?.plan === "FREE" && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[rgba(138,43,226,0.1)] to-[rgba(0,191,255,0.05)] border border-[rgba(138,43,226,0.2)] mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 text-[#FFD700]" />
                <span className="text-sm font-semibold text-white">Upgrade to Pro</span>
              </div>
              <p className="text-xs text-[#6B7280] mb-3">Unlock unlimited links, custom domains, and full analytics.</p>
              <Link href="/dashboard/settings#billing">
                <button className="w-full py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#8A2BE2] to-[#00BFFF] text-white hover:opacity-90 transition-opacity">
                  Upgrade Now
                </button>
              </Link>
            </div>
          )}
        </nav>

        {/* Sign out */}
        <div className="p-4 border-t border-[rgba(0,191,255,0.08)]">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="sidebar-item w-full text-[#FF007F] hover:bg-[rgba(255,0,127,0.08)] hover:text-[#FF007F]"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
}

function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const pageTitle = navItems.find(n => n.href === pathname)?.label
    ?? navItems.find(n => pathname.startsWith(n.href) && n.href !== "/dashboard")?.label
    ?? "Dashboard";

  return (
    <header className="glass border-b border-[rgba(0,191,255,0.1)] px-4 sm:px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-[#6B7280] hover:text-white rounded-lg hover:bg-white/5"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display font-bold text-white text-lg tracking-wide">{pageTitle}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative p-2 text-[#6B7280] hover:text-white rounded-lg hover:bg-white/5 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF007F] animate-pulse" />
        </button>

        {/* Quick stats */}
        <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[rgba(0,255,136,0.05)] border border-[rgba(0,255,136,0.15)]">
          <TrendingUp className="w-3 h-3 text-[#00FF88]" />
          <span className="text-xs text-[#00FF88] font-medium">+12% today</span>
        </div>

        {/* User avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00BFFF] to-[#8A2BE2] flex items-center justify-center font-bold text-sm text-white cursor-pointer">
          {session?.user?.name?.charAt(0).toUpperCase() ?? "U"}
        </div>
      </div>
    </header>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on resize
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex">
      <div className="hidden lg:flex flex-col w-72 flex-shrink-0">
        <Sidebar open={true} onClose={() => {}} />
      </div>

      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
