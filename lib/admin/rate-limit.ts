// ============================================================
// Login rate-limiter — DB-backed (serverless-safe).
// Max 5 failures per 15 min per email.
// ============================================================

import { and, eq, gte, sql } from 'drizzle-orm'
import { db } from './db'
import { loginAttempts } from './db/schema'

const WINDOW_MS = 15 * 60 * 1000
const MAX_FAILURES = 5

export async function checkRateLimit(email: string): Promise<boolean> {
  const since = new Date(Date.now() - WINDOW_MS)
  const result = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(loginAttempts)
    .where(
      and(
        eq(loginAttempts.email, email),
        eq(loginAttempts.success, false),
        gte(loginAttempts.createdAt, since),
      ),
    )
  const count = result[0]?.count ?? 0
  return count < MAX_FAILURES
}

export async function recordLoginAttempt(
  email: string,
  success: boolean,
  ipAddress = 'unknown',
) {
  try {
    await db.insert(loginAttempts).values({ email, success, ipAddress })
  } catch {
    // best-effort, don't throw
  }
}
