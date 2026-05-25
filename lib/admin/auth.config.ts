// ============================================================
// Auth.js shared config — edge-safe (used by middleware too).
// Heavy adapters/db calls live in lib/admin/auth.ts.
// ============================================================
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  providers: [], // populated in lib/admin/auth.ts
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60, // 8 hours
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const path = nextUrl.pathname
      const isAdminArea = path.startsWith('/admin')
      const isAuthRoute =
        path.startsWith('/admin/login') || path.startsWith('/admin/two-factor')

      if (isAdminArea && !isAuthRoute && !isLoggedIn) {
        return false
      }
      if (isAuthRoute && isLoggedIn && (auth as any)?.user?.isTwoFactorVerified) {
        return Response.redirect(new URL('/admin', nextUrl))
      }
      return true
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = (user as any).id
        token.role = (user as any).role ?? 'viewer'
        token.isTwoFactorEnabled = (user as any).isTwoFactorEnabled ?? false
        token.isTwoFactorVerified = !((user as any).isTwoFactorEnabled ?? false)
      }
      if (trigger === 'update' && session?.isTwoFactorVerified) {
        token.isTwoFactorVerified = true
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        ;(session.user as any).id = token.id
        ;(session.user as any).role = token.role
        ;(session.user as any).isTwoFactorEnabled = token.isTwoFactorEnabled
        ;(session.user as any).isTwoFactorVerified = token.isTwoFactorVerified
      }
      return session
    },
  },
} satisfies NextAuthConfig
