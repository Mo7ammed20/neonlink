import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getRedirectSession } from '@/lib/redis'
import { parseUserAgent } from '@/lib/utils'
import { headers } from 'next/headers'

async function getGeoData(ip: string) {
  try {
    if (!process.env.IPINFO_TOKEN || ip === '127.0.0.1' || ip === '::1') {
      return { country: 'Unknown', city: 'Unknown', region: 'Unknown' }
    }
    const res = await fetch(`https://ipinfo.io/${ip}?token=${process.env.IPINFO_TOKEN}`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return { country: 'Unknown', city: 'Unknown', region: 'Unknown' }
    const data = await res.json()
    return {
      country: data.country || 'Unknown',
      city: data.city || 'Unknown',
      region: data.region || 'Unknown',
    }
  } catch {
    return { country: 'Unknown', city: 'Unknown', region: 'Unknown' }
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    // Support both sessionKey (new) and sessionId (legacy)
    const body = await req.json()
    const sessionKey: string | undefined = body.sessionKey ?? body.sessionId

    if (!sessionKey) {
      return NextResponse.json({ error: 'Session required' }, { status: 400 })
    }

    // Validate session
    const session = await getRedirectSession(sessionKey)
    if (!session) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 403 })
    }
    // Validate that session belongs to this slug
    if (session.slug !== slug) {
      return NextResponse.json({ error: 'Session slug mismatch' }, { status: 403 })
    }

    // Get the link
    const link = await prisma.link.findUnique({
      where: { slug },
      select: { id: true, originalUrl: true, userId: true },
    })
    if (!link) return NextResponse.json({ error: 'Link not found' }, { status: 404 })

    // Parse request info
    const headerList = await headers()
    const forwarded = headerList.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1'
    const ua = headerList.get('user-agent') || ''
    const referer = headerList.get('referer') || ''

    const { browser, os, device } = parseUserAgent(ua)
    const geo = await getGeoData(ip)

    // Record click
    await prisma.click.create({
      data: {
        linkId: link.id,
        ip,
        country: geo.country,
        city: geo.city,
        browser,
        os,
        device,
        referrer: referer,
        userAgent: ua,
      },
    })

    // Increment link click count
    await prisma.link.update({
      where: { id: link.id },
      data: { clickCount: { increment: 1 } },
    })

    // Update user click count
    if (link.userId) {
      await prisma.user.update({
        where: { id: link.userId },
        data: { totalClicks: { increment: 1 } },
      }).catch(() => null)
    }

    return NextResponse.json({ success: true, url: link.originalUrl })
  } catch (err) {
    console.error('[COMPLETE]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
