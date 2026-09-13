'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Pencil, Trash2, Plus, FileText, FileSignature, AlertTriangle } from 'lucide-react'
import { cn, formatDate } from '@/lib/admin/utils'
import StatusBadge from '@/components/admin/shared/StatusBadge'
import DataTable, { type Column } from '@/components/admin/shared/DataTable'
import ProjectFormDrawer from '@/components/admin/projects/ProjectFormDrawer'
import { useConfirm } from '@/hooks/useConfirm'
import { kfToast } from '@/lib/admin/toast'
import { isRequirementsComplete, type ProjectRequirementsDoc } from '@/lib/admin/types/project-requirements'
import type { Project, Client } from '@/lib/admin/db/schema'

type Row = Project & { client: Client | null }
const QUERY_KEY = 'admin-projects'

async function downloadDoc(kind: 'scope-pdf' | 'agreement-pdf', p: Row, label: string) {
  const res = await fetch(`/api/admin/projects/${p.id}/${kind}`)
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    kfToast.error(data.error ?? 'Download failed')
    return
  }
  const blob = await res.blob()
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${p.name} ${label}.docx`
  a.click()
  URL.revokeObjectURL(a.href)
}

export default function ProjectsTable() {
  const qc = useQueryClient()
  const confirm = useConfirm()
  const [drawerOpen, setDrawerOpen] = useState(false)

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
          <button onClick={() => setDrawerOpen(true)} className="kf-btn-primary flex items-center gap-1.5 whitespace-nowrap">
            <Plus className="w-4 h-4" /> New Project
          </button>
        }
        actions={(p) => {
          const complete = isRequirementsComplete(p.scopeDocument as ProjectRequirementsDoc | null)
          return (
            <>
              <button
                onClick={() => complete && downloadDoc('scope-pdf', p, 'Scope of Work')}
                disabled={!complete}
                aria-label="Download Scope of Work"
                title={complete ? 'Scope of Work (Word)' : 'Complete the project details first'}
                className={cn('p-1.5 rounded-md transition', complete ? 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800' : 'text-zinc-300 cursor-not-allowed')}
              >
                <FileText className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => complete && downloadDoc('agreement-pdf', p, 'Agreement')}
                disabled={!complete}
                aria-label="Download Agreement"
                title={complete ? 'Agreement (Word)' : 'Complete the project details first'}
                className={cn('p-1.5 rounded-md transition', complete ? 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800' : 'text-zinc-300 cursor-not-allowed')}
              >
                <FileSignature className="w-3.5 h-3.5" />
              </button>
              {!complete && (
                <span title="Complete the project details first" className="inline-flex p-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />
                </span>
              )}
              <button onClick={() => (window.location.href = `/admin/projects/${p.id}`)} aria-label="Edit" className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 transition">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => handleDelete(p)} aria-label="Delete" className="p-1.5 rounded-md text-zinc-500 hover:bg-red-50 hover:text-red-600 transition">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )
        }}
      />
      <ProjectFormDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onSaved={refresh} />
    </>
  )
}
