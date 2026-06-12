import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const linkId = searchParams.get('linkId')
    const period = parseInt(searchParams.get('period') || '30', 10)

    const since = new Date()
    since.setDate(since.getDate() - period)

    const whereClause = {
      createdAt: { gte: since },
      ...(linkId
        ? { linkId }
        : { link: { userId: session.user.id } }),
    }

    const [totalClicks, uniqueIPs, topCountries, topBrowsers, topDevices, totalLinks, userStats] =
      await Promise.all([
        prisma.click.count({ where: whereClause }),

        prisma.click.groupBy({
          by: ['ip'],
          where: whereClause,
          _count: true,
        }).then((r: { ip: string | null }[]) => r.length),

        prisma.click.groupBy({
          by: ['country'],
          where: whereClause,
          _count: { country: true },
          orderBy: { _count: { country: 'desc' } },
          take: 10,
        }),

        prisma.click.groupBy({
          by: ['browser'],
          where: whereClause,
          _count: { browser: true },
          orderBy: { _count: { browser: 'desc' } },
          take: 8,
        }),

        prisma.click.groupBy({
          by: ['device'],
          where: whereClause,
          _count: { device: true },
          orderBy: { _count: { device: 'desc' } },
          take: 5,
        }),

        prisma.link.count({ where: { userId: session.user.id } }),

        prisma.user.findUnique({
          where: { id: session.user.id },
          select: { totalClicks: true, earnings: true },
        }),
      ])

    return NextResponse.json({
      success: true,
      data: {
        totalLinks,
        totalClicks: userStats?.totalClicks ?? totalClicks,
        uniqueVisitors: uniqueIPs,
        earnings: userStats?.earnings ?? 0,
      },
      countries: topCountries.map((c: { country: string | null; _count: { country: number } }) => ({
        name: c.country || 'Unknown',
        clicks: c._count.country,
      })),
      browsers: topBrowsers.map((b: { browser: string | null; _count: { browser: number } }) => ({
        name: b.browser || 'Unknown',
        clicks: b._count.browser,
      })),
      devices: topDevices.map((d: { device: string | null; _count: { device: number } }) => ({
        name: d.device || 'Unknown',
        clicks: d._count.device,
      })),
    })
  } catch (err) {
    console.error('[ANALYTICS_SUMMARY]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
