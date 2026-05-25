'use client'

import { useState } from 'react'
import { Search, Mail, MessageSquare, Smartphone } from 'lucide-react'
import { cn } from '@/lib/admin/utils'
import type { CommunicationLog } from '@/lib/admin/db/schema'

const CHANNEL_ICON = {
  email: Mail,
  whatsapp: MessageSquare,
  sms: Smartphone,
}

const STATUS_COLOR: Record<string, string> = {
  sent: 'bg-blue-100 text-blue-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  failed: 'bg-red-100 text-red-700',
  stub_sent: 'bg-zinc-100 text-zinc-500',
  received: 'bg-purple-100 text-purple-700',
}

export default function CommsLog({ initialData }: { initialData: CommunicationLog[] }) {
  const [query, setQuery] = useState('')
  const [channel, setChannel] = useState<string>('all')

  const filtered = initialData.filter((log) => {
    const matchesQuery =
      log.toAddress.toLowerCase().includes(query.toLowerCase()) ||
      (log.subject ?? '').toLowerCase().includes(query.toLowerCase()) ||
      log.body.toLowerCase().includes(query.toLowerCase())
    const matchesChannel = channel === 'all' || log.channel === channel
    return matchesQuery && matchesChannel
  })

  return (
    <div className="kf-card rounded-2xl space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by recipient, subject, body…"
            className="kf-input w-full pl-9"
          />
        </div>
        <select
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
          className="kf-input w-full sm:w-36"
        >
          <option value="all">All channels</option>
          <option value="email">Email</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="sms">SMS</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-[var(--kf-text-muted)] py-8 text-center">
          No communications found.
        </p>
      ) : (
        <div className="divide-y divide-[var(--kf-border)]">
          {filtered.map((log) => {
            const Icon = CHANNEL_ICON[log.channel] ?? Mail
            return (
              <div key={log.id} className="py-3 flex gap-3 items-start">
                <div className="p-2 rounded-lg bg-zinc-100 shrink-0">
                  <Icon className="w-4 h-4 text-zinc-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-[var(--kf-text)] truncate">
                      {log.toAddress}
                    </span>
                    {log.subject && (
                      <span className="text-xs text-[var(--kf-text-muted)] truncate">
                        — {log.subject}
                      </span>
                    )}
                    <span
                      className={cn(
                        'ml-auto shrink-0 px-2 py-0.5 rounded-full text-[11px] font-medium capitalize',
                        STATUS_COLOR[log.status] ?? 'bg-zinc-100 text-zinc-600',
                      )}
                    >
                      {log.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--kf-text-muted)] mt-0.5 line-clamp-1">
                    {log.body}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    {new Date(log.createdAt).toLocaleString('en-KE')}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
