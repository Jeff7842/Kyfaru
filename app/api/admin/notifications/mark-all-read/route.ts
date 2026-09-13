import { NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { notifications } from '@/lib/admin/db/schema'
import { and, eq } from 'drizzle-orm'

export async function POST() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const userId = (session.user as { id: string }).id

  // Deliberately scoped to this user's own rows only - notifications.isRead is a
  // single shared column, not per-user, so marking a broadcast (userId IS NULL) row
  // read here would silently dismiss it for every other admin too. A proper fix
  // needs a per-user read-receipt table; until then, broadcasts stay unread in the
  // count (see unread-count/route.ts) rather than risk one admin hiding it for all.
  await db
    .update(notifications)
    .set({ isRead: true, readAt: new Date() })
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)))

  return NextResponse.json({ ok: true })
}
