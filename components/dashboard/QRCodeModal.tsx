'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, Copy, QrCode } from 'lucide-react'
import toast from 'react-hot-toast'

interface QRCodeModalProps {
  url: string
  slug: string
  onClose: () => void
}

export function QRCodeModal({ url, slug, onClose }: QRCodeModalProps) {
  const [format, setFormat] = useState<'svg' | 'png'>('svg')
  const [qrUrl, setQrUrl] = useState('')

  useEffect(() => {
    setQrUrl(`/api/qr?url=${encodeURIComponent(url)}&format=${format}&size=256`)
  }, [url, format])

  const handleDownload = async () => {
    try {
      const res = await fetch(`/api/qr?url=${encodeURIComponent(url)}&format=png&size=512`)
      const blob = await res.blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `qr-${slug}.png`
      a.click()
      URL.revokeObjectURL(a.href)
      toast.success('QR code downloaded!')
    } catch {
      toast.error('Failed to download QR code')
    }
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(url)
    toast.success('URL copied!')
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
          className="glass-card p-6 w-full max-w-sm space-y-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-neon-blue/20 border border-neon-blue/30 flex items-center justify-center">
                <QrCode className="w-4 h-4 text-neon-blue" />
              </div>
              <h2 className="text-lg font-display font-bold text-white">QR Code</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-dark-muted hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* QR Image */}
          <div className="flex items-center justify-center">
            <div className="w-56 h-56 rounded-xl bg-dark-card border border-white/10 overflow-hidden flex items-center justify-center">
              {qrUrl && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={qrUrl} alt="QR Code" className="w-48 h-48" />
              )}
            </div>
          </div>

          {/* URL display */}
          <div className="space-y-1">
            <label className="text-xs text-dark-muted">Short URL</label>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs font-mono text-neon-blue bg-neon-blue/10 border border-neon-blue/20 rounded-lg px-3 py-2 truncate">
                {url}
              </code>
              <button
                onClick={handleCopyUrl}
                className="btn-ghost px-3 py-2 text-xs flex items-center gap-1 flex-shrink-0"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Format selector */}
          <div className="flex gap-2">
            <button
              onClick={() => setFormat('svg')}
              className={`flex-1 py-2 text-sm rounded-lg border transition-all ${
                format === 'svg'
                  ? 'border-neon-blue bg-neon-blue/10 text-neon-blue'
                  : 'border-white/10 text-dark-muted hover:text-white hover:border-white/20'
              }`}
            >
              SVG
            </button>
            <button
              onClick={() => setFormat('png')}
              className={`flex-1 py-2 text-sm rounded-lg border transition-all ${
                format === 'png'
                  ? 'border-neon-blue bg-neon-blue/10 text-neon-blue'
                  : 'border-white/10 text-dark-muted hover:text-white hover:border-white/20'
              }`}
            >
              PNG
            </button>
          </div>

          {/* Actions */}
          <motion.button
            onClick={handleDownload}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-neon w-full py-3 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download QR Code
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
