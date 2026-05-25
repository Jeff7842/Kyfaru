import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { formatMoney, formatDate } from '@/lib/admin/utils'
import StatusBadge from '@/components/admin/shared/StatusBadge'
import type { Invoice, Client } from '@/lib/admin/db/schema'

type Row = Invoice & { client: Client | null }

export default function RecentInvoices({ invoices }: { invoices: Row[] }) {
  return (
    <div className="kf-card rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-[var(--kf-text)]">Invoices</h2>
        <Link
          href="/admin/finance/invoices"
          className="text-xs text-[var(--kf-green)] hover:underline flex items-center gap-1"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      {invoices.length === 0 ? (
        <p className="text-sm text-[var(--kf-text-muted)]">No invoices yet.</p>
      ) : (
        <div className="divide-y divide-[var(--kf-border)]">
          {invoices.map((inv) => (
            <Link
              key={inv.id}
              href={`/admin/finance/invoices/${inv.id}`}
              className="flex items-center gap-3 py-3 hover:bg-zinc-50 -mx-6 px-6 transition"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {inv.invoiceNumber}
                </div>
                <div className="text-xs text-[var(--kf-text-muted)]">
                  {inv.client?.name} · due {formatDate(inv.dueDate)}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-sm font-semibold">
                  {formatMoney(Number(inv.amount))}
                </span>
                <StatusBadge status={inv.status} type="invoice" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
