'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Search, Loader2, FolderKanban, Users, Wallet } from 'lucide-react'
import type { SearchResult } from '@/app/api/admin/search/route'

const ICON = {
  project: FolderKanban,
  client: Users,
  invoice: Wallet,
} as const

export default function GlobalSearch() {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [debounced, setDebounced] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q), 300)
    return () => clearTimeout(t)
  }, [q])

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const { data, isFetching } = useQuery({
    queryKey: ['global-search', debounced],
    queryFn: async () => {
      const res = await fetch(`/api/admin/search?q=${encodeURIComponent(debounced)}`)
      return res.json() as Promise<{ results: SearchResult[] }>
    },
    enabled: debounced.length >= 2,
    placeholderData: (prev) => prev,
  })
  const results: SearchResult[] = data?.results ?? []

  function go(url: string) {
    setOpen(false)
    setQ('')
    router.push(url)
  }

  return (
    <div ref={ref} className="flex-1 max-w-md relative hidden sm:block">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--kf-text-faint)]" />
      {isFetching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--kf-text-faint)] animate-spin" />}
      <input
        type="search"
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        placeholder="Search projects, clients, invoices…"
        className="w-full h-9 pl-9 pr-3 rounded-lg bg-[var(--kf-bg-card)] border border-[var(--kf-border)] text-sm placeholder:text-[var(--kf-text-faint)] focus:outline-none focus:border-[var(--kf-green)]"
      />

      {open && debounced.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[var(--kf-border)] rounded-xl shadow-lg overflow-hidden z-50 max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-zinc-400">{isFetching ? 'Searching…' : 'No results'}</p>
          ) : (
            results.map((r) => {
              const Icon = ICON[r.type]
              return (
                <button
                  key={`${r.type}-${r.id}`}
                  onClick={() => go(r.url)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-zinc-50 transition"
                >
                  <Icon className="w-4 h-4 text-[var(--kf-green)] shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-zinc-800 truncate">{r.title}</div>
                    {r.subtitle && <div className="text-xs text-zinc-400 truncate">{r.subtitle}</div>}
                  </div>
                  <span className="text-[10px] uppercase tracking-wide text-zinc-400">{r.type}</span>
                </button>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
