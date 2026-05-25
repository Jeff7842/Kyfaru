'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import type { AuditLog, User } from '@/lib/admin/db/schema'

type Row = AuditLog & { user: User | null }

export default function AuditTable({ initialData }: { initialData: Row[] }) {
  const [query, setQuery] = useState('')

  const filtered = initialData.filter(
    (log) =>
      log.action.toLowerCase().includes(query.toLowerCase()) ||
      (log.entityType ?? '').toLowerCase().includes(query.toLowerCase()) ||
      (log.user?.name ?? '').toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="kf-card rounded-2xl">
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by action, entity, user…"
            className="kf-input w-full pl-9"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--kf-border)] text-xs text-[var(--kf-text-muted)] uppercase tracking-wide">
              <th className="py-2 text-left font-medium">Action</th>
              <th className="py-2 text-left font-medium">Entity</th>
              <th className="py-2 text-left font-medium">User</th>
              <th className="py-2 text-left font-medium">IP</th>
              <th className="py-2 text-left font-medium">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--kf-border)]">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-[var(--kf-text-muted)]">
                  No audit entries found.
                </td>
              </tr>
            )}
            {filtered.map((log) => (
              <tr key={log.id} className="hover:bg-zinc-50 transition">
                <td className="py-3 pr-4 font-medium text-[var(--kf-text)] capitalize">
                  {log.action.replace(/_/g, ' ')}
                </td>
                <td className="py-3 pr-4 text-[var(--kf-text-muted)]">
                  {log.entityType ?? '—'}
                </td>
                <td className="py-3 pr-4 text-[var(--kf-text-muted)]">
                  {log.user?.name ?? 'System'}
                </td>
                <td className="py-3 pr-4 text-[var(--kf-text-muted)] font-mono text-xs">
                  {log.ipAddress ?? '—'}
                </td>
                <td className="py-3 text-[var(--kf-text-muted)] whitespace-nowrap text-xs">
                  {new Date(log.createdAt).toLocaleString('en-KE')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
