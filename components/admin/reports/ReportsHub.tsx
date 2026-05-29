'use client'

import { useState, useTransition } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { kfToast as toast } from '@/lib/admin/toast'

const REPORTS = [
  {
    id: 'revenue',
    title: 'Revenue Report',
    description: 'Monthly revenue breakdown, paid invoices, and outstanding amounts.',
    icon: '💰',
  },
  {
    id: 'projects',
    title: 'Projects Summary',
    description: 'Status of all projects, completion rates, and timelines.',
    icon: '📁',
  },
  {
    id: 'clients',
    title: 'Client Overview',
    description: 'Active clients, project count per client, and value metrics.',
    icon: '🏢',
  },
  {
    id: 'comms',
    title: 'Communications Log',
    description: 'All outgoing and incoming email, SMS, and WhatsApp messages.',
    icon: '💬',
  },
  {
    id: 'audit',
    title: 'Audit Trail',
    description: 'Full chronological record of admin actions.',
    icon: '🔍',
  },
]

export default function ReportsHub() {
  const [generating, setGenerating] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  function generate(id: string) {
    setGenerating(id)
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/reports/${id}`, { method: 'POST' })
        if (!res.ok) throw new Error('Failed')
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `kyfaru-${id}-report-${new Date().toISOString().slice(0, 10)}.csv`
        a.click()
        URL.revokeObjectURL(url)
        toast.success('Report downloaded')
      } catch {
        toast.error('Failed to generate report')
      } finally {
        setGenerating(null)
      }
    })
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {REPORTS.map((r) => (
        <div
          key={r.id}
          className="kf-card rounded-2xl flex flex-col gap-4"
        >
          <div className="flex items-start gap-3">
            <div className="text-3xl">{r.icon}</div>
            <div>
              <div className="font-semibold text-[var(--kf-text)]">{r.title}</div>
              <p className="text-xs text-[var(--kf-text-muted)] mt-1">{r.description}</p>
            </div>
          </div>
          <button
            onClick={() => generate(r.id)}
            disabled={!!generating}
            className="mt-auto flex items-center justify-center gap-2 h-9 rounded-lg border border-[var(--kf-border)] text-sm font-medium text-[var(--kf-text)] hover:bg-zinc-50 transition disabled:opacity-60"
          >
            {generating === r.id ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Generate CSV
          </button>
        </div>
      ))}
    </div>
  )
}
