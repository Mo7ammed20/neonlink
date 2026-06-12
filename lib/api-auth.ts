import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * Validates an API key from the Authorization header.
 * Returns the userId on success, null on failure.
 */
export async function validateApiKey(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  const key = authHeader.slice(7).trim()
  if (!key) return null

  const apiKey = await prisma.apiKey.findUnique({
    where: { key },
    select: { userId: true, id: true },
  })

  if (!apiKey) return null

  // Update usage stats (fire-and-forget)
  prisma.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsed: new Date(), usageCount: { increment: 1 } },
  }).catch(() => null)

  return apiKey.userId
}
