'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Link2, Plus, Search, Copy, Trash2, QrCode,
  ExternalLink, ToggleLeft, ToggleRight, BarChart2,
  ChevronLeft, ChevronRight, Calendar, Lock,
} from 'lucide-react'
import { useLinks } from '@/hooks/useLinks'
import { QRCodeModal } from '@/components/dashboard/QRCodeModal'
import { CreateLinkModal } from '@/components/dashboard/CreateLinkModal'
import { buildShortUrl, formatDate, formatNumber } from '@/lib/utils'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function LinksPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('createdAt')
  const [qrLink, setQrLink] = useState<{ url: string; slug: string } | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const { links, total, loading, refetch, deleteLink, toggleLink } = useLinks({
    page, limit: 15, search, sort,
  })

  const pages = Math.ceil(total / 15)

  const copyLink = (slug: string) => {
    navigator.clipboard.writeText(buildShortUrl(slug))
    toast.success('Copied to clipboard!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <Link2 className="w-6 h-6 text-neon-blue" /> My Links
          </h1>
          <p className="text-dark-muted text-sm mt-1">{formatNumber(total)} total links</p>
        </div>
        <motion.button
          onClick={() => setShowCreate(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-neon flex items-center gap-2 px-4 py-2.5"
        >
          <Plus className="w-4 h-4" /> New Link
        </motion.button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search links by URL or alias..."
            className="input-neon w-full pl-9"
          />
        </div>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="input-neon"
        >
          <option value="createdAt">Newest First</option>
          <option value="clicks">Most Clicks</option>
          <option value="title">Title A-Z</option>
        </select>
      </div>

      {/* Links Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(6)].map((_, i) => <div key={i} className="h-16 skeleton rounded-lg" />)}
          </div>
        ) : links.length === 0 ? (
          <div className="py-24 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center">
              <Link2 className="w-8 h-8 text-neon-blue" />
            </div>
            <div>
              <p className="text-white font-semibold">No links yet</p>
              <p className="text-dark-muted text-sm mt-1">Create your first short link to get started</p>
            </div>
            <button onClick={() => setShowCreate(true)} className="btn-neon px-6 py-2.5 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Create Link
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-neon w-full">
              <thead>
                <tr>
                  <th>Link</th>
                  <th>Short URL</th>
                  <th className="text-center">Clicks</th>
                  <th className="text-center">Status</th>
                  <th>Created</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {links.map((link, i) => (
                  <motion.tr
                    key={link.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <td>
                      <div className="max-w-xs">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          {link.expiresAt && <Calendar className="w-3 h-3 text-orange-400 flex-shrink-0" />}
                          <p className="text-white text-sm font-medium truncate">
                            {link.title || 'Untitled link'}
                          </p>
                        </div>
                        <p className="text-dark-muted text-xs truncate">{link.originalUrl}</p>
                      </div>
                    </td>
                    <td>
                      <code className="text-neon-blue text-sm font-mono">
                        /{link.slug}
                      </code>
                    </td>
                    <td className="text-center">
                      <span className="text-white font-bold">{formatNumber(link.clickCount)}</span>
                    </td>
                    <td className="text-center">
                      <button onClick={() => toggleLink(link.id, !link.isActive)}>
                        {link.isActive
                          ? <ToggleRight className="w-5 h-5 text-green-400" />
                          : <ToggleLeft className="w-5 h-5 text-dark-muted" />
                        }
                      </button>
                    </td>
                    <td className="text-dark-muted text-sm">{formatDate(link.createdAt)}</td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => copyLink(link.slug)}
                          className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-dark-muted hover:text-neon-blue transition-colors"
                          title="Copy short URL"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setQrLink({ url: buildShortUrl(link.slug), slug: link.slug })}
                          className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-dark-muted hover:text-neon-purple transition-colors"
                          title="QR Code"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href={link.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-dark-muted hover:text-white transition-colors"
                          title="Visit destination"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <Link
                          href={`/dashboard/analytics?linkId=${link.id}`}
                          className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-dark-muted hover:text-green-400 transition-colors"
                          title="Analytics"
                        >
                          <BarChart2 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => deleteLink(link.id)}
                          className="w-8 h-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-dark-muted hover:text-red-400 transition-colors"
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
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
            <span className="text-sm text-dark-muted">
              Showing {(page - 1) * 15 + 1}–{Math.min(page * 15, total)} of {formatNumber(total)}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-ghost px-3 py-1.5 text-sm disabled:opacity-40 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              <button
                onClick={() => setPage(p => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="btn-ghost px-3 py-1.5 text-sm disabled:opacity-40 flex items-center gap-1"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {qrLink && (
        <QRCodeModal url={qrLink.url} slug={qrLink.slug} onClose={() => setQrLink(null)} />
      )}
      {showCreate && (
        <CreateLinkModal
          onClose={() => setShowCreate(false)}
          onCreated={() => { refetch(); setShowCreate(false) }}
        />
      )}
    </div>
  )
}
