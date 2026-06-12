'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Key, Plus, Trash2, Copy, Eye, EyeOff, Loader2, Code } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatDate } from '@/lib/utils'

interface ApiKey {
  id: string
  name: string
  key: string
  createdAt: string
  lastUsed?: string
  usageCount: number
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchKeys()
  }, [])

  const fetchKeys = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/user/api-keys')
      const data = await res.json()
      setKeys(data.keys || [])
    } finally {
      setLoading(false)
    }
  }

  const createKey = async () => {
    if (!newKeyName.trim()) return toast.error('Enter a key name')
    setCreating(true)
    try {
      const res = await fetch('/api/user/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('API key created!')
      setKeys(prev => [data.apiKey, ...prev])
      setVisibleKeys(prev => new Set([...prev, data.apiKey.id]))
      setNewKeyName('')
      setShowInput(false)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create key')
    } finally {
      setCreating(false)
    }
  }

  const deleteKey = async (id: string) => {
    if (!confirm('Delete this API key? Any integrations using it will stop working.')) return
    try {
      const res = await fetch(`/api/user/api-keys?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setKeys(prev => prev.filter(k => k.id !== id))
      toast.success('API key deleted')
    } catch {
      toast.error('Failed to delete key')
    }
  }

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    toast.success('API key copied!')
  }

  const toggleVisible = (id: string) => {
    setVisibleKeys(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const maskKey = (key: string) => `${key.slice(0, 8)}${'•'.repeat(24)}${key.slice(-4)}`

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <Key className="w-6 h-6 text-neon-blue" /> API Keys
          </h1>
          <p className="text-dark-muted text-sm mt-1">Programmatic access to your NeonLink account</p>
        </div>
        {!showInput && (
          <motion.button
            onClick={() => setShowInput(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-neon flex items-center gap-2 px-4 py-2.5"
          >
            <Plus className="w-4 h-4" /> New API Key
          </motion.button>
        )}
      </div>

      {/* Create new key */}
      {showInput && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="glass-card p-5"
        >
          <h2 className="text-lg font-display font-semibold text-white mb-4">Create API Key</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={newKeyName}
              onChange={e => setNewKeyName(e.target.value)}
              placeholder="e.g. My App, Zapier, Production"
              className="input-neon flex-1"
              autoFocus
              onKeyDown={e => e.key === 'Enter' && createKey()}
            />
            <button
              onClick={() => { setShowInput(false); setNewKeyName('') }}
              className="btn-ghost px-4"
            >
              Cancel
            </button>
            <motion.button
              onClick={createKey}
              disabled={creating}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-neon px-4 flex items-center gap-2 disabled:opacity-50"
            >
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Create
            </motion.button>
          </div>
          <p className="text-xs text-dark-muted mt-2">The key will only be shown once. Copy it immediately!</p>
        </motion.div>
      )}

      {/* API Keys list */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-16 skeleton rounded-lg" />)}
          </div>
        ) : keys.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center">
              <Key className="w-7 h-7 text-neon-blue" />
            </div>
            <div className="text-center">
              <p className="text-white font-semibold">No API keys</p>
              <p className="text-dark-muted text-sm mt-1">Create an API key to integrate NeonLink with your apps</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {keys.map(apiKey => (
              <motion.div
                key={apiKey.id}
                layout
                className="flex items-center justify-between p-5 gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Key className="w-4 h-4 text-neon-blue flex-shrink-0" />
                    <span className="text-white font-medium">{apiKey.name}</span>
                    <span className="text-xs text-dark-muted bg-white/5 px-2 py-0.5 rounded">
                      {apiKey.usageCount} calls
                    </span>
                  </div>
                  <code className="text-sm font-mono text-neon-blue/70">
                    {visibleKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                  </code>
                  <p className="text-xs text-dark-muted mt-1">
                    Created {formatDate(apiKey.createdAt)}
                    {apiKey.lastUsed && ` · Last used ${formatDate(apiKey.lastUsed)}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleVisible(apiKey.id)}
                    className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-dark-muted hover:text-white transition-colors"
                  >
                    {visibleKeys.has(apiKey.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => copyKey(apiKey.key)}
                    className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-dark-muted hover:text-neon-blue transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteKey(apiKey.id)}
                    className="w-8 h-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-dark-muted hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* API Docs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 space-y-4"
      >
        <h2 className="text-lg font-display font-semibold text-white flex items-center gap-2">
          <Code className="w-5 h-5 text-neon-purple" /> Quick Reference
        </h2>
        <div className="space-y-3">
          <div className="bg-dark-card rounded-xl p-4 font-mono text-sm overflow-x-auto">
            <p className="text-dark-muted text-xs mb-2"># Shorten a URL</p>
            <pre className="text-green-400">{`curl -X POST /api/shorten \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com"}'`}</pre>
          </div>
          <div className="bg-dark-card rounded-xl p-4 font-mono text-sm overflow-x-auto">
            <p className="text-dark-muted text-xs mb-2"># Response</p>
            <pre className="text-neon-blue">{`{
  "success": true,
  "link": {
    "slug": "AbC123",
    "shortUrl": "https://yourdomain.com/AbC123"
  }
}`}</pre>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
