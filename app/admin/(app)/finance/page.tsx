import { db } from '@/lib/admin/db'
import { invoices, expenses } from '@/lib/admin/db/schema'
import { desc, eq, sql, and, gte } from 'drizzle-orm'
import HeroSection from '@/components/admin/layout/HeroSection'
import Link from 'next/link'
import KpiCard from '@/components/admin/dashboard/KpiCard'
import InvoicesTable from '@/components/admin/finance/InvoicesTable'

export const metadata = { title: 'Finance — Kyfaru Admin' }
export const dynamic = 'force-dynamic'

export default async function FinancePage() {
  const startOfYear = new Date(new Date().getFullYear(), 0, 1)

  const [totalRevenue, totalExpenses, pendingAmount, recentInvoices] = await Promise.all([
    db
      .select({ sum: sql<string>`coalesce(sum(amount),0)::text` })
      .from(invoices)
      .where(and(eq(invoices.status, 'paid'), gte(invoices.paidAt!, startOfYear)))
      .then((r) => parseFloat(r[0]?.sum ?? '0')),

    db
      .select({ sum: sql<string>`coalesce(sum(amount),0)::text` })
      .from(expenses)
      .where(gte(expenses.paidAt!, startOfYear))
      .then((r) => parseFloat(r[0]?.sum ?? '0')),

    db
      .select({ sum: sql<string>`coalesce(sum(amount),0)::text` })
      .from(invoices)
      .where(eq(invoices.status, 'sent'))
      .then((r) => parseFloat(r[0]?.sum ?? '0')),

    db.query.invoices.findMany({
      limit: 20,
      orderBy: [desc(invoices.createdAt)],
      with: { client: true },
    }),
  ])

  return (
    <div className="space-y-6 kf-anim-in">
      <HeroSection
        title="Finance"
        subtitle="Revenue, invoices, expenses, and profitability overview."
        actions={
          <Link href="/admin/finance/invoices/new" className="kf-btn-primary">
            New Invoice
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard title="Revenue YTD" value={totalRevenue} format="money" icon="Wallet" color="green" />
        <KpiCard title="Expenses YTD" value={totalExpenses} format="money" icon="AlertTriangle" color="red" />
        <KpiCard title="Outstanding" value={pendingAmount} format="money" icon="Clock" color="yellow" />
      </div>

      <InvoicesTable initialData={recentInvoices} />
    </div>
  )
}
