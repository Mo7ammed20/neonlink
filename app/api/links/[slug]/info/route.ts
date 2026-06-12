import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { setRedirectSession } from '@/lib/redis'
import { nanoid } from 'nanoid'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const link = await prisma.link.findUnique({
      where: { slug },
<<<<<<< HEAD
      select: { id:true, slug:true, originalUrl:true, title:true,
                isActive:true, password:true, expiresAt:true, userId:true },
    })
    if (!link)          return NextResponse.json({ success:false, error:'Link not found' }, { status:404 })
    if (!link.isActive) return NextResponse.json({ success:false, error:'Link is disabled' }, { status:410 })
    if (link.expiresAt && new Date(link.expiresAt) < new Date())
      return NextResponse.json({ success:false, error:'Link has expired' }, { status:410 })

    // Settings
    const rows = await prisma.setting.findMany()
    const S = Object.fromEntries(rows.map(r => [r.key, r.value]))

    const adsEnabled = S['ads_enabled'] !== 'false'
    const adTimer    = parseInt(S['default_ad_timer'] || '30', 10)

    // Article sections (one per step)
    const articleTitle = S['article_title'] || ''
    const sections = [1,2,3].map(i => ({
      title:   S[`article_page_${i}_title`]   || '',
      content: S[`article_page_${i}_content`] || '',
    }))

    // Active ads
    const ads = await prisma.ad.findMany({
      where: { isActive: true },
      select: { id:true, placement:true, code:true },
      orderBy: { priority: 'desc' },
    })
    const hasAnyAd = ads.length > 0

    // ── ALWAYS 3 STEPS. That's it. ──
    const adStepsCount = adsEnabled && hasAnyAd ? 3 : 0

    // Session
    const sessionKey = nanoid(24)
    const ip = (req.headers.get('x-forwarded-for') || '127.0.0.1').split(',')[0].trim()
    await setRedirectSession(sessionKey, { linkId:link.id, slug:link.slug, step:0, ip })
=======
      select: {
        id: true,
        slug: true,
        originalUrl: true,
        title: true,
        isActive: true,
        password: true,
        expiresAt: true,
        userId: true,
      },
    })

    if (!link) {
      return NextResponse.json({ success: false, error: 'Link not found' }, { status: 404 })
    }

    if (!link.isActive) {
      return NextResponse.json({ success: false, error: 'Link is disabled' }, { status: 410 })
    }

    if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
      return NextResponse.json({ success: false, error: 'Link has expired' }, { status: 410 })
    }

    // Get active ads for each step
    const ads = await prisma.ad.findMany({
      where: { isActive: true },
      select: { id: true, placement: true, code: true, type: true },
    })

    const adSteps = [
      ads.find((a: { placement: string }) => a.placement === 'STEP_1'),
      ads.find((a: { placement: string }) => a.placement === 'STEP_2'),
      ads.find((a: { placement: string }) => a.placement === 'STEP_3'),
    ].filter(Boolean)

    // Get ad timer setting
    const timerSetting = await prisma.setting.findUnique({ where: { key: 'default_ad_timer' } })
    const adTimer = parseInt(timerSetting?.value || '30', 10)

    // Generate session key and store in Redis
    const sessionKey = nanoid(24)
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1'

    await setRedirectSession(sessionKey, {
      linkId: link.id,
      slug: link.slug,
      step: 0,
      ip,
    })
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889

    return NextResponse.json({
      success: true,
      data: {
<<<<<<< HEAD
        id:link.id, slug:link.slug, originalUrl:link.originalUrl, title:link.title,
        hasPassword: link.password !== null,
        adSteps:  adStepsCount,
        adTimer,
        sessionKey,
        articleTitle,
        articleSections: sections,
        ads: ads.map(a => ({ id:a.id, placement:a.placement, code:a.code })),
      },
    })
  } catch (err) {
    console.error('[INFO]', err)
    return NextResponse.json({ success:false, error:'Internal server error' }, { status:500 })
=======
        id: link.id,
        slug: link.slug,
        originalUrl: link.originalUrl,
        title: link.title,
        hasPassword: link.password !== null,
        adSteps: adSteps.length,
        adTimer,
        sessionKey,
        ads: ads.map((a: { id: string; placement: string; code: string; type: string }) => ({
          id: a.id,
          placement: a.placement,
          code: a.code,
          type: a.type,
        })),
      },
    })
  } catch (err) {
    console.error('[LINK_INFO]', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
  }
}
