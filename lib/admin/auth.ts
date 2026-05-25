// ============================================================
// Auth.js — main entry. Used by route handlers + server actions.
// ============================================================
/* eslint-disable @typescript-eslint/no-explicit-any */

import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

import { db } from './db'
import { users, accounts, sessions, verificationTokens } from './db/schema'
import { authConfig } from './auth.config'
import { checkRateLimit, recordLoginAttempt } from './rate-limit'

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db, {
    usersTable: users as any,
    accountsTable: accounts as any,
    sessionsTable: sessions as any,
    verificationTokensTable: verificationTokens as any,
  }) as any,
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data

        // Rate-limit
        const allowed = await checkRateLimit(email)
        if (!allowed) {
          throw new Error('Too many login attempts. Try again in 15 minutes.')
        }

        const user = await db.query.users.findFirst({
          where: eq(users.email, email),
        })

        if (!user || !user.isActive || !user.passwordHash) {
          await recordLoginAttempt(email, false)
          return null
        }

        const ok = await bcrypt.compare(password, user.passwordHash)
        if (!ok) {
          await recordLoginAttempt(email, false)
          return null
        }

        await recordLoginAttempt(email, true)
        await db
          .update(users)
          .set({ lastLoginAt: new Date() })
          .where(eq(users.id, user.id))

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatarUrl ?? null,
          role: user.role,
          isTwoFactorEnabled: user.isTwoFactorEnabled,
        } as any
      },
    }),
  ],
})
