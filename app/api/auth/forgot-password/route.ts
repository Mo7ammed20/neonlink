import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { email } })

    // Always return success to prevent email enumeration
    if (!user) return NextResponse.json({ success: true })

    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 3600000) // 1 hour

    await prisma.verificationToken.upsert({
      where: { identifier_token: { identifier: email, token } },
      update: { token, expires },
      create: { identifier: email, token, expires },
    })

    // In production, send email here
    // await sendPasswordResetEmail(email, token)
    console.log(`[DEV] Password reset token for ${email}: ${token}`)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[FORGOT_PASSWORD]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
