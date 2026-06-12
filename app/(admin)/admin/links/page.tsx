'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Link2, Search, Trash2, ExternalLink,
  ChevronLeft, ChevronRight, Copy,
} from 'lucide-react'
import { formatDate, formatNumber, buildShortUrl } from '@/lib/utils'
import toast from 'react-hot-toast'

interface AdminLink {
  id: string
  slug: string
  originalUrl: string
  title?: string
  clickCount: number
  isActive: boolean
  createdAt: string
  user?: { name: string; email: string }
}

export default function AdminLinksPage() {
  const [links, setLinks] = useState<AdminLink[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchLinks = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), ...(search && { search }) })
      const res = await fetch(`/api/admin/links?${params}`)
      const data = await res.json()
      setLinks(data.links || [])
      setTotal(data.total || 0)
      setPages(data.pages || 1)
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => { fetchLinks() }, [fetchLinks])

  const deleteLink = async (id: string, slug: string) => {
    if (!confirm(`Delete /${slug}? All analytics will be lost.`)) return
    try {
      const res = await fetch(`/api/admin/links?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Link deleted')
      setLinks(prev => prev.filter(l => l.id !== id))
      setTotal(prev => prev - 1)
    } catch {
      toast.error('Failed to delete link')
    }
  }

  const copyLink = (slug: string) => {
    navigator.clipboard.writeText(buildShortUrl(slug))
    toast.success('Copied!')
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <Link2 className="w-6 h-6 text-neon-blue" /> All Links
          </h1>
          <p className="text-dark-muted text-sm mt-1">{formatNumber(total)} links across all users</p>
        </div>
      </div>

      {/* Search */}
      <div className="glass-card p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search by slug, URL, or title..."
            className="input-neon w-full pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(8)].map((_, i) => <div key={i} className="h-12 skeleton rounded-lg" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-neon w-full">
              <thead>
                <tr>
                  <th>Short Link</th>
                  <th>Destination</th>
                  <th>Owner</th>
                  <th className="text-center">Clicks</th>
                  <th>Created</th>
                  <th className="w-20" />
                </tr>
              </thead>
              <tbody>
                {links.map((link, i) => (
                  <motion.tr
                    key={link.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                  >
                    <td>
                      <div className="flex items-center gap-2">
                        <code className="text-neon-blue font-mono text-sm">/{link.slug}</code>
                        {!link.isActive && (
                          <span className="text-xs text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded">off</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="max-w-xs">
                        {link.title && <p className="text-white text-sm truncate">{link.title}</p>}
                        <p className="text-dark-muted text-xs truncate">{link.originalUrl}</p>
                      </div>
                    </td>
                    <td>
                      {link.user ? (
                        <div>
                          <p className="text-white text-sm">{link.user.name}</p>
                          <p className="text-dark-muted text-xs">{link.user.email}</p>
                        </div>
                      ) : (
                        <span className="text-dark-muted text-xs">Anonymous</span>
                      )}
                    </td>
                    <td className="text-center">
                      <span className="text-white font-bold">{formatNumber(link.clickCount)}</span>
                    </td>
                    <td className="text-dark-muted text-sm">{formatDate(link.createdAt)}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => copyLink(link.slug)}
                          className="w-7 h-7 rounded hover:bg-white/5 flex items-center justify-center text-dark-muted hover:text-neon-blue transition-colors"
                          title="Copy short URL"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href={link.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-7 h-7 rounded hover:bg-white/5 flex items-center justify-center text-dark-muted hover:text-white transition-colors"
                          title="Visit URL"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => deleteLink(link.id, link.slug)}
                          className="w-7 h-7 rounded hover:bg-red-500/10 flex items-center justify-center text-dark-muted hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {links.length === 0 && (
              <div className="py-16 text-center text-dark-muted">No links found</div>
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
