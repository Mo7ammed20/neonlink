'use client'

<<<<<<< HEAD
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Megaphone, Plus, Edit2, Trash2, ToggleLeft, ToggleRight,
  X, Loader2, Eye, EyeOff, ChevronDown, ChevronUp, Info,
  Globe, Layers, BarChart2,
} from 'lucide-react'
import toast from 'react-hot-toast'

// FIX #3: Match Prisma schema enum values exactly
type AdPlacement = 'STEP_1' | 'STEP_2' | 'STEP_3' | 'GLOBAL' | 'SIDEBAR'
type AdType = 'ADSENSE' | 'PROPELLERADS' | 'MONETAG' | 'CUSTOM_HTML' | 'BANNER' | 'POPUP' | 'NATIVE'
=======
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Megaphone, Plus, Edit2, Trash2, ToggleLeft, ToggleRight, X, Loader2,
} from 'lucide-react'
import toast from 'react-hot-toast'

type AdPlacement = 'STEP_1' | 'STEP_2' | 'STEP_3' | 'GLOBAL'
type AdType = 'BANNER' | 'POPUP' | 'NATIVE' | 'INTERSTITIAL' | 'CUSTOM'
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889

interface Ad {
  id: string
  name: string
  type: AdType
  placement: AdPlacement
  code: string
  isActive: boolean
<<<<<<< HEAD
  impressions: number
  clicks: number
  revenue: number
  priority: number
  notes?: string | null
  createdAt: string
}

const placementMeta: Record<AdPlacement, { label: string; color: string; desc: string }> = {
  STEP_1: { label: 'Step 1', color: 'text-blue-400 bg-blue-400/20 border-blue-400/30', desc: 'Shown on first redirect step' },
  STEP_2: { label: 'Step 2', color: 'text-purple-400 bg-purple-400/20 border-purple-400/30', desc: 'Shown on second redirect step' },
  STEP_3: { label: 'Step 3', color: 'text-green-400 bg-green-400/20 border-green-400/30', desc: 'Shown on third redirect step' },
  GLOBAL: { label: 'Global', color: 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30', desc: 'Fallback for any step without a specific ad' },
  SIDEBAR: { label: 'Sidebar', color: 'text-orange-400 bg-orange-400/20 border-orange-400/30', desc: 'Reserved for sidebar placement (future)' },
}

// FIX #3: Correct AdType values matching Prisma schema
const adTypeOptions: { value: AdType; label: string; desc: string }[] = [
  { value: 'ADSENSE',      label: 'Google AdSense',   desc: 'Auto ads or ad unit code' },
  { value: 'PROPELLERADS', label: 'PropellerAds',     desc: 'Onclick / push / banner' },
  { value: 'MONETAG',      label: 'Monetag',          desc: 'Smart tag / interstitial' },
  { value: 'CUSTOM_HTML',  label: 'Custom HTML/JS',   desc: 'Any custom ad code' },
  { value: 'BANNER',       label: 'Banner',           desc: 'Standard image/HTML banner' },
  { value: 'POPUP',        label: 'Popup / Popunder', desc: 'Popup or popunder ad' },
  { value: 'NATIVE',       label: 'Native Ad',        desc: 'In-content native format' },
]

const placements: AdPlacement[] = ['STEP_1', 'STEP_2', 'STEP_3', 'GLOBAL', 'SIDEBAR']

const emptyForm = {
  name: '',
  type: 'CUSTOM_HTML' as AdType,
  placement: 'STEP_1' as AdPlacement,
  code: '',
  isActive: true,
  priority: 0,
  notes: '',
}
=======
  createdAt: string
}

const placementColors: Record<AdPlacement, string> = {
  STEP_1: 'text-blue-400 bg-blue-400/20',
  STEP_2: 'text-purple-400 bg-purple-400/20',
  STEP_3: 'text-green-400 bg-green-400/20',
  GLOBAL: 'text-yellow-400 bg-yellow-400/20',
}

const adTypes: AdType[] = ['BANNER', 'POPUP', 'NATIVE', 'INTERSTITIAL', 'CUSTOM']
const placements: AdPlacement[] = ['STEP_1', 'STEP_2', 'STEP_3', 'GLOBAL']
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889

export default function AdminAdsPage() {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingAd, setEditingAd] = useState<Ad | null>(null)
  const [saving, setSaving] = useState(false)
<<<<<<< HEAD
  const [form, setForm] = useState(emptyForm)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    STEP_1: true, STEP_2: true, STEP_3: true, GLOBAL: true, SIDEBAR: false,
  })
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => { fetchAds() }, [])

  // Live code preview – executes scripts inside the preview iframe
  useEffect(() => {
    if (!previewOpen || !previewRef.current || !form.code) return
    const el = previewRef.current
    el.innerHTML = form.code
    el.querySelectorAll('script').forEach(old => {
      const ns = document.createElement('script')
      Array.from(old.attributes).forEach(a => ns.setAttribute(a.name, a.value))
      ns.textContent = old.textContent
      old.parentNode?.replaceChild(ns, old)
    })
  }, [previewOpen, form.code])
=======
  const [form, setForm] = useState({ name: '', type: 'BANNER' as AdType, placement: 'STEP_1' as AdPlacement, code: '', isActive: true })

  useEffect(() => {
    fetchAds()
  }, [])
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889

  const fetchAds = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/ads')
      const data = await res.json()
      setAds(data.ads || [])
    } finally {
      setLoading(false)
    }
  }

  const openCreate = () => {
    setEditingAd(null)
<<<<<<< HEAD
    setForm(emptyForm)
    setPreviewOpen(false)
=======
    setForm({ name: '', type: 'BANNER', placement: 'STEP_1', code: '', isActive: true })
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
    setShowModal(true)
  }

  const openEdit = (ad: Ad) => {
    setEditingAd(ad)
<<<<<<< HEAD
    setForm({ name: ad.name, type: ad.type, placement: ad.placement, code: ad.code, isActive: ad.isActive, priority: ad.priority ?? 0, notes: ad.notes ?? '' })
    setPreviewOpen(false)
=======
    setForm({ name: ad.name, type: ad.type, placement: ad.placement, code: ad.code, isActive: ad.isActive })
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
    setShowModal(true)
  }

  const handleSave = async () => {
<<<<<<< HEAD
    if (!form.name.trim()) return toast.error('Ad name is required')
    if (!form.code.trim()) return toast.error('Ad code is required')
    setSaving(true)
    try {
      const payload = editingAd ? { id: editingAd.id, ...form } : form
      const res = await fetch('/api/admin/ads', {
        method: editingAd ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed')
      }
      toast.success(editingAd ? 'Ad updated!' : 'Ad created!')
      setShowModal(false)
      fetchAds()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to save ad')
=======
    if (!form.name || !form.code) return toast.error('Name and code are required')
    setSaving(true)
    try {
      const res = await fetch('/api/admin/ads', {
        method: editingAd ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingAd ? { id: editingAd.id, ...form } : form),
      })
      if (!res.ok) throw new Error()
      toast.success(editingAd ? 'Ad updated!' : 'Ad created!')
      setShowModal(false)
      fetchAds()
    } catch {
      toast.error('Failed to save ad')
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
    } finally {
      setSaving(false)
    }
  }

  const toggleAd = async (ad: Ad) => {
    try {
<<<<<<< HEAD
      const res = await fetch('/api/admin/ads', {
=======
      await fetch('/api/admin/ads', {
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ad.id, isActive: !ad.isActive }),
      })
<<<<<<< HEAD
      if (!res.ok) throw new Error()
=======
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
      setAds(prev => prev.map(a => a.id === ad.id ? { ...a, isActive: !a.isActive } : a))
      toast.success(ad.isActive ? 'Ad disabled' : 'Ad enabled')
    } catch {
      toast.error('Failed to toggle ad')
    }
  }

  const deleteAd = async (id: string) => {
<<<<<<< HEAD
    if (!confirm('Delete this ad? This action cannot be undone.')) return
    try {
      const res = await fetch(`/api/admin/ads?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
=======
    if (!confirm('Delete this ad?')) return
    try {
      await fetch(`/api/admin/ads?id=${id}`, { method: 'DELETE' })
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
      setAds(prev => prev.filter(a => a.id !== id))
      toast.success('Ad deleted')
    } catch {
      toast.error('Failed to delete ad')
    }
  }

<<<<<<< HEAD
  const toggleSection = (placement: string) => {
    setExpandedSections(s => ({ ...s, [placement]: !s[placement] }))
  }

  // Totals
  const totalImpressions = ads.reduce((s, a) => s + (a.impressions || 0), 0)
  const totalClicks = ads.reduce((s, a) => s + (a.clicks || 0), 0)
  const totalRevenue = ads.reduce((s, a) => s + (a.revenue || 0), 0)
  const activeCount = ads.filter(a => a.isActive).length

  return (
    <div className="p-6 space-y-6 max-w-5xl">

      {/* Header */}
=======
  return (
    <div className="p-8 space-y-6">
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-neon-blue" /> Ads Manager
          </h1>
          <p className="text-dark-muted text-sm mt-1">Manage ad slots for each redirect step</p>
        </div>
        <motion.button onClick={openCreate} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="btn-neon flex items-center gap-2 px-4 py-2.5">
          <Plus className="w-4 h-4" /> Add Ad
        </motion.button>
      </div>

<<<<<<< HEAD
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Ads', value: ads.length, icon: Layers, color: 'text-neon-blue' },
          { label: 'Active', value: activeCount, icon: ToggleRight, color: 'text-green-400' },
          { label: 'Impressions', value: totalImpressions.toLocaleString(), icon: BarChart2, color: 'text-purple-400' },
          { label: 'Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: Globe, color: 'text-yellow-400' },
        ].map(stat => (
          <div key={stat.label} className="glass-card p-4 flex items-center gap-3">
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
            <div>
              <p className="text-xs text-dark-muted">{stat.label}</p>
              <p className="text-lg font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* GLOBAL notice */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-400/5 border border-yellow-400/20">
        <Info className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-dark-muted">
          <span className="text-yellow-400 font-medium">Global ads</span> are shown as fallback on any redirect step that doesn&apos;t have its own Step ad.
          If you only have Global ads (no Step ads), the system will still show 1 redirect step.
        </div>
      </div>

      {/* Ads by placement */}
      {placements.map(placement => {
        const meta = placementMeta[placement]
        const stepAds = ads.filter(a => a.placement === placement)
        const isExpanded = expandedSections[placement]

        return (
          <div key={placement} className="glass-card p-0 overflow-hidden">
            <button
              onClick={() => toggleSection(placement)}
              className="w-full flex items-center justify-between p-5 hover:bg-white/2 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${meta.color}`}>
                  {meta.label}
                </span>
                <span className="text-dark-muted text-sm">{meta.desc}</span>
                <span className="text-xs text-dark-muted bg-white/5 px-2 py-0.5 rounded-full">
                  {stepAds.length} ad{stepAds.length !== 1 ? 's' : ''}
                </span>
              </div>
              {isExpanded ? <ChevronUp className="w-4 h-4 text-dark-muted" /> : <ChevronDown className="w-4 h-4 text-dark-muted" />}
            </button>

            {isExpanded && (
              <div className="px-5 pb-5 space-y-3 border-t border-white/5">
                {stepAds.length === 0 ? (
                  <div className="py-6 text-center text-dark-muted text-sm">
                    No ads for this placement.{' '}
                    <button onClick={() => { setForm(f => ({ ...f, placement })); openCreate() }}
                      className="text-neon-blue hover:underline">Add one</button>
                  </div>
                ) : (
                  stepAds.map(ad => (
                    <motion.div key={ad.id} layout
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                        ad.isActive ? 'border-neon-blue/20 bg-neon-blue/5' : 'border-white/5 bg-white/2 opacity-60'
                      }`}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-white font-medium">{ad.name}</span>
                          <span className="text-xs text-dark-muted bg-white/5 px-2 py-0.5 rounded">
                            {adTypeOptions.find(t => t.value === ad.type)?.label ?? ad.type}
                          </span>
                          {ad.priority > 0 && (
                            <span className="text-xs text-neon-blue bg-neon-blue/10 px-2 py-0.5 rounded">
                              Priority: {ad.priority}
                            </span>
                          )}
                          {!ad.isActive && (
                            <span className="text-xs text-red-400 bg-red-400/10 px-2 py-0.5 rounded">disabled</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-dark-muted text-xs truncate max-w-xs">{ad.code.slice(0, 70)}…</p>
                          <span className="text-xs text-dark-muted whitespace-nowrap">
                            {(ad.impressions || 0).toLocaleString()} impr · {(ad.clicks || 0).toLocaleString()} clicks
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                        <button onClick={() => toggleAd(ad)} title={ad.isActive ? 'Disable' : 'Enable'}>
                          {ad.isActive
                            ? <ToggleRight className="w-5 h-5 text-green-400" />
                            : <ToggleLeft className="w-5 h-5 text-dark-muted" />}
                        </button>
                        <button onClick={() => openEdit(ad)}
                          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-dark-muted hover:text-white transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteAd(ad.id)}
                          className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
=======
      {/* Ads by step */}
      {(['STEP_1', 'STEP_2', 'STEP_3'] as AdPlacement[]).map(step => {
        const stepAds = ads.filter(a => a.placement === step)
        return (
          <div key={step} className="glass-card p-6">
            <h2 className="text-lg font-display font-semibold text-white mb-4 flex items-center gap-2">
              <span className={`text-sm px-2 py-0.5 rounded-full font-medium ${placementColors[step]}`}>
                {step.replace('_', ' ')}
              </span>
              <span className="text-dark-muted text-sm font-normal">({stepAds.length} ads)</span>
            </h2>
            {stepAds.length === 0 ? (
              <p className="text-dark-muted text-sm">No ads for this step. <button onClick={openCreate} className="text-neon-blue hover:underline">Add one</button></p>
            ) : (
              <div className="space-y-3">
                {stepAds.map(ad => (
                  <motion.div key={ad.id} layout className={`flex items-center justify-between p-4 rounded-xl border transition-all ${ad.isActive ? 'border-neon-blue/20 bg-neon-blue/5' : 'border-white/5 bg-white/2 opacity-60'}`}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{ad.name}</span>
                        <span className="text-xs text-dark-muted bg-white/5 px-2 py-0.5 rounded">{ad.type}</span>
                        {!ad.isActive && <span className="text-xs text-red-400 bg-red-400/10 px-2 py-0.5 rounded">disabled</span>}
                      </div>
                      <p className="text-dark-muted text-xs mt-1 truncate">{ad.code.slice(0, 80)}...</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button onClick={() => toggleAd(ad)} className="text-dark-muted hover:text-white transition-colors">
                        {ad.isActive ? <ToggleRight className="w-5 h-5 text-green-400" /> : <ToggleLeft className="w-5 h-5" />}
                      </button>
                      <button onClick={() => openEdit(ad)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-dark-muted hover:text-white transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteAd(ad.id)} className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
              </div>
            )}
          </div>
        )
      })}

<<<<<<< HEAD
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-neon-blue" />
        </div>
      )}

      {/* Create / Edit Modal */}
=======
      {/* Create/Edit Modal */}
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setShowModal(false)}>
            <motion.div
<<<<<<< HEAD
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card p-6 w-full max-w-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-display font-bold text-white">
                  {editingAd ? 'Edit Ad' : 'Create Ad'}
                </h2>
                <button onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-dark-muted hover:text-white">
=======
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card p-6 w-full max-w-2xl space-y-5"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-display font-bold text-white">{editingAd ? 'Edit Ad' : 'Create Ad'}</h2>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-dark-muted hover:text-white">
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
<<<<<<< HEAD

                {/* Name */}
                <div className="space-y-1 col-span-2">
                  <label className="text-sm text-dark-muted">Ad Name *</label>
                  <input type="text" value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Google AdSense Step 1"
                    className="input-neon w-full" />
                </div>

                {/* Type */}
                <div className="space-y-1">
                  <label className="text-sm text-dark-muted">Ad Network / Type *</label>
                  <select value={form.type}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value as AdType }))}
                    className="input-neon w-full">
                    {adTypeOptions.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  <p className="text-xs text-dark-muted">
                    {adTypeOptions.find(t => t.value === form.type)?.desc}
                  </p>
                </div>

                {/* Placement */}
                <div className="space-y-1">
                  <label className="text-sm text-dark-muted">Placement *</label>
                  <select value={form.placement}
                    onChange={e => setForm(f => ({ ...f, placement: e.target.value as AdPlacement }))}
                    className="input-neon w-full">
                    {placements.map(p => (
                      <option key={p} value={p}>{placementMeta[p].label} — {placementMeta[p].desc}</option>
                    ))}
                  </select>
                </div>

                {/* Priority */}
                <div className="space-y-1">
                  <label className="text-sm text-dark-muted">Priority (higher = preferred)</label>
                  <input type="number" min="0" max="100" value={form.priority}
                    onChange={e => setForm(f => ({ ...f, priority: parseInt(e.target.value) || 0 }))}
                    className="input-neon w-full" />
                </div>

                {/* Active toggle */}
                <div className="flex items-center gap-3 self-end pb-2">
                  <button onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))} className="relative">
                    {form.isActive
                      ? <ToggleRight className="w-7 h-7 text-green-400" />
                      : <ToggleLeft className="w-7 h-7 text-dark-muted" />}
                  </button>
                  <span className="text-sm text-dark-muted">{form.isActive ? 'Active' : 'Inactive'}</span>
                </div>

                {/* Code */}
                <div className="space-y-1 col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-dark-muted">Ad Code (HTML / JavaScript) *</label>
                    <button
                      onClick={() => setPreviewOpen(p => !p)}
                      className="flex items-center gap-1 text-xs text-neon-blue hover:underline">
                      {previewOpen ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      {previewOpen ? 'Hide' : 'Preview'}
                    </button>
                  </div>
                  <textarea
                    value={form.code}
                    onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
                    placeholder="<!-- Paste your ad code here (AdSense, PropellerAds, Monetag, etc.) -->"
=======
                <div className="space-y-1 col-span-2">
                  <label className="text-sm text-dark-muted">Ad Name</label>
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Google AdSense Step 1" className="input-neon w-full" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-dark-muted">Ad Type</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as AdType }))} className="input-neon w-full">
                    {adTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-dark-muted">Placement</label>
                  <select value={form.placement} onChange={e => setForm(f => ({ ...f, placement: e.target.value as AdPlacement }))} className="input-neon w-full">
                    {placements.map(p => <option key={p} value={p}>{p.replace('_', ' ')}</option>)}
                  </select>
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-sm text-dark-muted">Ad Code (HTML / Script)</label>
                  <textarea
                    value={form.code}
                    onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
                    placeholder="<!-- Paste your ad code here -->"
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
                    rows={8}
                    className="input-neon w-full font-mono text-sm resize-none"
                  />
                </div>
<<<<<<< HEAD

                {/* Live Preview */}
                {previewOpen && (
                  <div className="col-span-2 space-y-1">
                    <label className="text-sm text-dark-muted">Live Preview</label>
                    <div
                      ref={previewRef}
                      className="min-h-[120px] rounded-xl border border-white/10 bg-white/5 p-4 overflow-auto"
                    />
                    <p className="text-xs text-dark-muted">
                      ⚠️ External ad networks (AdSense, PropellerAds) may not render in preview because they require the live domain.
                    </p>
                  </div>
                )}

                {/* Notes */}
                <div className="space-y-1 col-span-2">
                  <label className="text-sm text-dark-muted">Internal Notes (optional)</label>
                  <input type="text" value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    placeholder="e.g. CPM $2.5 — paused during low traffic"
                    className="input-neon w-full text-sm" />
=======
                <div className="flex items-center gap-3">
                  <button onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))} className="relative">
                    {form.isActive ? <ToggleRight className="w-6 h-6 text-green-400" /> : <ToggleLeft className="w-6 h-6 text-dark-muted" />}
                  </button>
                  <span className="text-sm text-dark-muted">{form.isActive ? 'Active' : 'Inactive'}</span>
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="btn-ghost flex-1 py-3">Cancel</button>
<<<<<<< HEAD
                <motion.button onClick={handleSave} disabled={saving}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="btn-neon flex-1 py-3 flex items-center justify-center gap-2 disabled:opacity-50">
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : 'Save Ad'}
=======
                <motion.button onClick={handleSave} disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="btn-neon flex-1 py-3 flex items-center justify-center gap-2 disabled:opacity-50">
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Save Ad'}
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
