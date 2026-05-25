'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  className?: string
}

export default function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  className,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : page * pageSize + 1
  const to = Math.min((page + 1) * pageSize, total)

  const pages = buildPageRange(page, totalPages)

  if (total <= pageSize) return null

  return (
    <div className={cn('flex items-center justify-between px-1 py-3', className)}>
      <p className="text-xs text-zinc-500">
        {from}–{to} of {total}
      </p>

      <div className="flex items-center gap-1">
        <NavBtn
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </NavBtn>

        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`dot-${i}`} className="px-1 text-xs text-zinc-400">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={cn(
                'w-7 h-7 rounded text-xs font-medium transition',
                p === page
                  ? 'bg-(--kf-green) text-white'
                  : 'text-zinc-600 hover:bg-zinc-100',
              )}
            >
              {(p as number) + 1}
            </button>
          ),
        )}

        <NavBtn
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
          aria-label="Next page"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </NavBtn>
      </div>
    </div>
  )
}

function NavBtn({
  children,
  disabled,
  onClick,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { disabled: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-7 h-7 rounded flex items-center justify-center text-zinc-500 hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
      {...rest}
    >
      {children}
    </button>
  )
}

function buildPageRange(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i)
  const pages: (number | '…')[] = []
  pages.push(0)
  if (current > 2) pages.push('…')
  for (let i = Math.max(1, current - 1); i <= Math.min(total - 2, current + 1); i++) {
    pages.push(i)
  }
  if (current < total - 3) pages.push('…')
  pages.push(total - 1)
  return pages
}
