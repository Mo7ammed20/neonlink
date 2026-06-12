import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'


import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const settings = await prisma.setting.findMany()
    const map = Object.fromEntries(settings.map((s: { key: string; value: string }) => [s.key, s.value]))
    return NextResponse.json({ settings: map })
  } catch (err) {
    console.error('[ADMIN_SETTINGS_GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updates: Record<string, string> = await req.json()

    await Promise.all(
      Object.entries(updates).map(([key, value]) =>
        prisma.setting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[ADMIN_SETTINGS_POST]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
