'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, X, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  TECH_CATALOG,
  CATEGORY_COLOR,
  CATEGORY_LABEL,
  categoryFor,
  type StackItem,
  type StackCategory,
} from '@/lib/admin/constants/tech-catalog'

const CATEGORIES = Object.keys(CATEGORY_LABEL) as StackCategory[]

interface Props {
  label?: React.ReactNode
  value: StackItem[]
  onChange: (items: StackItem[]) => void
}

/**
 * Searchable tech-stack tag input. Pick from the catalog or add a custom tool
 * (double-space commits) and assign its category. Chips are grouped & coloured
 * by category, each with an inline remove button.
 */
export default function StackInput({ label, value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [customCat, setCustomCat] = useState<StackCategory>('other')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const selectedNames = new Set(value.map((v) => v.name.toLowerCase()))
  const q = query.trim().toLowerCase()
  const matches = useMemo(
    () => TECH_CATALOG.filter((t) => !selectedNames.has(t.name.toLowerCase()) && t.name.toLowerCase().includes(q)),
    [q, value],
  )
  const exactExists = TECH_CATALOG.some((t) => t.name.toLowerCase() === q) || selectedNames.has(q)

  function add(item: StackItem) {
    if (selectedNames.has(item.name.toLowerCase())) return
    onChange([...value, item])
    setQuery('')
  }

  function remove(name: string) {
    onChange(value.filter((v) => v.name !== name))
  }

  function addCustom() {
    const name = query.trim()
    if (!name) return
    add({ name, category: customCat, custom: true })
    setCustomCat('other')
  }

  // double-space commits a custom entry
  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === ' ' && query.endsWith(' ') && query.trim() && !exactExists) {
      e.preventDefault()
      addCustom()
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      if (matches[0]) add(matches[0])
      else if (query.trim() && !exactExists) addCustom()
    }
  }

  // group selected chips by category for the "defined area" layout
  const grouped = useMemo(() => {
    const m = new Map<StackCategory, StackItem[]>()
    for (const it of value) {
      const cat = it.custom ? it.category : categoryFor(it.name)
      if (!m.has(cat)) m.set(cat, [])
      m.get(cat)!.push(it)
    }
    return m
  }, [value])

  return (
    <div className="flex flex-col gap-1.5" ref={ref}>
      {label && <label className="text-xs font-medium text-zinc-700">{label}</label>}

      {/* selected chips grouped by area */}
      {value.length > 0 && (
        <div className="space-y-2">
          {CATEGORIES.filter((c) => grouped.has(c)).map((cat) => (
            <div key={cat} className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] uppercase tracking-wide text-zinc-400 w-16 shrink-0">{CATEGORY_LABEL[cat]}</span>
              {grouped.get(cat)!.map((it) => (
                <span
                  key={it.name}
                  className={cn('inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-md border text-xs font-medium', CATEGORY_COLOR[cat])}
                >
                  {it.name}
                  <button
                    type="button"
                    onClick={() => remove(it.name)}
                    aria-label={`Remove ${it.name}`}
                    className="rounded-full p-0.5 hover:bg-black/10 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* search trigger + dropdown */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search or add a tool… (double-space to add a custom one)"
          className="kf-modal-input pl-9"
        />

        {open && (
          <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
            {matches.map((t) => (
              <button
                key={t.name}
                type="button"
                onClick={() => add(t)}
                className="w-full flex items-center justify-between px-3 py-2 text-left text-sm hover:bg-zinc-50 transition"
              >
                <span>{t.name}</span>
                <span className={cn('text-[10px] px-1.5 py-0.5 rounded border', CATEGORY_COLOR[t.category])}>
                  {CATEGORY_LABEL[t.category]}
                </span>
              </button>
            ))}

            {/* custom "Other" entry */}
            {query.trim() && !exactExists && (
              <div className="border-t border-zinc-100 p-2 space-y-2">
                <p className="text-[11px] text-zinc-500">
                  Add “<span className="font-medium text-zinc-700">{query.trim()}</span>” as a custom tool
                </p>
                <div className="flex items-center gap-2">
                  <select
                    value={customCat}
                    onChange={(e) => setCustomCat(e.target.value as StackCategory)}
                    className="kf-modal-input h-8 text-xs flex-1"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={addCustom}
                    className="inline-flex items-center gap-1 text-xs px-2 h-8 rounded-md bg-[var(--kf-green)] text-white"
                  >
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>
              </div>
            )}

            {matches.length === 0 && !query.trim() && (
              <p className="px-3 py-4 text-center text-xs text-zinc-400">Type to search tools…</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
