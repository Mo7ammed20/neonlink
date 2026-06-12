'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Save, Loader2, Plus, Trash2, Eye, EyeOff, Info } from 'lucide-react'
import toast from 'react-hot-toast'

interface PageField { title: string; content: string }

const SAMPLE_PAGES: PageField[] = [
  {
    title: 'ما هو سوق الفوركس؟',
    content: `<p>سوق <strong>الفوركس (Forex)</strong> هو أكبر وأكثر أسواق المال سيولةً في العالم، إذ يبلغ حجم التداول اليومي أكثر من <strong>6.6 تريليون دولار</strong> أمريكي.</p>
<p>تختصر كلمة "Forex" العبارة <em>Foreign Exchange</em>، أي سوق الصرف الأجنبي، وهو المكان الذي يتم فيه تبادل العملات العالمية إلكترونياً.</p>
<ul style="margin:12px 0;padding-right:20px;line-height:2">
  <li>✅ يعمل <strong>24 ساعة / 5 أيام</strong> في الأسبوع</li>
  <li>✅ لا يوجد مقر مركزي له — يعمل عبر شبكة بنوك عالمية</li>
  <li>✅ متاح للأفراد والمؤسسات على حدٍّ سواء</li>
</ul>
<p>يتداول المستثمرون عبر شراء وبيع <strong>أزواج العملات</strong> مثل EUR/USD وGBP/USD، مستفيدين من التغيرات في أسعار الصرف.</p>`,
  },
  {
    title: 'كيف يعمل التداول في الفوركس؟',
    content: `<p>يقوم التداول على فكرة بسيطة: <strong>شراء عملة وبيع أخرى في نفس الوقت</strong>.</p>
<p><strong>مثال:</strong> اشتريت EUR/USD بسعر 1.10 وارتفع إلى 1.12 → حققت ربحاً من الفارق (200 نقطة).</p>
<h4 style="color:#00BFFF;margin:14px 0 8px">مصطلحات لا بد تعرفها:</h4>
<ul style="padding-right:20px;line-height:2.2">
  <li><strong>Pip:</strong> أصغر وحدة تغيّر في السعر (عادةً 0.0001)</li>
  <li><strong>Spread:</strong> الفارق بين سعر الشراء والبيع — ربح الوسيط</li>
  <li><strong>Leverage:</strong> الرافعة المالية — تُضاعف الأرباح والخسائر معاً</li>
  <li><strong>Lot:</strong> وحدة حجم الصفقة (Standard = 100,000 وحدة)</li>
</ul>
<p style="color:#FF007F;background:rgba(255,0,127,0.08);padding:12px;border-radius:8px;margin-top:14px;border:1px solid rgba(255,0,127,0.2)">⚠️ <strong>تحذير:</strong> الرافعة المالية سلاح ذو حدّين — يمكنها مضاعفة الأرباح أو محو رأس المال بالكامل.</p>`,
  },
  {
    title: 'كيف تبدأ بأمان وتحمي رأس مالك؟',
    content: `<p>قبل وضع أي أموال حقيقية، اتبع هذه الخطوات المجربة:</p>
<ol style="padding-right:20px;line-height:2.4">
  <li>🎯 <strong>تعلّم الأساسيات:</strong> التحليل الفني والأساسي وإدارة المخاطر</li>
  <li>🏦 <strong>اختر وسيطاً موثوقاً:</strong> مرخّص من FCA أو CySEC أو FSCA</li>
  <li>🧪 <strong>ابدأ بحساب Demo:</strong> تدرّب بأموال افتراضية لمدة شهر على الأقل</li>
  <li>💰 <strong>ابدأ برأس مال صغير:</strong> لا تخاطر بأكثر مما تتحمّل خسارته</li>
  <li>📊 <strong>ضع خطة تداول:</strong> حدّد الدخول والخروج ووقف الخسارة قبل كل صفقة</li>
</ol>
<p style="color:#00FF88;background:rgba(0,255,136,0.08);padding:12px;border-radius:8px;margin-top:14px;border:1px solid rgba(0,255,136,0.2)">✅ <strong>القاعدة الذهبية:</strong> لا تخاطر بأكثر من 1-2% من رأس مالك في صفقة واحدة — هذه هي السر الحقيقي للاستمرارية.</p>`,
  },
]

export default function AdminArticlePage() {
  const [enabled, setEnabled]       = useState(false)
  const [title, setTitle]           = useState('دليل الفوركس الشامل للمبتدئين')
  const [pagesCount, setPagesCount] = useState(3)
  const [pages, setPages]           = useState<PageField[]>(SAMPLE_PAGES)
  const [loading, setLoading]       = useState(true)
  const [saving, setSaving]         = useState(false)
  const [preview, setPreview]       = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/admin/settings').then(r => r.json()).then(d => {
      const s = d.settings || {}
      setEnabled(s.article_enabled === 'true')
      if (s.article_title) setTitle(s.article_title)
      const n = parseInt(s.article_pages_count || '3', 10)
      setPagesCount(n)
      const loaded: PageField[] = []
      for (let i = 1; i <= n; i++) {
        loaded.push({
          title:   s[`article_page_${i}_title`]   || SAMPLE_PAGES[i-1]?.title   || '',
          content: s[`article_page_${i}_content`] || SAMPLE_PAGES[i-1]?.content || '',
        })
      }
      setPages(loaded)
    }).finally(() => setLoading(false))
  }, [])

  const save = async () => {
    setSaving(true)
    try {
      const payload: Record<string, string> = {
        article_enabled: String(enabled),
        article_title: title,
        article_pages_count: String(pagesCount),
      }
      pages.slice(0, pagesCount).forEach((p, i) => {
        payload[`article_page_${i+1}_title`]   = p.title
        payload[`article_page_${i+1}_content`] = p.content
      })
      const res = await fetch('/api/admin/settings', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      toast.success('Article saved!')
    } catch { toast.error('Failed to save') }
    finally { setSaving(false) }
  }

  const update = (i: number, f: keyof PageField, v: string) =>
    setPages(p => p.map((x, idx) => idx === i ? { ...x, [f]: v } : x))

  const addPage = () => {
    if (pagesCount >= 5) return
    setPages(p => [...p, { title: `الصفحة ${pagesCount + 1}`, content: '' }])
    setPagesCount(p => p + 1)
  }
  const removePage = (i: number) => {
    if (pagesCount <= 1) return
    setPages(p => p.filter((_, idx) => idx !== i))
    setPagesCount(p => p - 1)
  }

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-neon-blue" /></div>

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-neon-blue" /> Article Manager
          </h1>
          <p className="text-dark-muted text-sm mt-1">مقال متعدد الصفحات مع إعلانات بانر بين كل قسم</p>
        </div>
        <motion.button onClick={save} disabled={saving} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="btn-neon flex items-center gap-2 px-4 py-2.5 disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Article'}
        </motion.button>
      </div>

      {/* Enable */}
      <div className="glass-card p-5 flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <button onClick={() => setEnabled(e => !e)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-neon-blue' : 'bg-white/10'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className="text-white font-medium">{enabled ? '✅ Article Mode Enabled' : 'Article Mode Disabled'}</span>
          </div>
          <p className="text-dark-muted text-sm">عند التفعيل، يُعرض المقال للزوار بدلاً من Ad Steps العادية.</p>
        </div>
        <div className="flex items-start gap-2 text-xs text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-3 max-w-xs">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          الإعلانات تُجلب من Ads Manager — تأكد من وجود إعلانات STEP_1 / GLOBAL مفعّلة.
        </div>
      </div>

      {/* Title */}
      <div className="glass-card p-5 space-y-2">
        <label className="text-sm text-dark-muted">عنوان المقال الرئيسي</label>
        <input value={title} onChange={e => setTitle(e.target.value)}
          className="input-neon w-full text-base" placeholder="عنوان المقال..." />
      </div>

      {/* Pages */}
      {pages.slice(0, pagesCount).map((pg, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }} className="glass-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-xs font-bold text-white">{i+1}</span>
              <span className="font-display font-semibold text-white text-sm">الصفحة {i+1}</span>
              <span className="text-xs text-dark-muted bg-white/5 px-2 py-0.5 rounded">
                {i === pagesCount - 1 ? '← آخر صفحة → ينتقل للرابط' : `← ينتقل لصفحة ${i+2}`}
              </span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setPreview(preview === i ? null : i)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-dark-muted hover:text-white transition-colors">
                {preview === i ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              {pagesCount > 1 && (
                <button onClick={() => removePage(i)}
                  className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-dark-muted">عنوان الصفحة</label>
            <input value={pg.title} onChange={e => update(i, 'title', e.target.value)}
              className="input-neon w-full" placeholder="عنوان الصفحة..." />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-dark-muted">المحتوى (HTML مسموح)</label>
            <textarea value={pg.content} onChange={e => update(i, 'content', e.target.value)}
              rows={10} className="input-neon w-full font-mono text-xs resize-y"
              placeholder="<p>محتوى الصفحة...</p>" />
          </div>
          {preview === i && (
            <div className="p-4 rounded-xl border border-white/10 bg-white/3 text-[#9CA3AF] text-sm leading-relaxed"
              style={{ direction: 'rtl' }}
              dangerouslySetInnerHTML={{ __html: pg.content }} />
          )}
        </motion.div>
      ))}

      {pagesCount < 5 && (
        <button onClick={addPage}
          className="w-full py-3 rounded-xl border border-dashed border-white/20 text-dark-muted hover:border-neon-blue hover:text-neon-blue transition-colors flex items-center justify-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> إضافة صفحة ({pagesCount}/5)
        </button>
      )}
    </div>
  )
}
