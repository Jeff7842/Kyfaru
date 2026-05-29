'use client'

import { useEffect, useState } from 'react'
import { Plus, X, ChevronUp, ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { kfToast } from '@/lib/admin/toast'
import { WIDGETS } from '@/components/admin/dashboard/widgets'
import { CardGridSkeleton } from '@/components/admin/shared/Skeleton'

interface LayoutItem { widgetId: string; size: 'full' | 'half' }

export default function DashboardGrid() {
  const [layout, setLayout] = useState<LayoutItem[] | null>(null)
  const [editing, setEditing] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)

  useEffect(() => {
    fetch('/api/admin/dashboard/layout')
      .then((r) => r.json())
      .then((d) => setLayout(d.layout ?? []))
      .catch(() => setLayout([]))
  }, [])

  async function persist(next: LayoutItem[]) {
    setLayout(next)
    await fetch('/api/admin/dashboard/layout', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ layout: next }),
    })
  }

  function remove(id: string) { if (layout) persist(layout.filter((l) => l.widgetId !== id)) }
  function move(i: number, dir: -1 | 1) {
    if (!layout) return
    const j = i + dir
    if (j < 0 || j >= layout.length) return
    const next = [...layout]
    ;[next[i], next[j]] = [next[j], next[i]]
    persist(next)
  }
  function add(id: string) {
    if (!layout) return
    persist([...layout, { widgetId: id, size: WIDGETS[id].defaultSize }])
    setPickerOpen(false)
    kfToast.success('Section added')
  }

  if (!layout) return <CardGridSkeleton cards={4} />

  const available = Object.keys(WIDGETS).filter((id) => !layout.some((l) => l.widgetId === id))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        {editing && available.length > 0 && (
          <div className="relative">
            <button onClick={() => setPickerOpen((o) => !o)} className="flex items-center gap-1.5 text-sm rounded-lg px-3 h-9 border border-zinc-200 hover:bg-zinc-50 transition">
              <Plus className="w-4 h-4" /> Add section
            </button>
            {pickerOpen && (
              <div className="absolute right-0 mt-1 z-20 bg-white border border-zinc-200 rounded-xl shadow-lg w-56 py-1">
                {available.map((id) => (
                  <button key={id} onClick={() => add(id)} className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-50">
                    {WIDGETS[id].title}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <button
          onClick={() => { setEditing((e) => !e); setPickerOpen(false) }}
          className={cn('flex items-center gap-1.5 text-sm rounded-lg px-3 h-9 transition', editing ? 'bg-[var(--kf-green)] text-white' : 'border border-zinc-200 hover:bg-zinc-50')}
        >
          {editing ? <><Check className="w-4 h-4" /> Done</> : 'Customize'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {layout.map((item, i) => {
          const def = WIDGETS[item.widgetId]
          if (!def) return null
          const Widget = def.Component
          return (
            <div key={item.widgetId} className={cn('relative', item.size === 'full' && 'lg:col-span-2')}>
              {editing && (
                <div className="absolute -top-2 -right-2 z-10 flex items-center gap-1 bg-white border border-zinc-200 rounded-lg shadow-sm p-0.5">
                  <button onClick={() => move(i, -1)} className="p-1 hover:bg-zinc-100 rounded" aria-label="Move up"><ChevronUp className="w-3.5 h-3.5" /></button>
                  <button onClick={() => move(i, 1)} className="p-1 hover:bg-zinc-100 rounded" aria-label="Move down"><ChevronDown className="w-3.5 h-3.5" /></button>
                  <button onClick={() => remove(item.widgetId)} className="p-1 hover:bg-red-50 text-red-600 rounded" aria-label="Remove"><X className="w-3.5 h-3.5" /></button>
                </div>
              )}
              <Widget />
            </div>
          )
        })}
      </div>
    </div>
  )
}
