import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const PROTECTED_PREFIXES = ['/dashboard', '/admin']
// Routes only for guests (redirect to dashboard if logged in)
const GUEST_ONLY = ['/login', '/register', '/forgot-password']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const session = await auth()
  const isLoggedIn = !!session?.user

  // Redirect authenticated users away from guest-only pages
  if (isLoggedIn && GUEST_ONLY.some(p => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redirect unauthenticated users away from protected routes
  if (!isLoggedIn && PROTECTED_PREFIXES.some(p => pathname.startsWith(p))) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Admin-only protection (allow ADMIN and SUPERADMIN)
  if (pathname.startsWith('/admin') &&
    !['ADMIN', 'SUPERADMIN'].includes(session?.user?.role as string)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Maintenance mode check (skip for admin and auth routes)
  // This would read from DB/cache in production; skipped here for simplicity

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all except static files and API
    '/((?!_next/static|_next/image|favicon.ico|public/|api/).*)',
  ],
}
