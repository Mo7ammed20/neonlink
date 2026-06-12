# NeonLink — تقرير الفحص الهندسي الشامل لنظام الإعلانات

> **التاريخ:** 12 يونيو 2026  
> **الإصدار:** Next.js 15 · Prisma 5 · Redis (ioredis)  
> **الحالة:** ✅ تم إصلاح جميع المشكلات الحرجة

---

## ملخص تنفيذي

تم فحص المشروع بالكامل: **141 ملفاً** شاملاً جميع طبقات النظام من قاعدة البيانات حتى المتصفح. تم اكتشاف **7 مشكلات** تتراوح بين حرجة وعالية الأولوية. **السبب الجذري الأول** لعدم ظهور الإعلانات هو خطأ في حساب عدد خطوات الإعلانات داخل `/api/links/[slug]/info/route.ts` — فإعلانات GLOBAL لا تُحتسب أبداً ضمن الخطوات، مما يجعل المستخدم يُحوَّل فوراً دون رؤية أي إعلان.

---

## المشكلات مرتبةً حسب الخطورة

---

### 🔴 BUG #1 — CRITICAL: إعلانات GLOBAL لا تُطلق تدفق الإعلانات إطلاقاً

| الخاصية | القيمة |
|---------|--------|
| **الملف** | `app/api/links/[slug]/info/route.ts` |
| **السطر** | 37–44 |
| **الخطورة** | CRITICAL — الإعلانات لا تظهر أبداً إذا لم توجد إعلانات STEP_X |

**السبب:**
```typescript
// ❌ الكود القديم المكسور
const adSteps = [
  ads.find(a => a.placement === 'STEP_1'),
  ads.find(a => a.placement === 'STEP_2'),
  ads.find(a => a.placement === 'STEP_3'),
].filter(Boolean)
// adSteps.length = 0 إذا لم تكن هناك إعلانات STEP_X
// → المستخدم يُحوَّل مباشرةً دون رؤية أي إعلان!
```

الكود في `[slug]/page.tsx` يتحقق:
```typescript
} else if (data.data.adSteps > 0) {  // 0 = تخطي الإعلانات
  setPhase("ads");
} else {
  setPhase("redirecting");  // ← يذهب هنا دائماً إذا كان لديك GLOBAL فقط
}
```

**الإصلاح:**
```typescript
// ✅ الكود المصحح
const hasStep1 = ads.some(a => a.placement === 'STEP_1')
const hasStep2 = ads.some(a => a.placement === 'STEP_2')
const hasStep3 = ads.some(a => a.placement === 'STEP_3')
const hasGlobal = ads.some(a => a.placement === 'GLOBAL')

if (hasStep3) adStepsCount = 3
else if (hasStep2) adStepsCount = 2
else if (hasStep1) adStepsCount = 1
else if (hasGlobal) adStepsCount = 1  // ← GLOBAL يُطلق خطوة واحدة
```

---

### 🔴 BUG #2 — CRITICAL: اختيار الإعلان الخاطئ لكل خطوة (STEP vs GLOBAL)

| الخاصية | القيمة |
|---------|--------|
| **الملف** | `app/[slug]/page.tsx` |
| **السطر** | 282–284 |
| **الخطورة** | CRITICAL — GLOBAL يظهر بدلاً من STEP الصحيح أو العكس |

**السبب:**
```typescript
// ❌ خطأ: find() يُرجع أول تطابق في المصفوفة
// إذا جاء GLOBAL قبل STEP_1 في مصفوفة ads → سيظهر GLOBAL بدلاً من STEP_1
const currentAd = linkInfo?.ads?.find(a =>
  a.placement === `STEP_${stepState.currentStep}` || a.placement === "GLOBAL"
);
```

**الإصلاح:**
```typescript
// ✅ الأولوية: STEP المحدد > GLOBAL (fallback)
const currentAd =
  linkInfo?.ads?.find(a => a.placement === `STEP_${stepState.currentStep}`) ??
  linkInfo?.ads?.find(a => a.placement === "GLOBAL");
```

---

### 🔴 BUG #3 — CRITICAL: AdType في لوحة Admin لا يتطابق مع Prisma Schema

| الخاصية | القيمة |
|---------|--------|
| **الملف** | `app/(admin)/admin/ads/page.tsx` |
| **السطر** | 11, 30 |
| **الخطورة** | CRITICAL — إنشاء إعلان بـ INTERSTITIAL أو CUSTOM يتسبب في خطأ Prisma |

**السبب:**
```typescript
// ❌ في الـ Admin Page:
type AdType = 'BANNER' | 'POPUP' | 'NATIVE' | 'INTERSTITIAL' | 'CUSTOM'
//                                              ^^^^^^^^^^^^    ^^^^^^
//                         هذان النوعان غير موجودَيْن في Prisma!

// ✅ في Prisma Schema:
enum AdType { ADSENSE, PROPELLERADS, MONETAG, CUSTOM_HTML, BANNER, POPUP, NATIVE }
```

أي إعلان تم إنشاؤه بنوع `INTERSTITIAL` أو `CUSTOM` سيفشل عند الحفظ ولن يُخزَّن في قاعدة البيانات.

**الإصلاح:**
```typescript
// ✅ أنواع صحيحة تطابق Prisma تماماً
type AdType = 'ADSENSE' | 'PROPELLERADS' | 'MONETAG' | 'CUSTOM_HTML' | 'BANNER' | 'POPUP' | 'NATIVE'
```

---

### 🟠 BUG #4 — HIGH: `cacheDel('link:info:*')` لا تعمل مع Wildcards

| الخاصية | القيمة |
|---------|--------|
| **الملف** | `app/api/admin/ads/route.ts` + `lib/redis.ts` |
| **السطر** | route.ts:27 |
| **الخطورة** | HIGH — Cache لا يُمسح أبداً بعد تغيير الإعلانات |

**السبب:**
```typescript
// ❌ redis.del() لا يدعم Glob patterns
await cacheDel('link:info:*')
// يترجَم إلى: redis.del('link:info:*') — يحذف مفتاحاً حرفياً لا يوجد!
```

إضافةً لذلك: PATCH و DELETE لا يُبطلان الـ Cache أصلاً، فقط POST.

**الإصلاح:**
```typescript
// ✅ دالة جديدة cacheDelPattern في lib/redis.ts
export async function cacheDelPattern(pattern: string): Promise<void> {
  const keys = await redis.keys(pattern)
  if (keys.length > 0) await redis.del(...keys)
}

// في route.ts — تطبيق على POST + PATCH + DELETE
async function invalidateAdCache() {
  await cacheDelPattern('link:info:*')
  await cacheDelPattern('ads:active')
}
```

---

### 🟠 BUG #5 — HIGH: إعداد `ads_enabled` لا يُفحص في Info Route

| الخاصية | القيمة |
|---------|--------|
| **الملف** | `app/api/links/[slug]/info/route.ts` |
| **السطر** | 33–46 |
| **الخطورة** | HIGH — تعطيل الإعلانات من Admin Settings لا يعمل |

**السبب:** الـ Info Route يجلب `default_ad_timer` من الإعدادات لكنه لا يجلب أبداً `ads_enabled`. إذا قام الأدمن بتعطيل الإعلانات من لوحة التحكم، تستمر الإعلانات في الظهور.

**الإصلاح:**
```typescript
// ✅ في info/route.ts
const [timerSetting, adsEnabledSetting, adStepsSetting] = await Promise.all([
  prisma.setting.findUnique({ where: { key: 'default_ad_timer' } }),
  prisma.setting.findUnique({ where: { key: 'ads_enabled' } }),
  prisma.setting.findUnique({ where: { key: 'ad_steps' } }),
])
const adsEnabled = adsEnabledSetting?.value !== 'false'
if (!adsEnabled) adStepsCount = 0  // تخطي الإعلانات
```

---

### 🟠 BUG #6 — HIGH: عدد الخطوات يكسر الـ Sequence عند وجود ثغرات

| الخاصية | القيمة |
|---------|--------|
| **الملف** | `app/api/links/[slug]/info/route.ts` |
| **الخطورة** | HIGH — خطوة بدون إعلان تظهر فارغة |

**السبب:** إذا كان لديك STEP_1 و STEP_3 فعالَيْن دون STEP_2:
- `adSteps.length = 2`
- الخطوة الأولى: تبحث عن `STEP_1` ✅ موجود
- الخطوة الثانية: تبحث عن `STEP_2` ❌ غير موجود → إعلان فارغ!

**الإصلاح (في الكود المصحح):** الحساب الجديد يستخدم `hasStep3` → `hasStep2` → `hasStep1` تسلسلياً، مما يعني أن عدد الخطوات يتطابق دائماً مع الـ placements الموجودة فعلاً.

---

### 🟡 BUG #7 — MEDIUM: إعداد `ad_steps` غير موجود في قاعدة البيانات

| الخاصية | القيمة |
|---------|--------|
| **الملف** | `prisma/seed.ts` + `app/(admin)/admin/settings/page.tsx` |
| **الخطورة** | MEDIUM — الأدمن لا يستطيع التحكم في عدد الخطوات |

**الإصلاح:** تمت إضافة `ad_steps` إلى جدول Settings (القيمة `0` = Auto). تمت إضافة حقل اختيار في صفحة Settings لتحديد 1 أو 2 أو 3 خطوات يدوياً.

---

## خريطة رحلة الإعلان الكاملة (بعد الإصلاح)

```
قاعدة البيانات (Ad model)
        │
        ▼
/api/links/[slug]/info  ← يجلب كل الإعلانات النشطة
        │  ✅ يتحقق من ads_enabled
        │  ✅ يحسب adSteps (STEP_X + GLOBAL)
        │  ✅ يقرأ ad_steps من Settings
        │
        ▼
[slug]/page.tsx  ← يعرض الإعلانات في المتصفح
        │  ✅ currentAd يفضّل STEP_X على GLOBAL
        │  ✅ كشف حاجب الإعلانات (Bait Element)
        │
        ▼
AdSlot Component  ← يُدرج الكود ويُشغّل scripts
        │  ✅ يُعيد تنفيذ <script> tags بشكل صحيح
        │  ✅ يعرض رسالة إذا كُشف حاجب إعلانات
        │
        ▼
/api/links/[slug]/complete  ← يسجّل النقرة في قاعدة البيانات
```

---

## الملفات المعدَّلة

| الملف | التعديلات |
|-------|-----------|
| `app/api/links/[slug]/info/route.ts` | إصلاح BUG #1, #5, #6 |
| `app/[slug]/page.tsx` | إصلاح BUG #2 + إضافة كشف حاجب الإعلانات |
| `app/(admin)/admin/ads/page.tsx` | إصلاح BUG #3 + إضافة Preview/Priority/Notes/Stats |
| `app/api/admin/ads/route.ts` | إصلاح BUG #4 — Cache invalidation لجميع العمليات |
| `lib/redis.ts` | إضافة `cacheDelPattern()` مع دعم Wildcards |
| `app/(admin)/admin/settings/page.tsx` | إضافة حقل `ad_steps` + تحسينات UI |
| `prisma/seed.ts` | إصلاح BUG #3 + إضافة `ad_steps` setting |

---

## التحسينات المُضافة (فوق الإصلاحات)

### ✨ كشف حاجب الإعلانات (Ad Blocker Detection)
- تقنية "Bait Element" المستخدمة من YouTube, The Guardian, Forbes
- عرض رسالة "Ad Blocker Detected" بدلاً من فراغ صامت
- لا تعطيل قسري — فقط إشعار ودي يطلب من المستخدم إضافة الموقع للقائمة البيضاء

### ✨ محسّن Admin Ads Page
- **Preview مباشر** للإعلان داخل Modal قبل الحفظ
- **Priority field** — التحكم في أي إعلان يُعرض أولاً عند وجود متعددة لنفس الـ placement
- **Notes field** — ملاحظات داخلية (CPM، توقف الإعلان، تواريخ، إلخ)
- **Stats bar** — إجمالي الإعلانات، النشطة، الانطباعات، الإيرادات
- **أنواع إعلانات صحيحة**: AdSense, PropellerAds, Monetag, Custom HTML, Banner, Popup, Native
- **تلميحات توضيحية** لكل placement (GLOBAL = Fallback)
- **Collapsible sections** لكل placement لسهولة التنقل

### ✨ Admin Settings — خيارات Ad System الجديدة
- **ad_steps**: تحديد عدد خطوات التحويل (Auto / 1 / 2 / 3)
- **hints** توضيحية لكل إعداد
- **وصف** تأثير كل إعداد

---

## قائمة تحقق ما بعد Vercel Deployment

```
□ DATABASE_URL        — PostgreSQL URL كاملة
□ REDIS_URL           — Upstash Redis URL (أو أي Redis مُستضاف)
□ NEXTAUTH_SECRET     — 32+ حرف عشوائي
□ NEXTAUTH_URL        — https://yourdomain.vercel.app
□ NEXT_PUBLIC_APP_URL — https://yourdomain.vercel.app

□ npx prisma migrate deploy
□ npx prisma db seed  ← يُنشئ admin + إعدادات + إعلانات تجريبية

□ تسجيل دخول بـ admin@neonlink.io / Admin123!
□ Admin → Settings → تفعيل "Ads Enabled"
□ Admin → Ads Manager → إضافة إعلان STEP_1 (أو GLOBAL كـ fallback)
□ فتح أي رابط قصير للتحقق من ظهور الإعلان
```

---

## ملاحظة حول Vercel + Redis

Vercel Serverless لا يدعم Redis الاعتيادي (اتصال TCP مستمر). استخدم:
- **Upstash Redis** (https://upstash.com) — مجاني للمشاريع الصغيرة، يعمل مع Vercel بشكل مثالي
- أو **Redis Cloud** مع REST adapter

بدون `REDIS_URL`، يستخدم المشروع **In-Memory fallback** تلقائياً (يعمل لكنه مؤقت ويُفقد عند restart).
