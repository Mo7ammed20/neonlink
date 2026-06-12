import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'


import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const [totalUsers, totalLinks, totalClicks, activeUsers, recentUsers, topLinks] =
      await Promise.all([
        prisma.user.count(),
        prisma.link.count(),
        prisma.click.count(),
        prisma.user.count({ where: { status: 'ACTIVE' } }),
        prisma.user.findMany({
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true, name: true, email: true,
            plan: true, role: true,
            createdAt: true, _count: { select: { links: true } },
          },
        }),
        prisma.link.findMany({
          orderBy: { clickCount: 'desc' },
          take: 5,
          select: {
            id: true, slug: true, originalUrl: true,
            clickCount: true, createdAt: true,
            user: { select: { name: true, email: true } },
          },
        }),
      ])

    // 7-day click chart
    const since = new Date()
    since.setDate(since.getDate() - 7)
    const recentClicks = await prisma.click.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
    })

    const clicksByDay: Record<string, number> = {}
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      clicksByDay[d.toISOString().split('T')[0]] = 0
    }
    for (const c of recentClicks) {
      const k = c.createdAt.toISOString().split('T')[0]
      if (k in clicksByDay) clicksByDay[k]++
    }

    return NextResponse.json({
      stats: {
        totalUsers,
        totalLinks,
        totalClicks,
        activeUsers,
      },
      chartData: Object.entries(clicksByDay).map(([date, clicks]) => ({ date, clicks })),
      recentUsers,
      topLinks,
    })
  } catch (err) {
    console.error('[ADMIN_STATS]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
