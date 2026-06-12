'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart2, Globe, Monitor, Chrome, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { formatNumber } from '@/lib/utils'

const COLORS = ['#00BFFF', '#8A2BE2', '#00FF88', '#FF6B6B', '#FFB347', '#87CEEB', '#DDA0DD', '#98FB98']

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass px-3 py-2 rounded-lg text-sm">
      <p className="text-dark-muted">{label}</p>
      <p className="text-neon-blue font-bold">{formatNumber(payload[0].value)}</p>
    </div>
  )
}

export default function AdminReportsPage() {
  const [data, setData] = useState<any>(null)
  const [period, setPeriod] = useState(30)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ period: String(period) })
    Promise.all([
      fetch(`/api/analytics/summary?${params}`).then(r => r.json()),
      fetch(`/api/analytics/chart?${params}`).then(r => r.json()),
    ]).then(([summary, chart]) => {
      setData({ ...summary, chartData: chart.chartData || [] })
    }).finally(() => setLoading(false))
  }, [period])

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-8 skeleton rounded-lg w-48" />
        <div className="grid grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => <div key={i} className="h-28 skeleton rounded-xl" />)}
        </div>
        <div className="h-72 skeleton rounded-xl" />
      </div>
    )
  }

  const stats = [
    { label: 'Total Clicks', value: data?.totalClicks || 0, icon: TrendingUp, color: 'text-neon-blue' },
    { label: 'Unique Visitors', value: data?.uniqueVisitors || 0, icon: Monitor, color: 'text-neon-purple' },
    { label: 'Countries', value: (data?.countries?.length || 0), icon: Globe, color: 'text-green-400' },
  ]

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-neon-blue" /> Platform Reports
          </h1>
          <p className="text-dark-muted text-sm mt-1">Global traffic analytics</p>
        </div>
        <div className="flex gap-2">
          {[7, 30, 90].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-sm rounded-lg border transition-all ${period === p ? 'border-neon-blue bg-neon-blue/10 text-neon-blue' : 'border-white/10 text-dark-muted hover:text-white hover:border-white/20'}`}>
              {p}d
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => {
          const Icon = s.icon
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="glass-card p-6 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${s.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-dark-muted text-sm">{s.label}</p>
                <p className={`text-2xl font-display font-bold ${s.color}`}>{formatNumber(s.value)}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Clicks chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
        <h2 className="text-lg font-display font-semibold text-white mb-6">Click Trends</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data?.chartData || []}>
            <XAxis dataKey="date" tick={{ fill: '#6B7280', fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="clicks" fill="#00BFFF" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Bottom charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Countries */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass-card p-6 xl:col-span-2">
          <h2 className="text-lg font-display font-semibold text-white mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-neon-blue" /> Top Countries
          </h2>
          <div className="space-y-3">
            {(data?.countries || []).slice(0, 8).map((country: any, i: number) => {
              const maxClicks = data.countries[0]?.clicks || 1
              const pct = (country.clicks / maxClicks) * 100
              return (
                <div key={country.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white">{country.name}</span>
                    <span className="text-dark-muted">{formatNumber(country.clicks)}</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.5 + i * 0.05, duration: 0.6 }}
                      className="h-full rounded-full"
                      style={{ background: COLORS[i % COLORS.length] }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Devices pie */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="glass-card p-6">
          <h2 className="text-lg font-display font-semibold text-white mb-4 flex items-center gap-2">
            <Monitor className="w-5 h-5 text-neon-purple" /> Devices
          </h2>
          {data?.devices?.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={data.devices} dataKey="clicks" nameKey="name" cx="50%" cy="50%" outerRadius={75} strokeWidth={0}>
                    {data.devices.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatNumber(v)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1 mt-2">
                {data.devices.map((d: any, i: number) => (
                  <div key={d.name} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-dark-muted flex-1">{d.name}</span>
                    <span className="text-white font-medium">{formatNumber(d.clicks)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-dark-muted text-sm">No data yet</p>
          )}
        </motion.div>
      </div>
    </div>
  )
}
