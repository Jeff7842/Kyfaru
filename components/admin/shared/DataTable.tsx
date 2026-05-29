'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Loader2 } from 'lucide-react'
import Pagination from '@/components/admin/shared/Pagination'
import { cn } from '@/lib/utils'

export interface Column<T> {
  key: string
  header: React.ReactNode
  render?: (row: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  /** Stable React Query key prefix. */
  queryKey: string
  /** Endpoint that accepts ?q=&page=&pageSize= and returns { [rowsKey]: T[], total }. */
  endpoint: string
  /** Key in the JSON response holding the row array (e.g. "clients"). */
  rowsKey: string
  columns: Column<T>[]
  getRowId: (row: T) => string
  pageSize?: number
  searchPlaceholder?: string
  /** Right-aligned per-row action buttons. */
  actions?: (row: T) => React.ReactNode
  onRowClick?: (row: T) => void
  /** Toolbar content rendered to the right of the search box (e.g. a New button). */
  toolbar?: React.ReactNode
  emptyLabel?: string
}

export default function DataTable<T>({
  queryKey,
  endpoint,
  rowsKey,
  columns,
  getRowId,
  pageSize = 20,
  searchPlaceholder = 'Search…',
  actions,
  onRowClick,
  toolbar,
  emptyLabel = 'No records found.',
}: DataTableProps<T>) {
  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')
  const [page, setPage] = useState(0)

  // debounce search input
  function handleSearch(v: string) {
    setQuery(v)
    setPage(0)
    clearTimeout((handleSearch as any)._t)
    ;(handleSearch as any)._t = setTimeout(() => setDebounced(v), 300)
  }

  const { data, isFetching, isError } = useQuery({
    queryKey: [queryKey, debounced, page, pageSize],
    queryFn: async () => {
      const url = `${endpoint}?q=${encodeURIComponent(debounced)}&page=${page}&pageSize=${pageSize}`
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to load')
      return res.json() as Promise<Record<string, unknown> & { total: number }>
    },
    placeholderData: (prev) => prev,
  })

  const rows = (data?.[rowsKey] as T[] | undefined) ?? []
  const total = data?.total ?? 0
  const colSpan = columns.length + (actions ? 1 : 0)

  return (
    <div className="kf-card rounded-2xl">
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          {isFetching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 animate-spin" />
          )}
          <input
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="kf-input w-full pl-9"
          />
        </div>
        {toolbar}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--kf-border)] text-xs text-[var(--kf-text-muted)] uppercase tracking-wide">
              {columns.map((c) => (
                <th key={c.key} className={cn('py-2 text-left font-medium', c.className)}>
                  {c.header}
                </th>
              ))}
              {actions && <th className="py-2 text-right font-medium">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--kf-border)]">
            {rows.length === 0 && (
              <tr>
                <td colSpan={colSpan} className="py-8 text-center text-[var(--kf-text-muted)] text-sm">
                  {isError ? 'Failed to load data.' : emptyLabel}
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr
                key={getRowId(row)}
                className={cn('transition', onRowClick && 'hover:bg-zinc-50 cursor-pointer')}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((c) => (
                  <td key={c.key} className={cn('py-3 pr-4', c.className)}>
                    {c.render ? c.render(row) : ((row as Record<string, unknown>)[c.key] as React.ReactNode)}
                  </td>
                ))}
                {actions && (
                  <td className="py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">{actions(row)}</div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
    </div>
  )
}
