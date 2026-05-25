'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { formatMoney, formatDate } from '@/lib/admin/utils'
import StatusBadge from '@/components/admin/shared/StatusBadge'
import type { Invoice, Client } from '@/lib/admin/db/schema'

type Row = Invoice & { client: Client | null }

export default function InvoicesTable({ initialData }: { initialData: Row[] }) {
  const [query, setQuery] = useState('')

  const filtered = initialData.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(query.toLowerCase()) ||
      (inv.client?.name ?? '').toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="kf-card rounded-2xl">
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search invoices…"
            className="kf-input w-full pl-9"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--kf-border)] text-xs text-[var(--kf-text-muted)] uppercase tracking-wide">
              <th className="py-2 text-left font-medium">Invoice #</th>
              <th className="py-2 text-left font-medium">Client</th>
              <th className="py-2 text-left font-medium">Amount</th>
              <th className="py-2 text-left font-medium">Due</th>
              <th className="py-2 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--kf-border)]">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-[var(--kf-text-muted)]">
                  No invoices found.
                </td>
              </tr>
            )}
            {filtered.map((inv) => (
              <tr
                key={inv.id}
                className="hover:bg-zinc-50 cursor-pointer transition"
                onClick={() => (window.location.href = `/admin/finance/invoices/${inv.id}`)}
              >
                <td className="py-3 pr-4 font-medium text-[var(--kf-text)]">
                  {inv.invoiceNumber}
                </td>
                <td className="py-3 pr-4 text-[var(--kf-text-muted)]">
                  {inv.client?.name ?? '—'}
                </td>
                <td className="py-3 pr-4 font-semibold">
                  {formatMoney(Number(inv.amount))}
                </td>
                <td className="py-3 pr-4 text-[var(--kf-text-muted)]">
                  {formatDate(inv.dueDate)}
                </td>
                <td className="py-3">
                  <StatusBadge status={inv.status} type="invoice" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
