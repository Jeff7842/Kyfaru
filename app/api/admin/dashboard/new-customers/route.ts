import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { clients } from '@/lib/admin/db/schema'
import { gte, lte, and, sql } from 'drizzle-orm'
import { cachedJson } from '@/lib/admin/cache'
import { resolveDateRange, bucketSqlParts } from '@/lib/admin/db/date-buckets'

export const dynamic = 'force-dynamic'

// Count of new clients per bucket. Supports ?range=7d|30d|90d|6m or ?from&to.
export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ data: [] }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const range = searchParams.get('range') ?? '6m'
  const fromParam = searchParams.get('from')
  const toParam = searchParams.get('to')

  const { from, to, byMonth } = resolveDateRange({ range, from: fromParam, to: toParam })
  const { fmt, trunc } = bucketSqlParts('created_at', byMonth)

  const cacheKey = `dashboard:new-customers:${range}:${fromParam ?? ''}:${toParam ?? ''}`
  const data = await cachedJson(cacheKey, 120, async () => {
    const rows = await db
      .select({
        label: sql<string>`to_char(created_at, ${sql.raw(fmt)})`,
        count: sql<number>`count(*)::int`,
      })
      .from(clients)
      .where(and(gte(clients.createdAt, from), lte(clients.createdAt, to)))
      .groupBy(sql`to_char(created_at, ${sql.raw(fmt)}), ${sql.raw(trunc)}`)
      .orderBy(sql`${sql.raw(trunc)}`)

    return rows.map((r) => ({ month: r.label, count: r.count }))
  })

  return NextResponse.json({ data })
}
