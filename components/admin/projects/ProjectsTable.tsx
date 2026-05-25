'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Plus } from 'lucide-react'
import { formatDate } from '@/lib/admin/utils'
import StatusBadge from '@/components/admin/shared/StatusBadge'
import type { Project, Client } from '@/lib/admin/db/schema'

type Row = Project & { client: Client | null }

export default function ProjectsTable({ initialData }: { initialData: Row[] }) {
  const [query, setQuery] = useState('')

  const filtered = initialData.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      (p.client?.name ?? '').toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="kf-card rounded-2xl">
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects…"
            className="kf-input w-full pl-9"
          />
        </div>
        <Link
          href="/admin/projects/new"
          className="kf-btn-primary flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> New Project
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--kf-border)] text-xs text-[var(--kf-text-muted)] uppercase tracking-wide">
              <th className="py-2 text-left font-medium">Name</th>
              <th className="py-2 text-left font-medium">Client</th>
              <th className="py-2 text-left font-medium">Status</th>
              <th className="py-2 text-left font-medium">Deadline</th>
              <th className="py-2 text-left font-medium">Budget</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--kf-border)]">
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="py-8 text-center text-[var(--kf-text-muted)] text-sm"
                >
                  No projects found.
                </td>
              </tr>
            )}
            {filtered.map((p) => (
              <tr
                key={p.id}
                className="hover:bg-zinc-50 cursor-pointer transition"
                onClick={() => (window.location.href = `/admin/projects/${p.id}`)}
              >
                <td className="py-3 pr-4 font-medium text-[var(--kf-text)]">
                  {p.name}
                </td>
                <td className="py-3 pr-4 text-[var(--kf-text-muted)]">
                  {p.client?.name ?? '—'}
                </td>
                <td className="py-3 pr-4">
                  <StatusBadge status={p.status} type="project" />
                </td>
                <td className="py-3 pr-4 text-[var(--kf-text-muted)]">
                  {p.expectedEndDate ? formatDate(p.expectedEndDate) : '—'}
                </td>
                <td className="py-3 text-[var(--kf-text-muted)]">
                  {p.quotedAmount
                    ? new Intl.NumberFormat('en-KE', {
                        style: 'currency',
                        currency: 'KES',
                        maximumFractionDigits: 0,
                      }).format(Number(p.quotedAmount))
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
