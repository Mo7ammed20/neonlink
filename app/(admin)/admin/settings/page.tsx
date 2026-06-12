'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings, Loader2, Save, Globe, Shield, DollarSign, Megaphone } from 'lucide-react'
import toast from 'react-hot-toast'

interface SettingField {
  key: string
  label: string
<<<<<<< HEAD
  type: 'text' | 'number' | 'toggle' | 'textarea' | 'select'
  placeholder?: string
  min?: number
  max?: number
  options?: { value: string; label: string }[]
  hint?: string
=======
  type: 'text' | 'number' | 'toggle' | 'textarea'
  placeholder?: string
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
}

const settingSections: { title: string; icon: React.ElementType; color: string; fields: SettingField[] }[] = [
  {
    title: 'General', icon: Globe, color: 'text-neon-blue',
    fields: [
<<<<<<< HEAD
      { key: 'site_name',    label: 'Site Name',    type: 'text',   placeholder: 'NeonLink' },
      { key: 'site_tagline', label: 'Tagline',      type: 'text',   placeholder: 'Premium URL Shortener' },
      { key: 'site_url',     label: 'Site URL',     type: 'text',   placeholder: 'https://yourdomain.com' },
    ],
  },
  {
    title: 'Registration & Access', icon: Shield, color: 'text-neon-purple',
    fields: [
      { key: 'allow_registration',        label: 'Allow User Registration',       type: 'toggle' },
      { key: 'require_email_verification', label: 'Require Email Verification',   type: 'toggle' },
      { key: 'maintenance_mode',          label: 'Maintenance Mode',               type: 'toggle',
        hint: 'When enabled, only admins can access the site.' },
=======
      { key: 'site_name', label: 'Site Name', type: 'text', placeholder: 'NeonLink' },
      { key: 'site_tagline', label: 'Tagline', type: 'text', placeholder: 'Premium URL Shortener' },
      { key: 'site_url', label: 'Site URL', type: 'text', placeholder: 'https://yourdomain.com' },
    ],
  },
  {
    title: 'Registration', icon: Shield, color: 'text-neon-purple',
    fields: [
      { key: 'allow_registration', label: 'Allow User Registration', type: 'toggle' },
      { key: 'require_email_verification', label: 'Require Email Verification', type: 'toggle' },
      { key: 'maintenance_mode', label: 'Maintenance Mode', type: 'toggle' },
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
    ],
  },
  {
    title: 'Plan Limits', icon: Shield, color: 'text-green-400',
    fields: [
<<<<<<< HEAD
      { key: 'max_links_free',     label: 'Max Links (Free)',                      type: 'number', placeholder: '50', min: 1 },
      { key: 'max_links_pro',      label: 'Max Links (Pro)',                       type: 'number', placeholder: '500', min: 1 },
=======
      { key: 'max_links_free', label: 'Max Links (Free)', type: 'number', placeholder: '50' },
      { key: 'max_links_pro', label: 'Max Links (Pro)', type: 'number', placeholder: '500' },
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
      { key: 'max_links_business', label: 'Max Links (Business, -1 = unlimited)', type: 'number', placeholder: '-1' },
    ],
  },
  {
    title: 'Monetization', icon: DollarSign, color: 'text-yellow-400',
    fields: [
<<<<<<< HEAD
      { key: 'cpm_rate',   label: 'CPM Rate ($/1000 views)', type: 'number', placeholder: '2.50', min: 0 },
      { key: 'min_payout', label: 'Minimum Payout ($)',       type: 'number', placeholder: '10.00', min: 0 },
    ],
  },
  {
    title: 'Ad System', icon: Megaphone, color: 'text-orange-400',
    fields: [
      {
        key: 'ads_enabled', label: 'Ads Enabled Globally', type: 'toggle',
        hint: 'Disabling this skips all ad steps and redirects users immediately.',
      },
      {
        key: 'default_ad_timer', label: 'Ad Timer (seconds)', type: 'number',
        placeholder: '30', min: 5, max: 120,
        hint: 'How long users must wait on each ad step before continuing.',
      },
      {
        key: 'ad_steps', label: 'Number of Ad Steps', type: 'select',
        hint: 'How many redirect steps to show. "Auto" derives from active ads.',
        options: [
          { value: '0', label: 'Auto (detect from active ads)' },
          { value: '1', label: '1 step' },
          { value: '2', label: '2 steps' },
          { value: '3', label: '3 steps' },
        ],
      },
=======
      { key: 'cpm_rate', label: 'CPM Rate ($/1000 views)', type: 'number', placeholder: '2.50' },
      { key: 'min_payout', label: 'Minimum Payout ($)', type: 'number', placeholder: '10.00' },
    ],
  },
  {
    title: 'Ads', icon: Megaphone, color: 'text-orange-400',
    fields: [
      { key: 'ads_enabled', label: 'Ads Enabled Globally', type: 'toggle' },
      { key: 'default_ad_timer', label: 'Ad Timer (seconds)', type: 'number', placeholder: '30' },
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
    ],
  },
]

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(d => setSettings(d.settings || {}))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (!res.ok) throw new Error()
      toast.success('Settings saved!')
    } catch {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const update = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="p-8 space-y-6">
<<<<<<< HEAD
        {[...Array(4)].map((_, i) => <div key={i} className="h-40 skeleton rounded-xl" />)}
=======
        {[...Array(3)].map((_, i) => <div key={i} className="h-48 skeleton rounded-xl" />)}
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
      </div>
    )
  }

  return (
<<<<<<< HEAD
    <div className="p-8 space-y-6 max-w-4xl">
=======
    <div className="p-8 space-y-6">
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-neon-blue" /> Settings
          </h1>
          <p className="text-dark-muted text-sm mt-1">Configure your NeonLink platform</p>
        </div>
<<<<<<< HEAD
        <motion.button onClick={handleSave} disabled={saving}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="btn-neon flex items-center gap-2 px-4 py-2.5 disabled:opacity-50">
=======
        <motion.button
          onClick={handleSave}
          disabled={saving}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-neon flex items-center gap-2 px-4 py-2.5 disabled:opacity-50"
        >
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </motion.button>
      </div>

      {settingSections.map((section, si) => {
        const Icon = section.icon
        return (
<<<<<<< HEAD
          <motion.div key={section.title}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: si * 0.08 }}
            className="glass-card p-6 space-y-5">
=======
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: si * 0.08 }}
            className="glass-card p-6 space-y-5"
          >
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
            <h2 className={`font-display font-semibold text-lg flex items-center gap-2 ${section.color}`}>
              <Icon className="w-5 h-5" /> {section.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {section.fields.map(field => (
                <div key={field.key} className={`space-y-1 ${field.type === 'textarea' ? 'col-span-2' : ''}`}>
                  <label className="text-sm text-dark-muted">{field.label}</label>
<<<<<<< HEAD

                  {field.type === 'toggle' ? (
                    <div className="flex items-center gap-3">
                      <button onClick={() => update(field.key, settings[field.key] === 'true' ? 'false' : 'true')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings[field.key] === 'true' ? 'bg-neon-blue' : 'bg-white/10'}`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings[field.key] === 'true' ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                      <span className="text-sm text-dark-muted">{settings[field.key] === 'true' ? 'Enabled' : 'Disabled'}</span>
                    </div>
                  ) : field.type === 'select' ? (
                    <select value={settings[field.key] ?? '0'}
                      onChange={e => update(field.key, e.target.value)}
                      className="input-neon w-full">
                      {field.options?.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea value={settings[field.key] || ''}
                      onChange={e => update(field.key, e.target.value)}
                      placeholder={field.placeholder} rows={4}
                      className="input-neon w-full resize-none" />
                  ) : (
                    <input type={field.type} value={settings[field.key] || ''}
                      onChange={e => update(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      min={field.min} max={field.max}
                      className="input-neon w-full" />
                  )}

                  {field.hint && (
                    <p className="text-xs text-dark-muted mt-1">{field.hint}</p>
=======
                  {field.type === 'toggle' ? (
                    <button
                      onClick={() => update(field.key, settings[field.key] === 'true' ? 'false' : 'true')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings[field.key] === 'true' ? 'bg-neon-blue' : 'bg-white/10'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings[field.key] === 'true' ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      value={settings[field.key] || ''}
                      onChange={e => update(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      rows={4}
                      className="input-neon w-full resize-none"
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={settings[field.key] || ''}
                      onChange={e => update(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="input-neon w-full"
                    />
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
