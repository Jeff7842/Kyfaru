'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { formatMoney, formatDate } from '@/lib/admin/utils'
import DataTable, { type Column } from '@/components/admin/shared/DataTable'
import ExpenseFormDrawer from '@/components/admin/finance/ExpenseFormDrawer'
import { useConfirm } from '@/hooks/useConfirm'
import { kfToast } from '@/lib/admin/toast'
import type { Expense } from '@/lib/admin/db/schema'

const QUERY_KEY = 'admin-expenses'

export default function ExpensesTable() {
  const qc = useQueryClient()
  const confirm = useConfirm()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState<Expense | null>(null)

  const refresh = () => qc.invalidateQueries({ queryKey: [QUERY_KEY] })

  async function handleDelete(e: Expense) {
    const ok = await confirm({
      title: 'Delete expense?',
      description: `${e.category} — ${e.description}`,
      variant: 'danger',
      confirmLabel: 'Delete',
    })
    if (!ok) return
    const res = await fetch(`/api/admin/expenses/${e.id}`, { method: 'DELETE' })
    if (!res.ok) return kfToast.error('Delete failed')
    kfToast.success('Expense deleted')
    refresh()
  }

  const columns: Column<Expense>[] = [
    { key: 'category', header: 'Category', render: (e) => <span className="font-medium text-[var(--kf-text)]">{e.category}</span> },
    { key: 'description', header: 'Description', render: (e) => <span className="text-[var(--kf-text-muted)]">{e.description}</span> },
    { key: 'amount', header: 'Amount', render: (e) => <span className="font-semibold">{formatMoney(Number(e.amount))}</span> },
    { key: 'paidAt', header: 'Paid', render: (e) => <span className="text-[var(--kf-text-muted)]">{e.paidAt ? formatDate(e.paidAt) : '—'}</span> },
  ]

  return (
    <>
      <DataTable<Expense>
        queryKey={QUERY_KEY}
        endpoint="/api/admin/expenses"
        rowsKey="expenses"
        getRowId={(e) => e.id}
        columns={columns}
        searchPlaceholder="Search expenses…"
        emptyLabel="No expenses recorded."
        toolbar={
          <button onClick={() => { setEditing(null); setDrawerOpen(true) }} className="kf-btn-primary flex items-center gap-1.5 whitespace-nowrap">
            <Plus className="w-4 h-4" /> New Expense
          </button>
        }
        actions={(e) => (
          <>
            <button onClick={() => { setEditing(e); setDrawerOpen(true) }} aria-label="Edit" className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 transition">
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => handleDelete(e)} aria-label="Delete" className="p-1.5 rounded-md text-zinc-500 hover:bg-red-50 hover:text-red-600 transition">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      />
      <ExpenseFormDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} expense={editing} onSaved={refresh} />
    </>
  )
}
