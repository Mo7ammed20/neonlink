import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const url = searchParams.get('url')
    const size = parseInt(searchParams.get('size') || '256', 10)
    const format = (searchParams.get('format') || 'svg') as 'svg' | 'png'

    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 })

    if (format === 'png') {
      const buffer = await QRCode.toBuffer(url, {
        width: Math.min(size, 1024),
        margin: 2,
        color: {
          dark: '#00BFFF',
          light: '#0A0A0F',
        },
      })
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': `attachment; filename="qrcode.png"`,
          'Cache-Control': 'public, max-age=3600',
        },
      })
    }

    const svg = await QRCode.toString(url, {
      type: 'svg',
      margin: 2,
      color: {
        dark: '#00BFFF',
        light: '#0A0A0F',
      },
    })

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (err) {
    console.error('[QR]', err)
    return NextResponse.json({ error: 'Failed to generate QR code' }, { status: 500 })
  }
}
