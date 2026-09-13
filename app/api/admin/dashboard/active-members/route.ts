import { NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { users } from '@/lib/admin/db/schema'
import { eq, sql } from 'drizzle-orm'
import { cachedJson } from '@/lib/admin/cache'

export const dynamic = 'force-dynamic'

// Current count of active team members, broken down by role.
export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ total: 0, byRole: [] }, { status: 401 })

  const data = await cachedJson('dashboard:active-members', 120, async () => {
    const byRole = await db
      .select({ role: users.role, count: sql<number>`count(*)::int` })
      .from(users)
      .where(eq(users.isActive, true))
      .groupBy(users.role)

    const total = byRole.reduce((sum, r) => sum + r.count, 0)
    return { total, byRole: byRole.map((r) => ({ role: r.role, count: r.count })) }
  })

  return NextResponse.json(data)
}
