"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Link2, MousePointerClick, Globe, TrendingUp,
  Plus, Copy, Check, ExternalLink, BarChart3,
  Zap, Clock, Users
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";
import { cn, formatNumber, formatRelativeTime, buildShortUrl, copyToClipboard } from "@/lib/utils";
import toast from "react-hot-toast";
import Link from "next/link";

// ─── Stat Card ───────────────────────────────────────────────────────
function StatCard({
  icon: Icon, label, value, change, color, delay = 0
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  change?: string;
  color: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="stat-card group"
    >
      <div className="flex items-start justify-between">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: `${color}15`, border: `1px solid ${color}30` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        {change && (
          <span className={cn(
            "text-xs font-semibold px-2 py-0.5 rounded-full",
            change.startsWith("+")
              ? "text-[#00FF88] bg-[rgba(0,255,136,0.1)]"
              : "text-[#FF007F] bg-[rgba(255,0,127,0.1)]"
          )}>
            {change}
          </span>
        )}
      </div>
      <div>
        <p className="text-3xl font-bold font-display text-white">{typeof value === "number" ? formatNumber(value) : value}</p>
        <p className="text-sm text-[#6B7280] mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}

// ─── Quick Shorten Form ───────────────────────────────────────────────
function QuickShorten({ onCreated }: { onCreated: () => void }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ shortUrl: string } | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.success) {
        setResult({ shortUrl: data.data.shortUrl });
        setUrl("");
        onCreated();
        toast.success("Link shortened!");
      } else {
        toast.error(data.error ?? "Failed to shorten");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!result) return;
    await copyToClipboard(result.shortUrl);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="glass-card">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[rgba(0,191,255,0.1)] border border-[rgba(0,191,255,0.2)] flex items-center justify-center">
          <Zap className="w-4 h-4 text-[#00BFFF]" />
        </div>
        <h3 className="font-semibold text-white">Quick Shorten</h3>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://your-long-url.com/..."
          required
          className="input-neon flex-1 py-3"
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-neon px-5 py-3 rounded-xl font-semibold text-sm whitespace-nowrap flex items-center gap-2"
        >
          {loading ? (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
          ) : (
            <><Plus className="w-4 h-4" /> Shorten</>
          )}
        </button>
      </form>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex items-center gap-3 p-3 rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(0,255,136,0.05)]"
        >
          <span className="font-mono text-[#00FF88] text-sm flex-1 truncate">{result.shortUrl}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.3)] text-[#00FF88] text-xs font-medium hover:bg-[rgba(0,255,136,0.15)]"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </motion.div>
      )}
    </div>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl p-3 border border-[rgba(0,191,255,0.2)] text-xs">
      <p className="text-[#6B7280] mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-semibold" style={{ color: p.color }}>{p.name}: {formatNumber(p.value)}</p>
      ))}
    </div>
  );
}

// ─── Recent Links ─────────────────────────────────────────────────────
function RecentLinks({ links }: { links: Array<{
  id: string; slug: string; originalUrl: string;
  title?: string; clickCount: number; createdAt: string
}> }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function handleCopy(slug: string) {
    await copyToClipboard(buildShortUrl(slug));
    setCopiedId(slug);
    setTimeout(() => setCopiedId(null), 2000);
  }

  if (!links.length) {
    return (
      <div className="text-center py-12">
        <Link2 className="w-12 h-12 text-[#4B5563] mx-auto mb-3" />
        <p className="text-[#6B7280] text-sm">No links yet. Create your first one above!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table-neon">
        <thead>
          <tr>
            <th>Link</th>
            <th>Clicks</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link, i) => (
            <motion.tr key={link.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <td>
                <div className="flex flex-col gap-0.5">
                  <span className="font-mono text-[#00BFFF] text-sm">{buildShortUrl(link.slug)}</span>
                  <span className="text-xs text-[#4B5563] truncate max-w-[200px]">
                    {link.title || new URL(link.originalUrl).hostname}
                  </span>
                </div>
              </td>
              <td>
                <div className="flex items-center gap-1.5">
                  <MousePointerClick className="w-3.5 h-3.5 text-[#8A2BE2]" />
                  <span className="font-semibold text-white">{formatNumber(link.clickCount)}</span>
                </div>
              </td>
              <td>
                <div className="flex items-center gap-1 text-xs text-[#6B7280]">
                  <Clock className="w-3 h-3" />
                  {formatRelativeTime(link.createdAt)}
                </div>
              </td>
              <td>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(link.slug)}
                    className="p-1.5 rounded-lg hover:bg-white/5 text-[#6B7280] hover:text-[#00BFFF] transition-colors"
                  >
                    {copiedId === link.slug ? <Check className="w-4 h-4 text-[#00FF88]" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a
                    href={link.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg hover:bg-white/5 text-[#6B7280] hover:text-[#00BFFF] transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <Link
                    href={`/dashboard/analytics?link=${link.slug}`}
                    className="p-1.5 rounded-lg hover:bg-white/5 text-[#6B7280] hover:text-[#8A2BE2] transition-colors"
                  >
                    <BarChart3 className="w-4 h-4" />
                  </Link>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────
export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalLinks: 0,
    totalClicks: 0,
    uniqueVisitors: 0,
    earnings: 0,
  });
  const [chartData, setChartData] = useState<Array<{ date: string; clicks: number; unique: number }>>([]);
  const [recentLinks, setRecentLinks] = useState<Array<{
    id: string; slug: string; originalUrl: string;
    title?: string; clickCount: number; createdAt: string
  }>>([]);
  const [loading, setLoading] = useState(true);
  const refreshRef = useRef(0);

  async function loadDashboard() {
    try {
      const [statsRes, linksRes] = await Promise.all([
        fetch("/api/analytics/summary"),
        fetch("/api/shorten?limit=5&sortBy=createdAt&sortOrder=desc"),
      ]);

      const statsData = await statsRes.json();
      const linksData = await linksRes.json();

      if (statsData.success) setStats(statsData.data);
      if (linksData.success) {
        setRecentLinks(linksData.data);

        // Build chart from last 7 days using click data
        const chart = await fetch("/api/analytics/chart?period=7d");
        const chartJson = await chart.json();
        if (chartJson.success) setChartData(chartJson.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  // Generate mock chart data for display
  const displayChartData = chartData.length > 0 ? chartData : Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      clicks: Math.floor(Math.random() * 200) + 20,
      unique: Math.floor(Math.random() * 100) + 10,
    };
  });

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Link2} label="Total Links" value={stats.totalLinks} change="+3" color="#00BFFF" delay={0} />
        <StatCard icon={MousePointerClick} label="Total Clicks" value={stats.totalClicks} change="+12%" color="#8A2BE2" delay={0.05} />
        <StatCard icon={Users} label="Unique Visitors" value={stats.uniqueVisitors} change="+8%" color="#00FF88" delay={0.1} />
        <StatCard icon={TrendingUp} label="Earnings" value={`$${stats.earnings.toFixed(2)}`} change="+5%" color="#FFD700" delay={0.15} />
      </div>

      {/* Quick Shorten */}
      <QuickShorten onCreated={loadDashboard} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Click Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-white">Clicks Overview</h3>
              <p className="text-xs text-[#6B7280] mt-0.5">Last 7 days</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#00BFFF]" />
                <span className="text-[#6B7280]">Clicks</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#8A2BE2]" />
                <span className="text-[#6B7280]">Unique</span>
              </div>
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayChartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00BFFF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00BFFF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorUnique" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8A2BE2" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8A2BE2" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#6B7280" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#6B7280" }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="clicks" name="Clicks" stroke="#00BFFF" strokeWidth={2} fill="url(#colorClicks)" />
                <Area type="monotone" dataKey="unique" name="Unique" stroke="#8A2BE2" strokeWidth={2} fill="url(#colorUnique)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quick stats sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card space-y-4"
        >
          <h3 className="font-semibold text-white">Quick Stats</h3>

          {[
            { label: "Click-through Rate", value: "68.3%", color: "#00BFFF", progress: 68 },
            { label: "Ads Completed", value: "42.1%", color: "#8A2BE2", progress: 42 },
            { label: "Mobile Traffic", value: "61.7%", color: "#00FF88", progress: 62 },
            { label: "Return Visitors", value: "28.4%", color: "#FFD700", progress: 28 },
          ].map(({ label, value, color, progress }) => (
            <div key={label}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-[#6B7280]">{label}</span>
                <span className="font-semibold" style={{ color }}>{value}</span>
              </div>
              <div className="progress-neon">
                <motion.div
                  className="progress-neon-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                  style={{ background: `linear-gradient(90deg, ${color}, ${color}99)` }}
                />
              </div>
            </div>
          ))}

          <Link href="/dashboard/analytics">
            <button className="btn-ghost w-full py-2.5 text-sm rounded-xl mt-2 flex items-center justify-center gap-2">
              <Globe className="w-4 h-4" /> View Full Analytics
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Recent Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-white">Recent Links</h3>
            <p className="text-xs text-[#6B7280] mt-0.5">Your latest shortened URLs</p>
          </div>
          <Link href="/dashboard/links">
            <button className="text-xs text-[#00BFFF] hover:underline flex items-center gap-1">
              View all <ExternalLink className="w-3 h-3" />
            </button>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-12 rounded-xl" />
            ))}
          </div>
        ) : (
          <RecentLinks links={recentLinks} />
        )}
      </motion.div>
    </div>
  );
}
