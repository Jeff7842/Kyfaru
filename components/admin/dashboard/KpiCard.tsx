'use client'

import {
  FolderKanban,
  Users,
  Wallet,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle2,
} from 'lucide-react'
import { cn, formatMoney } from '@/lib/admin/utils'

const ICONS = {
  FolderKanban,
  Users,
  Wallet,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle2,
} as const

type IconKey = keyof typeof ICONS
type Color = 'green' | 'blue' | 'yellow' | 'red' | 'zinc'

const COLOR_MAP: Record<Color, { bg: string; text: string; icon: string }> = {
  green: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    icon: 'text-emerald-600',
  },
  blue: { bg: 'bg-blue-50', text: 'text-blue-700', icon: 'text-blue-600' },
  yellow: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    icon: 'text-yellow-600',
  },
  red: { bg: 'bg-red-50', text: 'text-red-700', icon: 'text-red-600' },
  zinc: { bg: 'bg-zinc-100', text: 'text-zinc-700', icon: 'text-zinc-500' },
}

export default function KpiCard({
  title,
  value,
  icon,
  color = 'green',
  format,
  trend,
}: {
  title: string
  value: number
  icon: IconKey
  color?: Color
  format?: 'money' | 'number'
  trend?: { value: number; label?: string }
}) {
  const Icon = ICONS[icon]
  const c = COLOR_MAP[color]
  const display =
    format === 'money'
      ? formatMoney(value)
      : new Intl.NumberFormat('en-KE').format(value)

  return (
    <div className="kf-card flex items-start gap-4 rounded-2xl">
      <div className={cn('p-3 rounded-xl shrink-0', c.bg)}>
        <Icon className={cn('w-5 h-5', c.icon)} />
      </div>
      <div className="min-w-0">
        <div className="text-xs font-medium text-[var(--kf-text-muted)] uppercase tracking-wide">
          {title}
        </div>
        <div
          className="mt-1 text-2xl font-bold tracking-tight text-[var(--kf-text)] truncate"
          style={{ fontFamily: 'var(--kf-font-display)' }}
        >
          {display}
        </div>
        {trend && (
          <div
            className={cn(
              'mt-1 text-[11px] font-medium',
              trend.value >= 0 ? 'text-emerald-600' : 'text-red-500',
            )}
          >
            {trend.value >= 0 ? '+' : ''}
            {trend.value}% {trend.label}
          </div>
        )}
      </div>
    </div>
  )
}
