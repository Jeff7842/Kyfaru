import { NextResponse } from 'next/server'
import { and, eq, sql } from 'drizzle-orm'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { notifications } from '@/lib/admin/db/schema'

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ count: 0 })
  const userId = (session.user as { id: string }).id

  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)))

  return NextResponse.json({ count: row?.count ?? 0 })
}
