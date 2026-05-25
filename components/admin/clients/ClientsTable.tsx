'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Search, Building2 } from 'lucide-react'
import { cn } from '@/lib/admin/utils'
import type { Client } from '@/lib/admin/db/schema'

export default function ClientsTable({ initialData }: { initialData: Client[] }) {
  const [query, setQuery] = useState('')

  const filtered = initialData.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.email.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="kf-card rounded-2xl">
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clients…"
            className="kf-input w-full pl-9"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--kf-border)] text-xs text-[var(--kf-text-muted)] uppercase tracking-wide">
              <th className="py-2 text-left font-medium">Client</th>
              <th className="py-2 text-left font-medium">Email</th>
              <th className="py-2 text-left font-medium">Industry</th>
              <th className="py-2 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--kf-border)]">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-[var(--kf-text-muted)] text-sm">
                  No clients found.
                </td>
              </tr>
            )}
            {filtered.map((c) => (
              <tr
                key={c.id}
                className="hover:bg-zinc-50 cursor-pointer transition"
                onClick={() => (window.location.href = `/admin/clients/${c.id}`)}
              >
                <td className="py-3 pr-4">
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
                      {c.contactPerson && (
                        <div className="text-xs text-[var(--kf-text-muted)]">{c.contactPerson}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3 pr-4 text-[var(--kf-text-muted)]">{c.email}</td>
                <td className="py-3 pr-4 text-[var(--kf-text-muted)]">{c.industry ?? '—'}</td>
                <td className="py-3">
                  <span
                    className={cn(
                      'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium',
                      c.isActive
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-zinc-100 text-zinc-500',
                    )}
                  >
                    {c.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
