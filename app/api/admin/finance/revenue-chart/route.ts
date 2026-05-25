import { NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { invoices } from '@/lib/admin/db/schema'
import { eq, gte, and, sql } from 'drizzle-orm'

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ data: [] }, { status: 401 })

  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
  sixMonthsAgo.setDate(1)
  sixMonthsAgo.setHours(0, 0, 0, 0)

  const rows = await db
    .select({
      month: sql<string>`to_char(paid_at, 'Mon YY')`,
      revenue: sql<number>`coalesce(sum(amount),0)::numeric`,
    })
    .from(invoices)
    .where(
      and(
        eq(invoices.status, 'paid'),
        gte(invoices.paidAt!, sixMonthsAgo),
      ),
    )
    .groupBy(sql`to_char(paid_at, 'Mon YY'), date_trunc('month', paid_at)`)
    .orderBy(sql`date_trunc('month', paid_at)`)

  return NextResponse.json({ data: rows })
}
