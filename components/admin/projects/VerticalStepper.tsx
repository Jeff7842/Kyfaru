'use client'

import { Plus, Pencil, Trash2, CreditCard, FileText, CheckCircle, Circle, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ActivityGroup } from '@/app/api/admin/projects/[id]/activity/route'

export type { ActivityGroup } from '@/app/api/admin/projects/[id]/activity/route'

const ICONS: Record<string, LucideIcon> = {
  plus: Plus,
  pencil: Pencil,
  'trash-2': Trash2,
  'credit-card': CreditCard,
  'file-text': FileText,
  'check-circle': CheckCircle,
  circle: Circle,
}

/** Vertical timeline: icon-in-circle connected by a line, grouped under a day label. */
export default function VerticalStepper({ groups }: { groups: ActivityGroup[] }) {
  if (groups.length === 0) {
    return <p className="text-sm text-[var(--kf-text-muted)]">No activity yet.</p>
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.label}>
          <h4 className="text-xs font-medium uppercase tracking-wide text-[var(--kf-text-muted)] mb-3">
            {group.label}
          </h4>
          <ul>
            {group.entries.map((entry, i) => {
              const Icon = ICONS[entry.icon] ?? Circle
              const isLast = i === group.entries.length - 1
              return (
                <li key={entry.id} className="flex gap-x-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-[var(--kf-green-light)] text-[var(--kf-green)] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    {!isLast && <div className="w-px flex-1 bg-zinc-200" />}
                  </div>
                  <div className={cn('flex-1 pb-6', isLast && 'pb-0')}>
                    <p className="text-sm text-[var(--kf-text)]">{entry.title}</p>
                    <p className="text-xs text-[var(--kf-text-muted)] mt-0.5">{entry.time}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}
