import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'


import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const period = parseInt(searchParams.get('period') || '30', 10)
    const linkId = searchParams.get('linkId')

    const since = new Date()
    since.setDate(since.getDate() - period)

    const whereClause = {
      createdAt: { gte: since },
      ...(linkId
        ? { linkId }
        : { link: { userId: session.user.id } }),
    }

    const clicks = await prisma.click.findMany({
      where: whereClause,
      select: { createdAt: true, ip: true },
      orderBy: { createdAt: 'asc' },
    })

    // Group by date
    const dateMap = new Map<string, { clicks: number; ips: Set<string> }>()

    for (let i = 0; i < period; i++) {
      const d = new Date()
      d.setDate(d.getDate() - (period - 1 - i))
      const key = d.toISOString().split('T')[0]
      dateMap.set(key, { clicks: 0, ips: new Set() })
    }

    for (const click of clicks) {
      const key = click.createdAt.toISOString().split('T')[0]
      const entry = dateMap.get(key)
      if (entry) {
        entry.clicks++
        entry.ips.add(click.ip || '')
      }
    }

    const chartData = Array.from(dateMap.entries()).map(([date, data]) => ({
      date,
      clicks: data.clicks,
      unique: data.ips.size,
    }))

    return NextResponse.json({ success: true, data: chartData })
  } catch (err) {
    console.error('[ANALYTICS_CHART]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
