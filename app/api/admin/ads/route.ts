import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
<<<<<<< HEAD
import { prisma } from '@/lib/prisma'
import { cacheDelPattern } from '@/lib/redis'

// Invalidate all cached ad/link data after any ad change
async function invalidateAdCache() {
  await cacheDelPattern('link:info:*')
  await cacheDelPattern('ads:active')
}
=======


import { prisma } from '@/lib/prisma'
import { cacheGetOrSet, cacheDel } from '@/lib/redis'
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
<<<<<<< HEAD
    const ads = await prisma.ad.findMany({ orderBy: [{ placement: 'asc' }, { priority: 'desc' }, { createdAt: 'desc' }] })
=======

    const ads = await prisma.ad.findMany({ orderBy: { createdAt: 'desc' } })
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
    return NextResponse.json({ ads })
  } catch (err) {
    console.error('[ADMIN_ADS_GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

<<<<<<< HEAD
    const { name, type, placement, code, isActive, priority, notes } = await req.json()
=======
    const { name, type, placement, code, isActive } = await req.json()
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
    if (!name || !type || !placement || !code) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

<<<<<<< HEAD
    const ad = await prisma.ad.create({
      data: {
        name,
        type,
        placement,
        code,
        isActive: isActive ?? true,
        priority: priority ?? 0,
        notes: notes ?? null,
      },
    })

    // FIX #4: Proper cache invalidation
    await invalidateAdCache()
=======
    const ad = await prisma.ad.create({ data: { name, type, placement, code, isActive: isActive ?? true } })

    // Invalidate link info cache (ads changed)
    await cacheDel('link:info:*')
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889

    return NextResponse.json({ success: true, ad }, { status: 201 })
  } catch (err) {
    console.error('[ADMIN_ADS_POST]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id, ...data } = await req.json()
    if (!id) return NextResponse.json({ error: 'Ad ID required' }, { status: 400 })

    const ad = await prisma.ad.update({ where: { id }, data })
<<<<<<< HEAD

    // FIX #4: Also invalidate on PATCH (was missing before)
    await invalidateAdCache()

=======
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
    return NextResponse.json({ success: true, ad })
  } catch (err) {
    console.error('[ADMIN_ADS_PATCH]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Ad ID required' }, { status: 400 })

    await prisma.ad.delete({ where: { id } })
<<<<<<< HEAD

    // FIX #4: Also invalidate on DELETE (was missing before)
    await invalidateAdCache()

=======
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[ADMIN_ADS_DELETE]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
