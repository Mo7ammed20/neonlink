'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users, Link2, MousePointerClick, Activity,
  TrendingUp, ExternalLink, Crown, Clock
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { formatNumber, formatDate } from '@/lib/utils'

interface AdminStats {
  stats: { totalUsers: number; totalLinks: number; totalClicks: number; activeUsers: number }
  chartData: { date: string; clicks: number }[]
  recentUsers: { id: string; name: string; email: string; plan: string; createdAt: string; _count: { links: number } }[]
  topLinks: { id: string; slug: string; originalUrl: string; clickCount: number; createdAt: string; user?: { name: string } }[]
}

const statCards = [
  { key: 'totalUsers', label: 'Total Users', icon: Users, color: 'text-neon-blue', bg: 'bg-neon-blue/10', border: 'border-neon-blue/20' },
  { key: 'totalLinks', label: 'Total Links', icon: Link2, color: 'text-neon-purple', bg: 'bg-neon-purple/10', border: 'border-neon-purple/20' },
  { key: 'totalClicks', label: 'Total Clicks', icon: MousePointerClick, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' },
  { key: 'activeUsers', label: 'Active Users', icon: Activity, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
]

const planColors: Record<string, string> = {
  FREE: 'bg-gray-500/20 text-gray-400',
  PRO: 'bg-neon-blue/20 text-neon-blue',
  BUSINESS: 'bg-neon-purple/20 text-neon-purple',
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass px-3 py-2 rounded-lg text-sm">
      <p className="text-dark-muted">{label}</p>
      <p className="text-neon-blue font-bold">{formatNumber(payload[0].value)} clicks</p>
    </div>
  )
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin')
      .then(r => r.json())
      .then(d => setData(d))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-8 skeleton rounded-lg w-64" />
        <div className="grid grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 skeleton rounded-xl" />)}
        </div>
        <div className="h-72 skeleton rounded-xl" />
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Admin Dashboard</h1>
        <p className="text-dark-muted text-sm mt-1">Platform overview and statistics</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((card, i) => {
          const Icon = card.icon
          const value = data.stats[card.key as keyof typeof data.stats]
          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-dark-muted text-sm">{card.label}</p>
                  <p className={`text-3xl font-display font-bold mt-1 ${card.color}`}>
                    {formatNumber(value)}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-xl ${card.bg} border ${card.border} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-neon-blue" />
          <h2 className="text-lg font-display font-semibold text-white">7-Day Click Activity</h2>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data.chartData}>
            <defs>
              <linearGradient id="adminGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00BFFF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00BFFF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fill: '#6B7280', fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="clicks" stroke="#00BFFF" fill="url(#adminGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Bottom tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Users */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-display font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-neon-blue" /> Recent Users
          </h2>
          <div className="space-y-3">
            {data.recentUsers.map(user => (
              <div key={user.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">{user.name}</p>
                  <p className="text-dark-muted text-xs truncate">{user.email}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                  <span className="text-xs text-dark-muted">{user._count.links} links</span>
                  <span className={`badge-neon text-xs py-0.5 px-2 rounded-full ${planColors[user.plan]}`}>
                    {user.plan}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Links */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-display font-semibold text-white mb-4 flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-400" /> Top Links
          </h2>
          <div className="space-y-3">
            {data.topLinks.map((link, i) => (
              <div key={link.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <span className="text-2xl font-display font-bold text-dark-muted w-6 flex-shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <code className="text-neon-blue text-sm font-mono">/{link.slug}</code>
                    <a
                      href={link.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-dark-muted hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-dark-muted text-xs truncate">{link.originalUrl}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-white font-bold text-sm">{formatNumber(link.clickCount)}</p>
                  <p className="text-dark-muted text-xs">clicks</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
