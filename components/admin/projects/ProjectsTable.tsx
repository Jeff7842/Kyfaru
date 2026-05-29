'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Pencil, Trash2, Plus, FileText, FileSignature } from 'lucide-react'
import { formatDate } from '@/lib/admin/utils'
import StatusBadge from '@/components/admin/shared/StatusBadge'
import DataTable, { type Column } from '@/components/admin/shared/DataTable'
import ProjectFormDrawer from '@/components/admin/projects/ProjectFormDrawer'
import { useConfirm } from '@/hooks/useConfirm'
import { kfToast } from '@/lib/admin/toast'
import type { Project, Client } from '@/lib/admin/db/schema'

type Row = Project & { client: Client | null }
const QUERY_KEY = 'admin-projects'

export default function ProjectsTable() {
  const qc = useQueryClient()
  const confirm = useConfirm()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)

  const refresh = () => qc.invalidateQueries({ queryKey: [QUERY_KEY] })

  async function handleDelete(p: Row) {
    const ok = await confirm({
      title: `Cancel ${p.name}?`,
      description: 'The project will be marked cancelled. This can affect linked invoices.',
      variant: 'danger',
      confirmLabel: 'Cancel project',
    })
    if (!ok) return
    const res = await fetch(`/api/admin/projects/${p.id}`, { method: 'DELETE' })
    if (!res.ok) return kfToast.error('Delete failed')
    kfToast.success('Project cancelled')
    refresh()
  }

  const columns: Column<Row>[] = [
    { key: 'name', header: 'Name', render: (p) => <span className="font-medium text-[var(--kf-text)]">{p.name}</span> },
    { key: 'client', header: 'Client', render: (p) => <span className="text-[var(--kf-text-muted)]">{p.client?.name ?? '—'}</span> },
    { key: 'status', header: 'Status', render: (p) => <StatusBadge status={p.status} type="project" /> },
    { key: 'deadline', header: 'Deadline', render: (p) => <span className="text-[var(--kf-text-muted)]">{p.expectedEndDate ? formatDate(p.expectedEndDate) : '—'}</span> },
    {
      key: 'budget',
      header: 'Budget',
      render: (p) =>
        p.quotedAmount
          ? new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(Number(p.quotedAmount))
          : '—',
    },
  ]

  return (
    <>
      <DataTable<Row>
        queryKey={QUERY_KEY}
        endpoint="/api/admin/projects"
        rowsKey="projects"
        getRowId={(p) => p.id}
        columns={columns}
        searchPlaceholder="Search projects…"
        onRowClick={(p) => (window.location.href = `/admin/projects/${p.id}`)}
        emptyLabel="No projects found."
        toolbar={
          <button onClick={() => { setEditing(null); setDrawerOpen(true) }} className="kf-btn-primary flex items-center gap-1.5 whitespace-nowrap">
            <Plus className="w-4 h-4" /> New Project
          </button>
        }
        actions={(p) => (
          <>
            <a href={`/api/admin/projects/${p.id}/scope-pdf`} aria-label="Download Scope of Work" title="Scope of Work (Word)" className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 transition">
              <FileText className="w-3.5 h-3.5" />
            </a>
            <a href={`/api/admin/projects/${p.id}/agreement-pdf`} aria-label="Download Agreement" title="Agreement (Word)" className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 transition">
              <FileSignature className="w-3.5 h-3.5" />
            </a>
            <button onClick={() => { setEditing(p); setDrawerOpen(true) }} aria-label="Edit" className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 transition">
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => handleDelete(p)} aria-label="Delete" className="p-1.5 rounded-md text-zinc-500 hover:bg-red-50 hover:text-red-600 transition">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      />
      <ProjectFormDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} project={editing} onSaved={refresh} />
    </>
  )
}
