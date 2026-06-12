'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2, Zap, Github, Chrome } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email || !form.password) return toast.error('Fill in all fields')

    setLoading(true)
    try {
      const result = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error('Invalid email or password')
      } else {
        toast.success('Welcome back!')
        router.push(callbackUrl)
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-card p-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center mx-auto"
        >
          <Zap className="w-7 h-7 text-white" />
        </motion.div>
        <h1 className="text-2xl font-display font-bold text-white">Welcome Back</h1>
        <p className="text-dark-muted text-sm">Sign in to your NeonLink account</p>
      </div>

      {/* OAuth Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => signIn('google', { callbackUrl })}
          className="btn-ghost py-2.5 text-sm flex items-center justify-center gap-2"
        >
          <Chrome className="w-4 h-4" />
          Google
        </button>
        <button
          type="button"
          onClick={() => signIn('github', { callbackUrl })}
          className="btn-ghost py-2.5 text-sm flex items-center justify-center gap-2"
        >
          <Github className="w-4 h-4" />
          GitHub
        </button>
      </div>

      <div className="relative flex items-center">
        <div className="flex-1 border-t border-white/10" />
        <span className="px-3 text-dark-muted text-xs">or continue with email</span>
        <div className="flex-1 border-t border-white/10" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm text-dark-muted">Email address</label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder="you@example.com"
            className="input-neon w-full"
            autoComplete="email"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-sm text-dark-muted">Password</label>
            <Link href="/forgot-password" className="text-xs text-neon-blue hover:text-neon-purple transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
              className="input-neon w-full pr-10"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPass(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-muted hover:text-white transition-colors"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-neon w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
          ) : (
            <><Zap className="w-4 h-4" /> Sign In</>
          )}
        </motion.button>
      </form>

      <p className="text-center text-sm text-dark-muted">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-neon-blue hover:text-neon-purple transition-colors font-medium">
          Create one free
        </Link>
      </p>
    </div>
  )
}
