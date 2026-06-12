'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2, UserPlus, Github, Chrome, Check } from 'lucide-react'
import toast from 'react-hot-toast'

const passwordReqs = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'Contains uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Contains a number', test: (p: string) => /\d/.test(p) },
]

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) return toast.error('Fill in all fields')
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match')
    if (form.password.length < 8) return toast.error('Password must be at least 8 characters')

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Registration failed')

      toast.success('Account created! Signing you in...')
      await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      })
      router.push('/dashboard')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-card p-8 space-y-6">
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center mx-auto"
        >
          <UserPlus className="w-7 h-7 text-white" />
        </motion.div>
        <h1 className="text-2xl font-display font-bold text-white">Create Account</h1>
        <p className="text-dark-muted text-sm">Start shortening links for free</p>
      </div>

      {/* OAuth */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          className="btn-ghost py-2.5 text-sm flex items-center justify-center gap-2"
        >
          <Chrome className="w-4 h-4" /> Google
        </button>
        <button
          type="button"
          onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
          className="btn-ghost py-2.5 text-sm flex items-center justify-center gap-2"
        >
          <Github className="w-4 h-4" /> GitHub
        </button>
      </div>

      <div className="relative flex items-center">
        <div className="flex-1 border-t border-white/10" />
        <span className="px-3 text-dark-muted text-xs">or with email</span>
        <div className="flex-1 border-t border-white/10" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm text-dark-muted">Full name</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="John Doe"
            className="input-neon w-full"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-dark-muted">Email address</label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder="you@example.com"
            className="input-neon w-full"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-dark-muted">Password</label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
              className="input-neon w-full pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPass(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-muted hover:text-white transition-colors"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Password strength */}
          {form.password && (
            <div className="mt-2 space-y-1">
              {passwordReqs.map((req) => (
                <div key={req.label} className="flex items-center gap-2">
                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    req.test(form.password) ? 'bg-green-500' : 'bg-white/10'
                  }`}>
                    {req.test(form.password) && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <span className={`text-xs transition-colors ${req.test(form.password) ? 'text-green-400' : 'text-dark-muted'}`}>
                    {req.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm text-dark-muted">Confirm password</label>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
            placeholder="••••••••"
            className={`input-neon w-full ${
              form.confirmPassword && form.password !== form.confirmPassword
                ? 'border-red-500/50'
                : ''
            }`}
          />
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-neon w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
          ) : (
            <><UserPlus className="w-4 h-4" /> Create Account</>
          )}
        </motion.button>
      </form>

      <p className="text-center text-xs text-dark-muted">
        By creating an account you agree to our{' '}
        <Link href="/terms" className="text-neon-blue hover:underline">Terms</Link>{' '}
        and{' '}
        <Link href="/privacy" className="text-neon-blue hover:underline">Privacy Policy</Link>.
      </p>

      <p className="text-center text-sm text-dark-muted">
        Already have an account?{' '}
        <Link href="/login" className="text-neon-blue hover:text-neon-purple transition-colors font-medium">
          Sign in
        </Link>
      </p>
    </div>
  )
}
