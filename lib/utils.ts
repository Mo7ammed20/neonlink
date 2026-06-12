import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { nanoid } from "nanoid";
import { UAParser } from "ua-parser-js";

// ─── Class merger ──────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Slug generation ──────────────────────────────
export function generateSlug(length = 7): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

export function generateApiKey(): string {
  return `nl_${nanoid(32)}`;
}

// ─── URL Validation ───────────────────────────────
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    // Remove credentials
    parsed.username = "";
    parsed.password = "";
    return parsed.toString();
  } catch {
    return url;
  }
}

export function getUrlDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export function truncateUrl(url: string, maxLen = 60): string {
  if (url.length <= maxLen) return url;
  return url.slice(0, maxLen) + "…";
}

// ─── Number formatting ───────────────────────────
export function formatNumber(num: number | undefined | null): string {
  if (num === undefined || num === null || isNaN(num)) return '0';
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toLocaleString();
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

// ─── Date formatting ─────────────────────────────
export function formatDate(date: Date | string, opts?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", opts ?? { year: "numeric", month: "short", day: "numeric" });
}

export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 30) return formatDate(d);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}

// ─── User Agent Parsing ──────────────────────────
export function parseUserAgent(ua: string) {
  const parser = new UAParser(ua);
  const browser = parser.getBrowser();
  const os = parser.getOS();
  const device = parser.getDevice();

  return {
    browser: browser.name ?? "Unknown",
    browserVersion: browser.version ?? "",
    os: os.name ?? "Unknown",
    osVersion: os.version ?? "",
    device: device.type === "mobile"
      ? "Mobile"
      : device.type === "tablet"
        ? "Tablet"
        : "Desktop",
  };
}

// ─── Color helpers ───────────────────────────────
export const CHART_COLORS = [
  "#00BFFF", "#8A2BE2", "#FF007F", "#00FF88", "#FFD700",
  "#FF6B6B", "#4ECDC4", "#A8E6CF", "#3D5A80", "#FF9F43",
];

export function getDeviceIcon(device: string): string {
  switch (device?.toLowerCase()) {
    case "mobile": return "📱";
    case "tablet": return "📋";
    default: return "💻";
  }
}

export function getBrowserIcon(browser: string): string {
  switch (browser?.toLowerCase()) {
    case "chrome": return "🌐";
    case "firefox": return "🦊";
    case "safari": return "🧭";
    case "edge": return "🌐";
    default: return "🌍";
  }
}

// ─── Random ID ──────────────────────────────────
export function randomId(): string {
  return Math.random().toString(36).slice(2, 9);
}

// ─── Clipboard ──────────────────────────────────
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const el = document.createElement("textarea");
    el.value = text;
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    const success = document.execCommand("copy");
    document.body.removeChild(el);
    return success;
  }
}

// ─── CSV Export ──────────────────────────────────
export function exportToCSV(data: Record<string, unknown>[], filename: string): void {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map(row =>
      headers.map(h => {
        const v = row[h];
        const str = v === null || v === undefined ? "" : String(v);
        return str.includes(",") || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str;
      }).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

// ─── Sleep ──────────────────────────────────────
export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// ─── Password validation ────────────────────────
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (password.length < 8) errors.push("At least 8 characters");
  if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
  if (!/[0-9]/.test(password)) errors.push("One number");
  return { valid: errors.length === 0, errors };
}

// ─── Token generation ───────────────────────────
export function generateToken(length = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

// ─── IP helpers ─────────────────────────────────
export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

// ─── Short URL builder ──────────────────────────
export function buildShortUrl(slug: string, baseUrl?: string): string {
  const base = baseUrl ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${base}/${slug}`;
}

// ─── Debounce ───────────────────────────────────
export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, wait: number) {
  let timer: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

// ─── Object omit ────────────────────────────────
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) delete result[key];
  return result;
}

// ─── Stats calculation ──────────────────────────
export function calculateConversionRate(completedAds: number, totalClicks: number): number {
  if (totalClicks === 0) return 0;
  return Math.round((completedAds / totalClicks) * 100);
}

export function groupByDate(
  items: { createdAt: Date | string }[],
  days = 30
): Record<string, number> {
  const result: Record<string, number> = {};

  // Initialize all days
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    result[date.toISOString().split("T")[0]] = 0;
  }

  // Count items per day
  for (const item of items) {
    const date = new Date(item.createdAt).toISOString().split("T")[0];
    if (result[date] !== undefined) {
      result[date]++;
    }
  }

  return result;
}
