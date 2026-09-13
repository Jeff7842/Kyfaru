import { NextResponse } from 'next/server'
import { and, eq, isNull, or, sql } from 'drizzle-orm'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { notifications } from '@/lib/admin/db/schema'

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ count: 0 })
  const userId = (session.user as { id: string }).id

  // Counts broadcast rows (userId IS NULL) as unread for everyone, since isRead is a
  // single shared column - mark-all-read deliberately does NOT clear these (see that
  // route) to avoid one admin silently dismissing a broadcast for the whole team.
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(notifications)
    .where(and(or(eq(notifications.userId, userId), isNull(notifications.userId)), eq(notifications.isRead, false)))

  return NextResponse.json({ count: row?.count ?? 0 })
}
