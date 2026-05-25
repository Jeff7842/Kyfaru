import { cn } from '@/lib/admin/utils'

const PROJECT_COLORS: Record<string, string> = {
  planning: 'bg-zinc-100 text-zinc-600',
  in_progress: 'bg-blue-100 text-blue-700',
  review: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-emerald-100 text-emerald-700',
  paused: 'bg-orange-100 text-orange-700',
  cancelled: 'bg-red-100 text-red-700',
}

const INVOICE_COLORS: Record<string, string> = {
  draft: 'bg-zinc-100 text-zinc-600',
  sent: 'bg-blue-100 text-blue-700',
  paid: 'bg-emerald-100 text-emerald-700',
  overdue: 'bg-red-100 text-red-700',
  cancelled: 'bg-zinc-200 text-zinc-500 line-through',
}

const LABELS: Record<string, string> = {
  in_progress: 'In Progress',
  planning: 'Planning',
  review: 'Review',
  completed: 'Completed',
  paused: 'Paused',
  cancelled: 'Cancelled',
  draft: 'Draft',
  sent: 'Sent',
  paid: 'Paid',
  overdue: 'Overdue',
}

export default function StatusBadge({
  status,
  type = 'project',
}: {
  status: string
  type?: 'project' | 'invoice'
}) {
  const map = type === 'invoice' ? INVOICE_COLORS : PROJECT_COLORS
  const cls = map[status] ?? 'bg-zinc-100 text-zinc-600'
  return (
    <span
      className={cn(
        'shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium capitalize whitespace-nowrap',
        cls,
      )}
    >
      {LABELS[status] ?? status}
    </span>
  )
}
