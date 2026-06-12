import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cacheDel } from '@/lib/redis'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || !['ADMIN','SUPERADMIN'].includes(session.user.role as string)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const search = searchParams.get('search') || ''

    const where = search
      ? {
          OR: [
            { slug: { contains: search, mode: 'insensitive' as const } },
            { originalUrl: { contains: search, mode: 'insensitive' as const } },
            { title: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}

    const [links, total] = await Promise.all([
      prisma.link.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { clickCount: 'desc' },
        select: {
          id: true, slug: true, originalUrl: true, title: true,
          clickCount: true, isActive: true, createdAt: true,
          user: { select: { name: true, email: true } },
        },
      }),
      prisma.link.count({ where }),
    ])

    return NextResponse.json({ links, total, pages: Math.ceil(total / limit) })
  } catch (err) {
    console.error('[ADMIN_LINKS_GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || !['ADMIN','SUPERADMIN'].includes(session.user.role as string)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Link ID required' }, { status: 400 })

    const link = await prisma.link.findUnique({ where: { id }, select: { slug: true } })
    if (!link) return NextResponse.json({ error: 'Link not found' }, { status: 404 })

    await prisma.link.delete({ where: { id } })
    await cacheDel(`link:info:${link.slug}`)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[ADMIN_LINKS_DELETE]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
