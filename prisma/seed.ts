import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

<<<<<<< HEAD
=======
  // Create admin user
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin123!', 12)
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@neonlink.io' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@neonlink.io',
<<<<<<< HEAD
      name: 'Admin', password: adminPassword,
      role: 'ADMIN', plan: 'BUSINESS',
      emailVerified: new Date(), status: 'ACTIVE',
    },
  })
  console.log(`✅ Admin: ${admin.email}`)

  const settings: { key: string; value: string }[] = [
    { key: 'site_name',                  value: 'NeonLink' },
    { key: 'site_tagline',               value: 'Premium URL Shortener' },
    { key: 'site_url',                   value: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000' },
    { key: 'allow_registration',         value: 'true' },
    { key: 'require_email_verification', value: 'false' },
    { key: 'maintenance_mode',           value: 'false' },
    { key: 'ads_enabled',                value: 'true' },
    { key: 'default_ad_timer',           value: '30' },
    { key: 'ad_steps',                   value: '0' },   // 0 = auto-detect
    { key: 'max_links_free',             value: '50' },
    { key: 'max_links_pro',              value: '500' },
    { key: 'max_links_business',         value: '-1' },
    { key: 'cpm_rate',                   value: '2.50' },
    { key: 'min_payout',                 value: '10.00' },
    // ── Article defaults ───────────────────────────────────────────
    { key: 'article_enabled',            value: 'false' },
    { key: 'article_title',              value: 'دليل الفوركس الشامل للمبتدئين' },
    { key: 'article_pages_count',        value: '3' },
    {
      key: 'article_page_1_title',
      value: 'ما هو سوق الفوركس؟',
    },
    {
      key: 'article_page_1_content',
      value: `<p>سوق <strong>الفوركس (Forex)</strong> هو أكبر وأكثر أسواق المال سيولةً في العالم، إذ يبلغ حجم التداول اليومي أكثر من <strong>6.6 تريليون دولار</strong> أمريكي.</p><p>تختصر كلمة "Forex" العبارة <em>Foreign Exchange</em>، أي سوق الصرف الأجنبي.</p><ul style="margin:12px 0;padding-right:20px;line-height:2"><li>✅ يعمل <strong>24 ساعة / 5 أيام</strong> في الأسبوع</li><li>✅ لا يوجد مقر مركزي — يعمل إلكترونياً</li><li>✅ متاح للأفراد والمؤسسات</li></ul>`,
    },
    {
      key: 'article_page_2_title',
      value: 'كيف يعمل التداول في الفوركس؟',
    },
    {
      key: 'article_page_2_content',
      value: `<p>يقوم التداول على <strong>شراء عملة وبيع أخرى في نفس الوقت</strong>.</p><p><strong>مثال:</strong> اشتريت EUR/USD بـ 1.10 وارتفع لـ 1.12 → ربح 200 نقطة.</p><ul style="padding-right:20px;line-height:2.2"><li><strong>Pip:</strong> أصغر وحدة تغيّر (0.0001)</li><li><strong>Spread:</strong> الفارق بين الشراء والبيع</li><li><strong>Leverage:</strong> الرافعة المالية — تُضاعف الأرباح والخسائر</li></ul>`,
    },
    {
      key: 'article_page_3_title',
      value: 'كيف تبدأ بأمان؟',
    },
    {
      key: 'article_page_3_content',
      value: `<ol style="padding-right:20px;line-height:2.4"><li>🎯 <strong>تعلّم الأساسيات</strong> قبل أي شيء</li><li>🏦 <strong>اختر وسيطاً مرخّصاً</strong> (FCA / CySEC)</li><li>🧪 <strong>ابدأ بحساب Demo</strong> لمدة شهر</li><li>💰 <strong>لا تخاطر</strong> بأكثر مما تتحمّل خسارته</li><li>📊 <strong>ضع خطة تداول</strong> واحترمها دائماً</li></ol><p style="color:#00FF88;background:rgba(0,255,136,0.08);padding:12px;border-radius:8px;margin-top:14px;border:1px solid rgba(0,255,136,0.2)">✅ القاعدة الذهبية: لا تخاطر بأكثر من 1-2% من رأس المال في صفقة واحدة.</p>`,
    },
  ]

  for (const s of settings) {
    await prisma.setting.upsert({ where: { key: s.key }, update: { value: s.value }, create: s })
  }
  console.log(`✅ ${settings.length} settings seeded`)

  const ads = [
    { name: 'Step 1 — Sample Banner', type: 'CUSTOM_HTML', placement: 'STEP_1', isActive: true, priority: 0,
      code: '<div style="background:#0f0f1a;border:1px solid #00BFFF;border-radius:8px;padding:24px;text-align:center;color:#00BFFF;font-family:sans-serif"><p style="font-size:18px;font-weight:bold;margin:0 0 6px">🚀 Sample Ad — Step 1</p><p style="color:#aaa;margin:0;font-size:13px">Replace with your real ad code</p></div>' },
    { name: 'Step 2 — Sample Banner', type: 'CUSTOM_HTML', placement: 'STEP_2', isActive: true, priority: 0,
      code: '<div style="background:#0f0f1a;border:1px solid #8A2BE2;border-radius:8px;padding:24px;text-align:center;color:#8A2BE2;font-family:sans-serif"><p style="font-size:18px;font-weight:bold;margin:0 0 6px">🚀 Sample Ad — Step 2</p><p style="color:#aaa;margin:0;font-size:13px">Replace with your real ad code</p></div>' },
    { name: 'Step 3 — Sample Banner', type: 'CUSTOM_HTML', placement: 'STEP_3', isActive: true, priority: 0,
      code: '<div style="background:#0f0f1a;border:1px solid #00FF88;border-radius:8px;padding:24px;text-align:center;color:#00FF88;font-family:sans-serif"><p style="font-size:18px;font-weight:bold;margin:0 0 6px">🚀 Sample Ad — Step 3</p><p style="color:#aaa;margin:0;font-size:13px">Replace with your real ad code</p></div>' },
  ]
  for (const ad of ads) {
    await prisma.ad.create({ data: ad as Parameters<typeof prisma.ad.create>[0]['data'] })
  }
  console.log(`✅ ${ads.length} sample ads seeded`)
  console.log(`\n🎉 Done!\nAdmin: ${admin.email} / ${process.env.ADMIN_PASSWORD || 'Admin123!'}`)
}

main()
  .catch(e => { console.error('❌', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
=======
      name: 'Admin',
      password: adminPassword,
      role: 'ADMIN',
      plan: 'BUSINESS',
      emailVerified: new Date(),
      status: 'ACTIVE',
    },
  })
  console.log(`✅ Admin user: ${admin.email}`)

  // Default site settings
  const settings: { key: string; value: string }[] = [
    { key: 'site_name', value: 'NeonLink' },
    { key: 'site_tagline', value: 'Premium URL Shortener' },
    { key: 'site_url', value: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000' },
    { key: 'allow_registration', value: 'true' },
    { key: 'require_email_verification', value: 'false' },
    { key: 'maintenance_mode', value: 'false' },
    { key: 'ads_enabled', value: 'true' },
    { key: 'default_ad_timer', value: '30' },
    { key: 'max_links_free', value: '50' },
    { key: 'max_links_pro', value: '500' },
    { key: 'max_links_business', value: '-1' },
    { key: 'cpm_rate', value: '2.50' },
    { key: 'min_payout', value: '10.00' },
  ]

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    })
  }
  console.log(`✅ ${settings.length} settings seeded`)

  // Sample ads for each step
  const ads = [
    {
      name: 'Step 1 Banner Ad',
      type: 'BANNER',
      placement: 'STEP_1',
      code: '<div style="background:#1a1a2e;border:1px solid #00BFFF;border-radius:8px;padding:20px;text-align:center;color:#00BFFF;font-family:sans-serif"><p style="font-size:18px;font-weight:bold">🚀 Sample Ad - Step 1</p><p style="color:#aaa">Replace this with your real ad code</p></div>',
      isActive: true,
    },
    {
      name: 'Step 2 Banner Ad',
      type: 'BANNER',
      placement: 'STEP_2',
      code: '<div style="background:#1a1a2e;border:1px solid #8A2BE2;border-radius:8px;padding:20px;text-align:center;color:#8A2BE2;font-family:sans-serif"><p style="font-size:18px;font-weight:bold">🚀 Sample Ad - Step 2</p><p style="color:#aaa">Replace this with your real ad code</p></div>',
      isActive: true,
    },
    {
      name: 'Step 3 Banner Ad',
      type: 'BANNER',
      placement: 'STEP_3',
      code: '<div style="background:#1a1a2e;border:1px solid #00FF88;border-radius:8px;padding:20px;text-align:center;color:#00FF88;font-family:sans-serif"><p style="font-size:18px;font-weight:bold">🚀 Sample Ad - Step 3</p><p style="color:#aaa">Replace this with your real ad code</p></div>',
      isActive: true,
    },
  ]

  for (const ad of ads) {
    await prisma.ad.create({ data: ad as any })
  }
  console.log(`✅ ${ads.length} sample ads seeded`)

  console.log('\n🎉 Database seeded successfully!')
  console.log(`\nAdmin credentials:\n  Email: ${admin.email}\n  Password: ${process.env.ADMIN_PASSWORD || 'Admin123!'}`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
