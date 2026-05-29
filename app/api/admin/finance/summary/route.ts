import { NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { invoices, expenses, projects } from '@/lib/admin/db/schema'
import { sql } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

// Aggregations powering the finance + dashboard chart widgets.
export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [invoiceByStatus, expenseByCategory, projectByStatus, paidTotal, expenseTotal, outstanding] = await Promise.all([
    db.select({ status: invoices.status, total: sql<string>`coalesce(sum(${invoices.amount}),0)::text`, count: sql<number>`count(*)::int` })
      .from(invoices).groupBy(invoices.status),
    db.select({ category: expenses.category, total: sql<string>`coalesce(sum(${expenses.amount}),0)::text` })
      .from(expenses).groupBy(expenses.category),
    db.select({ status: projects.status, count: sql<number>`count(*)::int` })
      .from(projects).groupBy(projects.status),
    db.select({ v: sql<string>`coalesce(sum(${invoices.amount}),0)::text` }).from(invoices).where(sql`${invoices.status} = 'paid'`),
    db.select({ v: sql<string>`coalesce(sum(${expenses.amount}),0)::text` }).from(expenses),
    db.select({ v: sql<string>`coalesce(sum(${invoices.amount}),0)::text` }).from(invoices).where(sql`${invoices.status} in ('sent','overdue')`),
  ])

  const revenue = Number(paidTotal[0]?.v ?? 0)
  const expense = Number(expenseTotal[0]?.v ?? 0)

  return NextResponse.json({
    invoiceByStatus: invoiceByStatus.map((r) => ({ status: r.status, total: Number(r.total), count: r.count })),
    expenseByCategory: expenseByCategory.map((r) => ({ category: r.category, total: Number(r.total) })),
    projectByStatus: projectByStatus.map((r) => ({ status: r.status, count: r.count })),
    kpis: { revenue, expense, profit: revenue - expense, outstanding: Number(outstanding[0]?.v ?? 0) },
  })
}
