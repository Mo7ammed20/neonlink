'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Link2, Loader2, Calendar, Lock, Hash, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { isValidUrl, buildShortUrl } from '@/lib/utils'

interface CreateLinkModalProps {
  onClose: () => void
  onCreated: (link: { slug: string; shortUrl: string }) => void
}

export function CreateLinkModal({ onClose, onCreated }: CreateLinkModalProps) {
  const [url, setUrl] = useState('')
  const [alias, setAlias] = useState('')
  const [title, setTitle] = useState('')
  const [password, setPassword] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return toast.error('Enter a URL to shorten')
    if (!isValidUrl(url)) return toast.error('Enter a valid URL')

    setLoading(true)
    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          customSlug: alias || undefined,
          title: title || undefined,
          password: password || undefined,
          expiresAt: expiresAt || undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create link')

      // API returns { success, data: { slug, shortUrl, ... } }
      const shortUrl = data.data?.shortUrl || `${window.location.origin}/${data.data?.slug}`
      toast.success('Link created!')
      onCreated({ slug: data.data.slug, shortUrl })
      onClose()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={e => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="glass-card p-6 w-full max-w-lg space-y-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-neon-blue/20 border border-neon-blue/30 flex items-center justify-center">
                <Link2 className="w-4 h-4 text-neon-blue" />
              </div>
              <h2 className="text-lg font-display font-bold text-white">Create Short Link</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-dark-muted hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Destination URL */}
            <div className="space-y-1">
              <label className="text-sm text-dark-muted">Destination URL <span className="text-red-400">*</span></label>
              <input
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://example.com/very-long-url"
                className="input-neon w-full"
                autoFocus
              />
            </div>

            {/* Title */}
            <div className="space-y-1">
              <label className="text-sm text-dark-muted">Link title (optional)</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="My awesome link"
                className="input-neon w-full"
              />
            </div>

            {/* Advanced options toggle */}
            <button
              type="button"
              onClick={() => setShowAdvanced(v => !v)}
              className="flex items-center gap-2 text-sm text-dark-muted hover:text-white transition-colors"
            >
              {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              Advanced options
            </button>

            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-4"
                >
                  {/* Custom alias */}
                  <div className="space-y-1">
                    <label className="text-sm text-dark-muted flex items-center gap-1">
                      <Hash className="w-3.5 h-3.5" /> Custom alias
                    </label>
                    <div className="flex items-center">
                      <span className="px-3 py-2.5 text-sm text-dark-muted bg-white/5 border border-white/10 border-r-0 rounded-l-lg whitespace-nowrap">
                        domain.com/
                      </span>
                      <input
                        type="text"
                        value={alias}
                        onChange={e => setAlias(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                        placeholder="my-link"
                        className="input-neon rounded-l-none flex-1"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <label className="text-sm text-dark-muted flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> Password protection
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Leave blank for no password"
                      className="input-neon w-full"
                    />
                  </div>

                  {/* Expiration */}
                  <div className="space-y-1">
                    <label className="text-sm text-dark-muted flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Expiration date
                    </label>
                    <input
                      type="datetime-local"
                      value={expiresAt}
                      onChange={e => setExpiresAt(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      className="input-neon w-full"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn-ghost flex-1 py-3">
                Cancel
              </button>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-neon flex-1 py-3 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</>
                ) : (
                  <><Link2 className="w-4 h-4" /> Create Link</>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
