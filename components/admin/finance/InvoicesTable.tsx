'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Pencil, Trash2, Plus, FileDown } from 'lucide-react'
import { formatMoney, formatDate } from '@/lib/admin/utils'
import StatusBadge from '@/components/admin/shared/StatusBadge'
import DataTable, { type Column } from '@/components/admin/shared/DataTable'
import InvoiceFormDrawer from '@/components/admin/finance/InvoiceFormDrawer'
import { useConfirm } from '@/hooks/useConfirm'
import { kfToast } from '@/lib/admin/toast'
import type { Invoice, Client } from '@/lib/admin/db/schema'

type Row = Invoice & { client: Client | null }
const QUERY_KEY = 'admin-invoices'

export default function InvoicesTable() {
  const qc = useQueryClient()
  const confirm = useConfirm()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState<Invoice | null>(null)

  const refresh = () => qc.invalidateQueries({ queryKey: [QUERY_KEY] })

  async function handleDelete(inv: Row) {
    const ok = await confirm({
      title: `Cancel ${inv.invoiceNumber}?`,
      description: 'The invoice will be marked cancelled.',
      variant: 'danger',
      confirmLabel: 'Cancel invoice',
    })
    if (!ok) return
    const res = await fetch(`/api/admin/invoices/${inv.id}`, { method: 'DELETE' })
    if (!res.ok) return kfToast.error('Delete failed')
    kfToast.success('Invoice cancelled')
    refresh()
  }

  const columns: Column<Row>[] = [
    { key: 'invoiceNumber', header: 'Invoice #', render: (i) => <span className="font-medium text-[var(--kf-text)]">{i.invoiceNumber}</span> },
    { key: 'client', header: 'Client', render: (i) => <span className="text-[var(--kf-text-muted)]">{i.client?.name ?? '—'}</span> },
    { key: 'amount', header: 'Amount', render: (i) => <span className="font-semibold">{formatMoney(Number(i.amount))}</span> },
    { key: 'due', header: 'Due', render: (i) => <span className="text-[var(--kf-text-muted)]">{formatDate(i.dueDate)}</span> },
    { key: 'status', header: 'Status', render: (i) => <StatusBadge status={i.status} type="invoice" /> },
  ]

  return (
    <>
      <DataTable<Row>
        queryKey={QUERY_KEY}
        endpoint="/api/admin/invoices"
        rowsKey="invoices"
        getRowId={(i) => i.id}
        columns={columns}
        searchPlaceholder="Search invoices…"
        emptyLabel="No invoices found."
        toolbar={
          <button onClick={() => { setEditing(null); setDrawerOpen(true) }} className="kf-btn-primary flex items-center gap-1.5 whitespace-nowrap">
            <Plus className="w-4 h-4" /> New Invoice
          </button>
        }
        actions={(inv) => (
          <>
            <a href={`/api/admin/invoices/${inv.id}/pdf`} target="_blank" rel="noreferrer" aria-label="Download PDF" className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 transition">
              <FileDown className="w-3.5 h-3.5" />
            </a>
            <button onClick={() => { setEditing(inv); setDrawerOpen(true) }} aria-label="Edit" className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 transition">
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => handleDelete(inv)} aria-label="Delete" className="p-1.5 rounded-md text-zinc-500 hover:bg-red-50 hover:text-red-600 transition">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      />
      <InvoiceFormDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} invoice={editing} onSaved={refresh} />
    </>
  )
}
