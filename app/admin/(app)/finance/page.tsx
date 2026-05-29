import { db } from '@/lib/admin/db'
import { invoices, expenses } from '@/lib/admin/db/schema'
import { eq, sql, and, gte } from 'drizzle-orm'
import HeroSection from '@/components/admin/layout/HeroSection'
import KpiCard from '@/components/admin/dashboard/KpiCard'
import InvoicesTable from '@/components/admin/finance/InvoicesTable'
import ExpensesTable from '@/components/admin/finance/ExpensesTable'

export const metadata = { title: 'Finance — Kyfaru Admin' }
export const dynamic = 'force-dynamic'

export default async function FinancePage() {
  const startOfYear = new Date(new Date().getFullYear(), 0, 1)

  const [totalRevenue, totalExpenses, pendingAmount] = await Promise.all([
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
  ])

  return (
    <div className="space-y-6 kf-anim-in">
      <HeroSection
        title="Finance"
        subtitle="Revenue, invoices, expenses, and profitability overview."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard title="Revenue YTD" value={totalRevenue} format="money" icon="Wallet" color="green" />
        <KpiCard title="Expenses YTD" value={totalExpenses} format="money" icon="AlertTriangle" color="red" />
        <KpiCard title="Outstanding" value={pendingAmount} format="money" icon="Clock" color="yellow" />
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-[var(--kf-text)]">Invoices</h2>
        <InvoicesTable />
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-[var(--kf-text)]">Expenses</h2>
        <ExpensesTable />
      </div>
    </div>
  )
}
