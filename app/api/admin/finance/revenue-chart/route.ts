import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { invoices } from '@/lib/admin/db/schema'
import { eq, gte, lte, and, sql, type SQL } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

// Supports ?range=7d|30d|90d|6m or ?from=YYYY-MM-DD&to=YYYY-MM-DD.
// Buckets by day for short ranges, by month for long ones.
export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ data: [] }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const range = searchParams.get('range') ?? '6m'
  const fromParam = searchParams.get('from')
  const toParam = searchParams.get('to')

  let from = new Date()
  let to = new Date()
  let byMonth = false

  if (fromParam && toParam) {
    from = new Date(fromParam)
    to = new Date(toParam)
    byMonth = (to.getTime() - from.getTime()) / 86400000 > 92
  } else if (range === '7d') {
    from.setDate(from.getDate() - 6)
  } else if (range === '30d') {
    from.setDate(from.getDate() - 29)
  } else if (range === '90d') {
    from.setDate(from.getDate() - 89)
    byMonth = false
  } else {
    from.setMonth(from.getMonth() - 5)
    from.setDate(1)
    byMonth = true
  }
  from.setHours(0, 0, 0, 0)
  to.setHours(23, 59, 59, 999)

  const fmt = byMonth ? `'Mon YY'` : `'DD Mon'`
  const trunc = byMonth ? `date_trunc('month', paid_at)` : `date_trunc('day', paid_at)`

  const conds: SQL[] = [eq(invoices.status, 'paid'), gte(invoices.paidAt!, from), lte(invoices.paidAt!, to)]

  const rows = await db
    .select({
      label: sql<string>`to_char(paid_at, ${sql.raw(fmt)})`,
      revenue: sql<number>`coalesce(sum(amount),0)::numeric`,
    })
    .from(invoices)
    .where(and(...conds))
    .groupBy(sql`to_char(paid_at, ${sql.raw(fmt)}), ${sql.raw(trunc)}`)
    .orderBy(sql`${sql.raw(trunc)}`)

  return NextResponse.json({ data: rows.map((r) => ({ month: r.label, revenue: Number(r.revenue) })) })
}
