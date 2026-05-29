'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useQueryClient } from '@tanstack/react-query'
import { Building2, Pencil, Trash2, Plus } from 'lucide-react'
import { cn } from '@/lib/admin/utils'
import DataTable, { type Column } from '@/components/admin/shared/DataTable'
import ClientFormDrawer from '@/components/admin/clients/ClientFormDrawer'
import { useConfirm } from '@/hooks/useConfirm'
import { kfToast } from '@/lib/admin/toast'
import type { Client } from '@/lib/admin/db/schema'

const QUERY_KEY = 'admin-clients'

export default function ClientsTable() {
  const qc = useQueryClient()
  const confirm = useConfirm()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState<Client | null>(null)

  function refresh() {
    qc.invalidateQueries({ queryKey: [QUERY_KEY] })
  }

  function openNew() {
    setEditing(null)
    setDrawerOpen(true)
  }

  function openEdit(c: Client) {
    setEditing(c)
    setDrawerOpen(true)
  }

  async function handleDelete(c: Client) {
    const ok = await confirm({
      title: `Delete ${c.name}?`,
      description: 'The client will be marked inactive. Linked projects and invoices are preserved.',
      variant: 'danger',
      confirmLabel: 'Delete',
    })
    if (!ok) return
    const res = await fetch(`/api/admin/clients/${c.id}`, { method: 'DELETE' })
    if (!res.ok) {
      kfToast.error('Delete failed')
      return
    }
    kfToast.success('Client deleted')
    refresh()
  }

  const columns: Column<Client>[] = [
    {
      key: 'name',
      header: 'Client',
      render: (c) => (
        <div className="flex items-center gap-3">
          {c.logoUrl ? (
            <Image src={c.logoUrl} alt={c.name} width={32} height={32} className="rounded-md object-contain bg-zinc-100" />
          ) : (
            <div className="w-8 h-8 rounded-md bg-[var(--kf-green)]/10 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-[var(--kf-green)]" />
            </div>
          )}
          <div>
            <div className="font-medium text-[var(--kf-text)]">{c.name}</div>
            {c.contactPerson && <div className="text-xs text-[var(--kf-text-muted)]">{c.contactPerson}</div>}
          </div>
        </div>
      ),
    },
    { key: 'email', header: 'Email', render: (c) => <span className="text-[var(--kf-text-muted)]">{c.email}</span> },
    { key: 'industry', header: 'Industry', render: (c) => <span className="text-[var(--kf-text-muted)]">{c.industry ?? '—'}</span> },
    {
      key: 'status',
      header: 'Status',
      render: (c) => (
        <span
          className={cn(
            'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium',
            c.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-500',
          )}
        >
          {c.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ]

  return (
    <>
      <DataTable<Client>
        queryKey={QUERY_KEY}
        endpoint="/api/admin/clients"
        rowsKey="clients"
        getRowId={(c) => c.id}
        columns={columns}
        searchPlaceholder="Search clients…"
        onRowClick={(c) => (window.location.href = `/admin/clients/${c.id}`)}
        toolbar={
          <button onClick={openNew} className="kf-btn-primary flex items-center gap-1.5 whitespace-nowrap">
            <Plus className="w-4 h-4" /> New Client
          </button>
        }
        actions={(c) => (
          <>
            <button onClick={() => openEdit(c)} aria-label="Edit" className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 transition">
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => handleDelete(c)} aria-label="Delete" className="p-1.5 rounded-md text-zinc-500 hover:bg-red-50 hover:text-red-600 transition">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      />
      <ClientFormDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} client={editing} onSaved={refresh} />
    </>
  )
}
