'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Settings, User, Lock, Loader2, Save, Check } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const [profileForm, setProfileForm] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profileForm.name) return toast.error('Name is required')

    setSavingProfile(true)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: profileForm.name }),
      })
      if (!res.ok) throw new Error()
      await update({ name: profileForm.name })
      toast.success('Profile updated!')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      return toast.error('Fill in all password fields')
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error('New passwords do not match')
    }
    if (passwordForm.newPassword.length < 8) {
      return toast.error('New password must be at least 8 characters')
    }

    setSavingPassword(true)
    try {
      const res = await fetch('/api/user/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      toast.success('Password changed!')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to change password')
    } finally {
      setSavingPassword(false)
    }
  }

  const planColors: Record<string, string> = {
    FREE: 'text-gray-400 bg-gray-500/20 border-gray-500/30',
    PRO: 'text-neon-blue bg-neon-blue/20 border-neon-blue/30',
    BUSINESS: 'text-neon-purple bg-neon-purple/20 border-neon-purple/30',
  }
  const currentPlan = (session?.user as any)?.plan || 'FREE'

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-neon-blue" /> Account Settings
        </h1>
        <p className="text-dark-muted text-sm mt-1">Manage your profile and security</p>
      </div>

      {/* Plan badge */}
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${planColors[currentPlan]}`}>
        <span className="text-sm font-medium">Current Plan: {currentPlan}</span>
        {currentPlan !== 'BUSINESS' && (
          <a href="/pricing" className="text-xs underline opacity-70 hover:opacity-100">Upgrade</a>
        )}
      </div>

      {/* Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 space-y-5"
      >
        <h2 className="text-lg font-display font-semibold text-white flex items-center gap-2">
          <User className="w-5 h-5 text-neon-blue" /> Profile
        </h2>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm text-dark-muted">Full Name</label>
            <input
              type="text"
              value={profileForm.name}
              onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
              className="input-neon w-full"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-dark-muted">Email Address</label>
            <input
              type="email"
              value={profileForm.email}
              disabled
              className="input-neon w-full opacity-50 cursor-not-allowed"
            />
            <p className="text-xs text-dark-muted">Email cannot be changed</p>
          </div>
          <motion.button
            type="submit"
            disabled={savingProfile}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-neon px-6 py-2.5 flex items-center gap-2 disabled:opacity-50"
          >
            {savingProfile ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Profile</>}
          </motion.button>
        </form>
      </motion.div>

      {/* Password */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 space-y-5"
      >
        <h2 className="text-lg font-display font-semibold text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-neon-purple" /> Change Password
        </h2>
        <form onSubmit={handleSavePassword} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm text-dark-muted">Current Password</label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={e => setPasswordForm(f => ({ ...f, currentPassword: e.target.value }))}
              className="input-neon w-full"
              autoComplete="current-password"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-dark-muted">New Password</label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={e => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))}
              className="input-neon w-full"
              autoComplete="new-password"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-dark-muted">Confirm New Password</label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={e => setPasswordForm(f => ({ ...f, confirmPassword: e.target.value }))}
              className={`input-neon w-full ${
                passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword
                  ? 'border-red-500/50'
                  : ''
              }`}
              autoComplete="new-password"
            />
            {passwordForm.confirmPassword && passwordForm.newPassword === passwordForm.confirmPassword && (
              <p className="text-xs text-green-400 flex items-center gap-1">
                <Check className="w-3 h-3" /> Passwords match
              </p>
            )}
          </div>
          <motion.button
            type="submit"
            disabled={savingPassword}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-neon px-6 py-2.5 flex items-center gap-2 disabled:opacity-50"
          >
            {savingPassword ? <><Loader2 className="w-4 h-4 animate-spin" /> Changing...</> : <><Lock className="w-4 h-4" /> Change Password</>}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}
