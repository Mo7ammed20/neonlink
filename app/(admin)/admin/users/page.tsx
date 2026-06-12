'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Users, Search, Trash2, Shield, Crown,
  ChevronLeft, ChevronRight, MoreVertical, UserCheck, UserX,
} from 'lucide-react'
import { formatDate, formatNumber } from '@/lib/utils'
import toast from 'react-hot-toast'

interface User {
  id: string
  name: string
  email: string
  plan: string
  role: string
  status: string
  createdAt: string
  totalClicks: number
  _count: { links: number }
}

const planColors: Record<string, string> = {
  FREE: 'text-gray-400 bg-gray-500/20',
  PRO: 'text-neon-blue bg-neon-blue/20',
  BUSINESS: 'text-neon-purple bg-neon-purple/20',
}
const plans = ['FREE', 'PRO', 'BUSINESS']

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page),
        ...(search && { search }),
        ...(planFilter && { plan: planFilter }),
      })
      const res = await fetch(`/api/admin/users?${params}`)
      const data = await res.json()
      setUsers(data.users || [])
      setTotal(data.total || 0)
      setPages(data.pages || 1)
    } finally {
      setLoading(false)
    }
  }, [page, search, planFilter])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const updateUser = async (userId: string, updates: Partial<User>) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...updates }),
      })
      if (!res.ok) throw new Error()
      toast.success('User updated')
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u))
    } catch {
      toast.error('Failed to update user')
    }
    setOpenMenu(null)
  }

  const deleteUser = async (userId: string) => {
    if (!confirm('Delete this user? This cannot be undone.')) return
    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('User deleted')
      setUsers(prev => prev.filter(u => u.id !== userId))
    } catch {
      toast.error('Failed to delete user')
    }
    setOpenMenu(null)
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-neon-blue" /> Users
          </h1>
          <p className="text-dark-muted text-sm mt-1">{formatNumber(total)} total users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search by name or email..."
            className="input-neon w-full pl-9"
          />
        </div>
        <select
          value={planFilter}
          onChange={e => { setPlanFilter(e.target.value); setPage(1) }}
          className="input-neon"
        >
          <option value="">All plans</option>
          {plans.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-12 skeleton rounded-lg" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-neon w-full">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Plan</th>
                  <th>Links</th>
                  <th>Clicks</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-dark-muted text-xs">{user.email}</p>
                      </div>
                    </td>
                    <td>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${planColors[user.plan]}`}>
                        {user.plan}
                      </span>
                    </td>
                    <td className="text-white">{user._count.links}</td>
                    <td className="text-white">{formatNumber(user.totalClicks)}</td>
                    <td>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        user.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="text-dark-muted text-sm">{formatDate(user.createdAt)}</td>
                    <td className="relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
                        className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-dark-muted hover:text-white"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {openMenu === user.id && (
                        <div className="absolute right-0 top-10 z-20 glass-card border border-white/10 rounded-xl py-1 w-48 shadow-neon-sm">
                          {plans.map(p => p !== user.plan && (
                            <button key={p} onClick={() => updateUser(user.id, { plan: p as any })}
                              className="w-full text-left px-4 py-2 text-sm text-dark-muted hover:text-white hover:bg-white/5 flex items-center gap-2">
                              <Crown className="w-3.5 h-3.5" /> Set {p}
                            </button>
                          ))}
                          {user.role !== 'ADMIN' && (
                            <button onClick={() => updateUser(user.id, { role: 'ADMIN' })}
                              className="w-full text-left px-4 py-2 text-sm text-yellow-400 hover:bg-white/5 flex items-center gap-2">
                              <Shield className="w-3.5 h-3.5" /> Make Admin
                            </button>
                          )}
                          <button onClick={() => updateUser(user.id, { status: user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' })}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-white/5 flex items-center gap-2 ${user.status === 'ACTIVE' ? 'text-orange-400' : 'text-green-400'}`}>
                            {user.status === 'ACTIVE' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                            {user.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                          </button>
                          <div className="border-t border-white/5 mt-1 pt-1">
                            <button onClick={() => deleteUser(user.id)}
                              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 flex items-center gap-2">
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="py-16 text-center text-dark-muted">No users found</div>
            )}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
            <span className="text-sm text-dark-muted">Page {page} of {pages}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="btn-ghost px-3 py-1.5 text-sm disabled:opacity-40 flex items-center gap-1">
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                className="btn-ghost px-3 py-1.5 text-sm disabled:opacity-40 flex items-center gap-1">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
