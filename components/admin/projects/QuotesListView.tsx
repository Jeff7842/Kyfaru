'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { Plus, FileDown, Printer, Eye, Pencil, Trash2 } from 'lucide-react'
import { cn, formatDate } from '@/lib/admin/utils'
import { formatQuoteMoney } from '@/lib/admin/constants/currencies'
import HeroSection from '@/components/admin/layout/HeroSection'
import DataTable, { type Column } from '@/components/admin/shared/DataTable'
import PreviewQuoteModal from '@/components/admin/projects/PreviewQuoteModal'
import DeleteQuoteModal from '@/components/admin/projects/DeleteQuoteModal'
import { kfToast } from '@/lib/admin/toast'
import type { Quote, Project, Client } from '@/lib/admin/db/schema'

type QuoteRow = Quote & { amount: number }
type ProjectWithClient = Project & { client: Client | null }

const STATUS_COLOR: Record<string, string> = {
  draft: 'bg-zinc-100 text-zinc-700',
  sent: 'bg-blue-50 text-blue-700',
  accepted: 'bg-emerald-50 text-emerald-700',
  declined: 'bg-red-50 text-red-700',
  expired: 'bg-amber-50 text-amber-700',
}

interface Props {
  projectId: string
  project: ProjectWithClient
}

export default function QuotesListView({ projectId, project }: Props) {
  const router = useRouter()
  const qc = useQueryClient()
  const QUERY_KEY = `project-${projectId}-quotes`
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<QuoteRow | null>(null)
  const [creating, setCreating] = useState(false)

  const refresh = () => qc.invalidateQueries({ queryKey: [QUERY_KEY] })

  async function handleCreate() {
    setCreating(true)
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/quotes`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        kfToast.error(data.error ?? 'Could not create quote')
        return
      }
      router.push(`/admin/projects/${projectId}/quote/${data.quote.id}`)
    } finally {
      setCreating(false)
    }
  }

  async function downloadPdf(q: QuoteRow) {
    const res = await fetch(`/api/admin/projects/${projectId}/quotes/${q.id}/pdf`)
    if (!res.ok) return kfToast.error('Download failed')
    const blob = await res.blob()
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${project.name} Quote ${q.quoteNumber}.pdf`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  function printPdf(q: QuoteRow) {
    window.open(`/api/admin/projects/${projectId}/quotes/${q.id}/pdf?preview=1`, '_blank')
  }

  function previewPdf(q: QuoteRow) {
    setPreviewUrl(`/api/admin/projects/${projectId}/quotes/${q.id}/pdf?preview=1`)
  }

  async function handleDelete(reason: string) {
    if (!deleting) return
    const res = await fetch(`/api/admin/projects/${projectId}/quotes/${deleting.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      kfToast.error(data.error ?? 'Delete failed')
      return
    }
    kfToast.success('Quote deleted')
    setDeleting(null)
    refresh()
  }

  const columns: Column<QuoteRow>[] = [
    { key: 'quoteNumber', header: 'Number', render: (q) => <span className="font-mono text-xs text-[var(--kf-text)]">{q.quoteNumber}</span> },
    { key: 'title', header: 'Name', render: (q) => <span className="text-[var(--kf-text)]">{q.title || q.quoteNumber}</span> },
    {
      key: 'status',
      header: 'Status',
      render: (q) => (
        <span className={cn('inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize', STATUS_COLOR[q.status] ?? STATUS_COLOR.draft)}>
          {q.status}
        </span>
      ),
    },
    { key: 'quoteDate', header: 'Date', render: (q) => <span className="text-[var(--kf-text-muted)]">{formatDate(q.quoteDate)}</span> },
    { key: 'amount', header: 'Amount', render: (q) => <span className="font-medium text-[var(--kf-text)]">{formatQuoteMoney(q.amount, q.currency)}</span> },
  ]

  return (
    <div className="space-y-6 kf-anim-in">
      <HeroSection title="Quotations" subtitle={project.name} />

      <DataTable<QuoteRow>
        queryKey={QUERY_KEY}
        endpoint={`/api/admin/projects/${projectId}/quotes`}
        rowsKey="quotes"
        getRowId={(q) => q.id}
        columns={columns}
        searchPlaceholder="Search quotes…"
        emptyLabel="No quotations yet."
        onRowClick={(q) => router.push(`/admin/projects/${projectId}/quote/${q.id}`)}
        toolbar={
          <button onClick={handleCreate} disabled={creating} className="kf-btn-primary flex items-center gap-1.5 whitespace-nowrap disabled:opacity-60">
            <Plus className="w-4 h-4" /> Create quote
          </button>
        }
        actions={(q) => (
          <>
            <button onClick={() => previewPdf(q)} aria-label="Preview" title="Preview" className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 transition">
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => printPdf(q)} aria-label="Print" title="Print" className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 transition">
              <Printer className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => downloadPdf(q)} aria-label="Download PDF" title="Download PDF" className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 transition">
              <FileDown className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => router.push(`/admin/projects/${projectId}/quote/${q.id}`)}
              aria-label="Edit"
              title="Edit"
              className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 transition"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setDeleting(q)} aria-label="Delete" title="Delete" className="p-1.5 rounded-md text-zinc-500 hover:bg-red-50 hover:text-red-600 transition">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      />

      <PreviewQuoteModal open={!!previewUrl} pdfUrl={previewUrl} onClose={() => setPreviewUrl(null)} />
      <DeleteQuoteModal
        open={!!deleting}
        quoteNumber={deleting?.quoteNumber ?? ''}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
