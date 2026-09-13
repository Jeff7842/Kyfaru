import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { invoices, expenses } from '@/lib/admin/db/schema'
import { eq, gte, lte, and, sql, type SQL } from 'drizzle-orm'
import { cachedJson } from '@/lib/admin/cache'
import { resolveDateRange, bucketSqlParts, enumerateBucketLabels } from '@/lib/admin/db/date-buckets'

export const dynamic = 'force-dynamic'

// Combines revenue + expenses into one profit/loss series per bucket, with
// margin %. Revenue and expenses are grouped independently (different
// tables), so buckets are zero-filled and aligned by label before combining -
// otherwise a bucket present in one series but not the other would silently
// misalign the rows.
export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ data: [] }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const range = searchParams.get('range') ?? '6m'
  const fromParam = searchParams.get('from')
  const toParam = searchParams.get('to')

  const { from, to, byMonth } = resolveDateRange({ range, from: fromParam, to: toParam })
  const { fmt, trunc } = bucketSqlParts('paid_at', byMonth)

  const cacheKey = `finance:pnl-chart:${range}:${fromParam ?? ''}:${toParam ?? ''}`
  const data = await cachedJson(cacheKey, 120, async () => {
    const revenueConds: SQL[] = [eq(invoices.status, 'paid'), gte(invoices.paidAt!, from), lte(invoices.paidAt!, to)]

    const [revenueRows, expenseRows] = await Promise.all([
      db
        .select({
          label: sql<string>`to_char(paid_at, ${sql.raw(fmt)})`,
          total: sql<number>`coalesce(sum(amount),0)::numeric`,
        })
        .from(invoices)
        .where(and(...revenueConds))
        .groupBy(sql`to_char(paid_at, ${sql.raw(fmt)}), ${sql.raw(trunc)}`)
        .orderBy(sql`${sql.raw(trunc)}`),
      db
        .select({
          label: sql<string>`to_char(paid_at, ${sql.raw(fmt)})`,
          total: sql<number>`coalesce(sum(amount),0)::numeric`,
        })
        .from(expenses)
        .where(and(gte(expenses.paidAt!, from), lte(expenses.paidAt!, to)))
        .groupBy(sql`to_char(paid_at, ${sql.raw(fmt)}), ${sql.raw(trunc)}`)
        .orderBy(sql`${sql.raw(trunc)}`),
    ])

    const revenueByLabel = new Map(revenueRows.map((r) => [r.label, Number(r.total)]))
    const expenseByLabel = new Map(expenseRows.map((r) => [r.label, Number(r.total)]))

    return enumerateBucketLabels(from, to, byMonth).map((label) => {
      const revenue = revenueByLabel.get(label) ?? 0
      const expense = expenseByLabel.get(label) ?? 0
      const profit = revenue - expense
      const margin = revenue > 0 ? Math.round((profit / revenue) * 1000) / 10 : 0
      return { month: label, revenue, expense, profit, margin }
    })
  })

  return NextResponse.json({ data })
}
