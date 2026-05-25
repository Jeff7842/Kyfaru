// ============================================================
// Edge middleware — protects /admin/* and enforces 2FA flow.
// Uses the edge-safe `auth.config` (no DB / no Node modules).
// ============================================================
/* eslint-disable @typescript-eslint/no-explicit-any */

import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'
import { authConfig } from '@/lib/admin/auth.config'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const session: any = (req as any).auth
  const isLoggedIn = !!session?.user
  const path = nextUrl.pathname

  // Only guard the admin area
  if (!path.startsWith('/admin')) return NextResponse.next()

  const isLoginPage = path === '/admin/login'
  const isTwoFactorPage = path === '/admin/two-factor'

  // Not logged in → force login
  if (!isLoggedIn && !isLoginPage) {
    const url = new URL('/admin/login', nextUrl)
    if (path !== '/admin') url.searchParams.set('callbackUrl', path)
    return NextResponse.redirect(url)
  }

  // Logged in, but 2FA required and not yet verified
  if (
    isLoggedIn &&
    session.user.isTwoFactorEnabled &&
    !session.user.isTwoFactorVerified &&
    !isTwoFactorPage &&
    !isLoginPage
  ) {
    return NextResponse.redirect(new URL('/admin/two-factor', nextUrl))
  }

  // Already logged in → don't show login
  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL('/admin', nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Run middleware for everything except static files, _next, and api/auth.
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg|.*\\.jpg).*)',
  ],
}
