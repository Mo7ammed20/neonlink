"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from "recharts";
import { Globe, Monitor, Smartphone, Tablet, TrendingUp, Download } from "lucide-react";
import { cn, formatNumber, exportToCSV, CHART_COLORS } from "@/lib/utils";

type Period = "7d" | "30d" | "90d";

const PERIODS: { label: string; value: Period }[] = [
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
  { label: "90 days", value: "90d" },
];

// Mock data generators for display
function generateClickData(days: number) {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      clicks: Math.floor(Math.random() * 300) + 50,
      unique: Math.floor(Math.random() * 150) + 20,
      ads_completed: Math.floor(Math.random() * 100) + 10,
    };
  });
}

const countryData = [
  { country: "United States", code: "US", clicks: 4820, percentage: 34.2 },
  { country: "United Kingdom", code: "GB", clicks: 1920, percentage: 13.6 },
  { country: "Germany", code: "DE", clicks: 1540, percentage: 10.9 },
  { country: "India", code: "IN", clicks: 1380, percentage: 9.8 },
  { country: "Canada", code: "CA", clicks: 1100, percentage: 7.8 },
  { country: "France", code: "FR", clicks: 890, percentage: 6.3 },
  { country: "Other", code: "XX", clicks: 2460, percentage: 17.4 },
];

const deviceData = [
  { name: "Desktop", value: 52, color: "#00BFFF" },
  { name: "Mobile", value: 38, color: "#8A2BE2" },
  { name: "Tablet", value: 10, color: "#00FF88" },
];

const browserData = [
  { name: "Chrome", value: 62, color: "#00BFFF" },
  { name: "Safari", value: 18, color: "#8A2BE2" },
  { name: "Firefox", value: 11, color: "#FF007F" },
  { name: "Edge", value: 6, color: "#00FF88" },
  { name: "Other", value: 3, color: "#FFD700" },
];

const referrerData = [
  { source: "Direct", clicks: 3200, color: "#00BFFF" },
  { source: "Twitter/X", clicks: 1840, color: "#8A2BE2" },
  { source: "Facebook", clicks: 1320, color: "#FF007F" },
  { source: "Instagram", clicks: 980, color: "#00FF88" },
  { source: "Reddit", clicks: 760, color: "#FFD700" },
  { source: "WhatsApp", clicks: 640, color: "#FF6B6B" },
  { source: "Other", clicks: 1060, color: "#4ECDC4" },
];

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl p-3 border border-[rgba(0,191,255,0.2)] text-xs space-y-1">
      {label && <p className="text-[#6B7280] mb-1 font-medium">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="font-semibold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-[#9CA3AF]">{p.name}:</span>
          <span style={{ color: p.color }}>{formatNumber(p.value)}</span>
        </p>
      ))}
    </div>
  );
}

function PieTooltip({ active, payload }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { color: string } }>;
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="glass rounded-xl p-3 border border-[rgba(0,191,255,0.2)] text-xs">
      <p className="font-semibold" style={{ color: item.payload.color }}>
        {item.name}: {item.value}%
      </p>
    </div>
  );
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("30d");
  const [loading, setLoading] = useState(false);
  const [clickData, setClickData] = useState(generateClickData(30));

  useEffect(() => {
    setLoading(true);
    const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
    setTimeout(() => {
      setClickData(generateClickData(days));
      setLoading(false);
    }, 400);
  }, [period]);

  const totalClicks = clickData.reduce((s, d) => s + d.clicks, 0);
  const totalUnique = clickData.reduce((s, d) => s + d.unique, 0);
  const totalAds = clickData.reduce((s, d) => s + d.ads_completed, 0);

  function handleExport() {
    exportToCSV(
      clickData.map(d => ({ Date: d.date, Clicks: d.clicks, "Unique Visitors": d.unique, "Ads Completed": d.ads_completed })),
      `analytics-${period}`
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2 p-1 glass rounded-xl">
          {PERIODS.map(p => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                period === p.value
                  ? "bg-gradient-to-r from-[#00BFFF] to-[#8A2BE2] text-white shadow-[0_0_15px_rgba(0,191,255,0.3)]"
                  : "text-[#6B7280] hover:text-white"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleExport}
          className="btn-ghost px-4 py-2 rounded-xl text-sm flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Clicks", value: totalClicks, icon: TrendingUp, color: "#00BFFF" },
          { label: "Unique Visitors", value: totalUnique, icon: Globe, color: "#8A2BE2" },
          { label: "Ads Completed", value: totalAds, icon: Monitor, color: "#00FF88" },
        ].map(({ label, value, icon: Icon, color }, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="stat-card">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold font-display text-white">{formatNumber(value)}</p>
              <p className="text-sm text-[#6B7280]">{label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Click Trend Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-white">Traffic Over Time</h3>
            <p className="text-xs text-[#6B7280]">Clicks, unique visitors, and ad completions</p>
          </div>
          <div className="flex gap-4 text-xs">
            {[
              { label: "Clicks", color: "#00BFFF" },
              { label: "Unique", color: "#8A2BE2" },
              { label: "Ads", color: "#00FF88" },
            ].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                <span className="text-[#6B7280]">{label}</span>
              </div>
            ))}
          </div>
        </div>
        {loading ? (
          <div className="skeleton h-64 rounded-xl" />
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={clickData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  {[
                    { id: "clicks", color: "#00BFFF" },
                    { id: "unique", color: "#8A2BE2" },
                    { id: "ads", color: "#00FF88" },
                  ].map(({ id, color }) => (
                    <linearGradient key={id} id={`color_${id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#6B7280" }} tickLine={false} axisLine={false}
                  interval={Math.floor(clickData.length / 7)} />
                <YAxis tick={{ fontSize: 9, fill: "#6B7280" }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="clicks" name="Clicks" stroke="#00BFFF" strokeWidth={2} fill="url(#color_clicks)" />
                <Area type="monotone" dataKey="unique" name="Unique" stroke="#8A2BE2" strokeWidth={2} fill="url(#color_unique)" />
                <Area type="monotone" dataKey="ads_completed" name="Ads" stroke="#00FF88" strokeWidth={2} fill="url(#color_ads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>

      {/* Two-column charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Devices */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card">
          <h3 className="font-semibold text-white mb-1">Devices</h3>
          <p className="text-xs text-[#6B7280] mb-5">Traffic by device type</p>
          <div className="flex items-center gap-6">
            <div className="h-44 w-44 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={deviceData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                    {deviceData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-3">
              {deviceData.map((d) => (
                <div key={d.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <div className="flex items-center gap-2">
                      {d.name === "Desktop" ? <Monitor className="w-3.5 h-3.5" style={{ color: d.color }} />
                        : d.name === "Mobile" ? <Smartphone className="w-3.5 h-3.5" style={{ color: d.color }} />
                        : <Tablet className="w-3.5 h-3.5" style={{ color: d.color }} />}
                      <span className="text-[#9CA3AF]">{d.name}</span>
                    </div>
                    <span className="font-semibold" style={{ color: d.color }}>{d.value}%</span>
                  </div>
                  <div className="progress-neon" style={{ height: 4 }}>
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${d.value}%` }}
                      transition={{ delay: 0.5 + deviceData.indexOf(d) * 0.1, duration: 0.8, ease: "easeOut" }}
                      style={{ background: d.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Browsers */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card">
          <h3 className="font-semibold text-white mb-1">Browsers</h3>
          <p className="text-xs text-[#6B7280] mb-5">Traffic by browser</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={browserData} layout="vertical" margin={{ left: 0, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 9, fill: "#6B7280" }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#9CA3AF" }} tickLine={false} axisLine={false} width={55} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Share %" radius={[0, 6, 6, 0]}>
                  {browserData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Countries */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card">
        <h3 className="font-semibold text-white mb-1">Top Countries</h3>
        <p className="text-xs text-[#6B7280] mb-5">Geographic distribution of clicks</p>
        <div className="space-y-3">
          {countryData.map((c, i) => (
            <div key={c.country} className="flex items-center gap-4">
              <span className="text-sm font-mono text-[#6B7280] w-5 text-right">{i + 1}</span>
              <span className="text-lg">{c.code === "XX" ? "🌍" : `🏳`}</span>
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#F0F4FF] font-medium">{c.country}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[#6B7280]">{formatNumber(c.clicks)}</span>
                    <span className="font-semibold text-[#00BFFF] w-12 text-right">{c.percentage}%</span>
                  </div>
                </div>
                <div className="progress-neon" style={{ height: 5 }}>
                  <motion.div
                    className="progress-neon-fill h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${c.percentage}%` }}
                    transition={{ delay: 0.4 + i * 0.05, duration: 0.8, ease: "easeOut" }}
                    style={{
                      background: `linear-gradient(90deg, ${CHART_COLORS[i]}, ${CHART_COLORS[i]}80)`,
                      boxShadow: `0 0 6px ${CHART_COLORS[i]}50`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Referrers */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card">
        <h3 className="font-semibold text-white mb-1">Traffic Sources</h3>
        <p className="text-xs text-[#6B7280] mb-5">Where your clicks are coming from</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={referrerData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="source" tick={{ fontSize: 10, fill: "#6B7280" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#6B7280" }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="clicks" name="Clicks" radius={[6, 6, 0, 0]}>
                {referrerData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
