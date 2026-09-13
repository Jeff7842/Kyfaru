import { NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { notifications } from '@/lib/admin/db/schema'
import { and, isNull, eq, desc } from 'drizzle-orm'
import { cachedJson } from '@/lib/admin/cache'

export const dynamic = 'force-dynamic'

// Broadcast notifications raised by the public site (contact/quote forms use
// userId: null, type: 'system' - see app/api/contact and app/api/quote).
export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ data: [] }, { status: 401 })

  const data = await cachedJson('dashboard:website-notifications', 60, async () => {
    return db
      .select()
      .from(notifications)
      .where(and(isNull(notifications.userId), eq(notifications.type, 'system')))
      .orderBy(desc(notifications.createdAt))
      .limit(10)
  })

  return NextResponse.json({ data })
}
