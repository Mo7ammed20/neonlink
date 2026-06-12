import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { password } = await req.json()

    const link = await prisma.link.findUnique({
      where: { slug },
      select: { id: true, password: true },
    })

    if (!link) return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    if (!link.password) return NextResponse.json({ valid: true })

    const valid = await bcrypt.compare(password, link.password!)
    if (!valid) return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })

    return NextResponse.json({ valid: true })
  } catch (err) {
    console.error('[VERIFY_PASSWORD]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
