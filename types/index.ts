// NeonLink — Shared TypeScript Types

export type Role = "USER" | "ADMIN" | "SUPERADMIN";
export type Plan = "FREE" | "PRO" | "BUSINESS" | "ENTERPRISE";
export type UserStatus = "ACTIVE" | "SUSPENDED" | "PENDING";
export type AdType = "ADSENSE" | "PROPELLERADS" | "MONETAG" | "CUSTOM_HTML" | "BANNER" | "POPUP" | "NATIVE";
export type AdPlacement = "STEP_1" | "STEP_2" | "STEP_3" | "GLOBAL" | "SIDEBAR";

// ─────────────────────────────────────────
// USER
// ─────────────────────────────────────────
export interface User {
  id: string;
  name?: string | null;
  email: string;
  emailVerified?: Date | null;
  image?: string | null;
  role: Role;
  plan: Plan;
  status: UserStatus;
  earnings: number;
  totalLinks: number;
  totalClicks: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStats {
  totalLinks: number;
  totalClicks: number;
  uniqueVisitors: number;
  earnings: number;
  clicksToday: number;
  topCountry: string;
  conversionRate: number;
}

// ─────────────────────────────────────────
// LINKS
// ─────────────────────────────────────────
export interface Link {
  id: string;
  slug: string;
  originalUrl: string;
  title?: string | null;
  description?: string | null;
  favicon?: string | null;
  password?: string | null;
  expiresAt?: Date | null;
  maxClicks?: number | null;
  clickCount: number;
  uniqueCount: number;
  isActive: boolean;
  isPublic: boolean;
  category?: string | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  userId?: string | null;
  user?: User | null;
  clicks?: Click[];
}

export interface CreateLinkInput {
  url: string;
  customSlug?: string;
  title?: string;
  password?: string;
  expiresAt?: string;
  maxClicks?: number;
  tags?: string[];
  category?: string;
}

export interface BulkCreateInput {
  urls: string[];
  prefix?: string;
}

export interface ShortenResponse {
  id: string;
  slug: string;
  shortUrl: string;
  originalUrl: string;
  qrCode?: string;
}

// ─────────────────────────────────────────
// ANALYTICS / CLICKS
// ─────────────────────────────────────────
export interface Click {
  id: string;
  linkId: string;
  ip?: string | null;
  country?: string | null;
  countryCode?: string | null;
  city?: string | null;
  device?: string | null;
  browser?: string | null;
  os?: string | null;
  referrer?: string | null;
  isUnique: boolean;
  isBot: boolean;
  completedAds: boolean;
  createdAt: Date;
}

export interface AnalyticsSummary {
  totalClicks: number;
  uniqueClicks: number;
  completedAds: number;
  conversionRate: number;
  topCountry: string;
  topDevice: string;
  topBrowser: string;
}

export interface ClicksByDay {
  date: string;
  clicks: number;
  unique: number;
}

export interface ClicksByCountry {
  country: string;
  countryCode: string;
  clicks: number;
  percentage: number;
}

export interface ClicksByDevice {
  device: string;
  clicks: number;
  percentage: number;
}

export interface ClicksByBrowser {
  browser: string;
  clicks: number;
  percentage: number;
}

export interface TopLink {
  id: string;
  slug: string;
  originalUrl: string;
  title?: string | null;
  clickCount: number;
  uniqueCount: number;
}

// ─────────────────────────────────────────
// ADS
// ─────────────────────────────────────────
export interface Ad {
  id: string;
  name: string;
  type: AdType;
  code: string;
  placement: AdPlacement;
  isActive: boolean;
  impressions: number;
  clicks: number;
  revenue: number;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAdInput {
  name: string;
  type: AdType;
  code: string;
  placement: AdPlacement;
}

// ─────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────
export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  siteLogo?: string;
  siteFavicon?: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  adTimer: number; // seconds
  adSteps: number; // 1, 2, or 3
  requireLogin: boolean;
  customDomains: boolean;
  maxLinksPerUser: number;
  googleAnalyticsId?: string;
  recaptchaEnabled: boolean;
  recaptchaSiteKey?: string;
  emailFrom?: string;
  emailProvider?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;
}

// ─────────────────────────────────────────
// API
// ─────────────────────────────────────────
export interface ApiKey {
  id: string;
  name: string;
  key: string;
  prefix: string;
  isActive: boolean;
  permissions: string[];
  usageCount: number;
  rateLimit: number;
  lastUsed?: Date | null;
  expiresAt?: Date | null;
  createdAt: Date;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

// ─────────────────────────────────────────
// ADMIN
// ─────────────────────────────────────────
export interface AdminStats {
  totalUsers: number;
  totalLinks: number;
  totalClicks: number;
  activeUsers: number;
  newUsersToday: number;
  newLinksToday: number;
  clicksToday: number;
  revenue: number;
  topLinks: TopLink[];
  recentUsers: User[];
}

export interface AdminLog {
  id: string;
  actorId: string;
  userId?: string | null;
  action: string;
  resource?: string | null;
  details?: string | null;
  ip?: string | null;
  createdAt: Date;
  actor: User;
  user?: User | null;
}

// ─────────────────────────────────────────
// REDIRECT SESSION
// ─────────────────────────────────────────
export interface RedirectSession {
  linkId: string;
  currentStep: number;
  completedAt?: Date | null;
  ip?: string;
}

// ─────────────────────────────────────────
// UI
// ─────────────────────────────────────────
export type ToastType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link?: string | null;
  createdAt: Date;
}

export type ChartPeriod = "7d" | "30d" | "90d" | "1y";

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
