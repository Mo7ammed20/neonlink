import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateApiKey } from '@/lib/utils'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const keys = await prisma.apiKey.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, key: true, prefix: true, createdAt: true, lastUsed: true, usageCount: true, isActive: true },
    })

    return NextResponse.json({ keys })
  } catch (err) {
    console.error('[API_KEYS_GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { name } = await req.json()
    if (!name?.trim()) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

    const count = await prisma.apiKey.count({ where: { userId: session.user.id } })
    if (count >= 10) {
      return NextResponse.json({ error: 'Maximum of 10 API keys allowed' }, { status: 400 })
    }

    const key = generateApiKey()
    // prefix = first segment of the key e.g. "nl"
    const prefix = key.split('_')[0] + '_'

    const apiKey = await prisma.apiKey.create({
      data: { name: name.trim(), key, prefix, userId: session.user.id },
      select: { id: true, name: true, key: true, prefix: true, createdAt: true, usageCount: true },
    })

    return NextResponse.json({ apiKey }, { status: 201 })
  } catch (err) {
    console.error('[API_KEYS_POST]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Key ID required' }, { status: 400 })

    await prisma.apiKey.deleteMany({ where: { id, userId: session.user.id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[API_KEYS_DELETE]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
