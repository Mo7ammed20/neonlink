'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return toast.error('Enter your email address')

    setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Request failed')
      }
      setSent(true)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="glass-card p-8 text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto"
        >
          <CheckCircle className="w-8 h-8 text-green-400" />
        </motion.div>
        <h2 className="text-xl font-display font-bold text-white">Check your inbox</h2>
        <p className="text-dark-muted text-sm">
          We sent a password reset link to <span className="text-white font-medium">{email}</span>.
          The link expires in 1 hour.
        </p>
        <Link href="/login" className="btn-ghost w-full py-2.5 text-sm flex items-center justify-center gap-2 mt-4">
          <ArrowLeft className="w-4 h-4" /> Back to Sign In
        </Link>
      </div>
    )
  }

  return (
    <div className="glass-card p-8 space-y-6">
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-blue/30 to-neon-purple/30 border border-neon-blue/30 flex items-center justify-center mx-auto"
        >
          <Mail className="w-7 h-7 text-neon-blue" />
        </motion.div>
        <h1 className="text-2xl font-display font-bold text-white">Reset Password</h1>
        <p className="text-dark-muted text-sm">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm text-dark-muted">Email address</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="input-neon w-full"
            autoFocus
          />
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-neon w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
          ) : (
            <><Mail className="w-4 h-4" /> Send Reset Link</>
          )}
        </motion.button>
      </form>

      <Link
        href="/login"
        className="flex items-center justify-center gap-2 text-sm text-dark-muted hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Sign In
      </Link>
    </div>
  )
}
