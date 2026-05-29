'use client'

import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  addDays, addMonths, addWeeks, addYears, eachDayOfInterval, endOfMonth, endOfWeek,
  format, isSameDay, isSameMonth, isToday, startOfDay, startOfMonth, startOfWeek,
  startOfYear, setMonth,
} from 'date-fns'
import { ChevronLeft, ChevronRight, Plus, MapPin, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { weatherGlyph, type DayWeather } from '@/lib/admin/weather'
import EventModal, { type CalendarEventData } from './EventModal'

type View = 'month' | 'week' | 'day' | 'year'

const FIXED_HOLIDAYS: { md: string; title: string }[] = [
  { md: '01-01', title: "New Year's Day" }, { md: '05-01', title: 'Labour Day' },
  { md: '06-01', title: 'Madaraka Day' }, { md: '10-10', title: 'Utamaduni Day' },
  { md: '10-20', title: 'Mashujaa Day' }, { md: '12-12', title: 'Jamhuri Day' },
  { md: '12-25', title: 'Christmas Day' }, { md: '12-26', title: 'Boxing Day' },
]

function holidayFor(d: Date): string | null {
  const md = format(d, 'MM-dd')
  return FIXED_HOLIDAYS.find((h) => h.md === md)?.title ?? null
}

function toLocalInput(d: Date) {
  return format(d, "yyyy-MM-dd'T'HH:mm")
}

export default function CalendarApp({ initialEvents }: { initialEvents: CalendarEventData[] }) {
  const [events, setEvents] = useState<CalendarEventData[]>(initialEvents)
  const [view, setView] = useState<View>('month')
  const [cursor, setCursor] = useState(new Date())
  const [selected, setSelected] = useState(new Date())
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<CalendarEventData | null>(null)
  const [dragId, setDragId] = useState<string | null>(null)

  const { data: forecast } = useQuery({
    queryKey: ['calendar-weather'],
    queryFn: async () => (await fetch('/api/admin/weather').then((r) => r.ok ? r.json() : { forecast: [] }).catch(() => ({ forecast: [] }))) as { forecast: DayWeather[] },
    staleTime: 60 * 60 * 1000,
    retry: false,
  })
  const weather = new Map<string, DayWeather>((forecast?.forecast ?? []).map((w) => [w.date, w]))

  const eventsByDay = useMemo(() => {
    const m = new Map<string, CalendarEventData[]>()
    for (const e of events) {
      const key = format(new Date(e.startDate), 'yyyy-MM-dd')
      if (!m.has(key)) m.set(key, [])
      m.get(key)!.push(e)
    }
    return m
  }, [events])

  function openCreate(day: Date) {
    setEditing({
      title: '', type: 'meeting',
      startDate: toLocalInput(new Date(day.getFullYear(), day.getMonth(), day.getDate(), 9, 0)),
      endDate: toLocalInput(new Date(day.getFullYear(), day.getMonth(), day.getDate(), 10, 0)),
      allDay: false,
    })
    setModalOpen(true)
  }

  function openEdit(e: CalendarEventData) { setEditing(e); setModalOpen(true) }

  function onSaved(saved: CalendarEventData) {
    setEvents((prev) => {
      const i = prev.findIndex((e) => e.id === saved.id)
      if (i >= 0) { const n = [...prev]; n[i] = saved; return n }
      return [...prev, saved]
    })
  }
  function onDeleted(id: string) { setEvents((prev) => prev.filter((e) => e.id !== id)) }

  async function moveEvent(id: string, day: Date) {
    const ev = events.find((e) => e.id === id)
    if (!ev) return
    const oldStart = new Date(ev.startDate)
    const newStart = new Date(day.getFullYear(), day.getMonth(), day.getDate(), oldStart.getHours(), oldStart.getMinutes())
    const dur = new Date(ev.endDate).getTime() - oldStart.getTime()
    const newEnd = new Date(newStart.getTime() + dur)
    const startStr = newStart.toISOString(), endStr = newEnd.toISOString()
    setEvents((prev) => prev.map((e) => e.id === id ? { ...e, startDate: startStr, endDate: endStr } : e))
    await fetch(`/api/admin/calendar/events/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startDate: startStr, endDate: endStr }),
    })
  }

  const upcoming = useMemo(
    () => [...events].filter((e) => new Date(e.endDate) >= startOfDay(new Date()))
      .sort((a, b) => +new Date(a.startDate) - +new Date(b.startDate)).slice(0, 12),
    [events],
  )

  const title =
    view === 'year' ? format(cursor, 'yyyy')
    : view === 'day' ? format(cursor, 'EEEE, d MMMM yyyy')
    : format(cursor, 'MMMM yyyy')

  function navigate(dir: -1 | 1) {
    setCursor((c) =>
      view === 'month' ? addMonths(c, dir)
      : view === 'week' ? addWeeks(c, dir)
      : view === 'day' ? addDays(c, dir)
      : addYears(c, dir),
    )
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] -m-4 md:-m-6 bg-white">
      {/* LEFT RAIL */}
      <aside className="hidden lg:flex w-72 border-r border-zinc-200 flex-col shrink-0 p-4 gap-5 overflow-y-auto">
        <button onClick={() => openCreate(selected)} className="flex items-center justify-center gap-2 h-10 rounded-xl bg-[var(--kf-green)] text-white text-sm font-medium">
          <Plus className="w-4 h-4" /> New event
        </button>
        <MiniMonth cursor={cursor} selected={selected} onSelect={(d) => { setSelected(d); setCursor(d); setView('day') }} eventsByDay={eventsByDay} />
        <div>
          <h3 className="text-xs uppercase tracking-wide text-zinc-400 mb-2">Schedule</h3>
          <div className="space-y-2">
            {upcoming.length === 0 && <p className="text-xs text-zinc-400">Nothing upcoming.</p>}
            {upcoming.map((e) => (
              <button key={e.id} onClick={() => openEdit(e)} className="w-full text-left flex gap-2 p-2 rounded-lg hover:bg-zinc-50 transition">
                <span className="w-1 rounded-full shrink-0" style={{ background: e.color ?? 'var(--kf-green)' }} />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-zinc-800 truncate">{e.title}</div>
                  <div className="text-[11px] text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />{format(new Date(e.startDate), 'EEE d MMM, HH:mm')}
                  </div>
                  {e.location && <div className="text-[11px] text-zinc-400 flex items-center gap-1"><MapPin className="w-3 h-3" />{e.location}</div>}
                </div>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <section className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center gap-3 px-5 py-3 border-b border-zinc-200">
          <button onClick={() => { setCursor(new Date()); setSelected(new Date()) }} className="text-sm px-3 h-8 rounded-lg border border-zinc-200 hover:bg-zinc-50">Today</button>
          <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="p-1.5 rounded-lg hover:bg-zinc-100"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => navigate(1)} className="p-1.5 rounded-lg hover:bg-zinc-100"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <h2 className="text-base font-semibold text-zinc-900">{title}</h2>
          <div className="ml-auto flex items-center gap-1 bg-zinc-100 rounded-lg p-0.5">
            {(['month', 'week', 'day', 'year'] as View[]).map((v) => (
              <button key={v} onClick={() => setView(v)} className={cn('text-xs px-2.5 py-1 rounded-md capitalize transition', view === v ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500')}>{v}</button>
            ))}
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          {view === 'month' && <MonthGrid cursor={cursor} eventsByDay={eventsByDay} weather={weather} onDayClick={openCreate} onEventClick={openEdit} dragId={dragId} setDragId={setDragId} onDrop={moveEvent} />}
          {view === 'week' && <WeekGrid cursor={cursor} eventsByDay={eventsByDay} onDayClick={openCreate} onEventClick={openEdit} />}
          {view === 'day' && <DayView cursor={cursor} events={eventsByDay.get(format(cursor, 'yyyy-MM-dd')) ?? []} onCreate={() => openCreate(cursor)} onEventClick={openEdit} />}
          {view === 'year' && <YearGrid cursor={cursor} eventsByDay={eventsByDay} onMonthClick={(m) => { setCursor(m); setView('month') }} />}
        </div>
      </section>

      <EventModal open={modalOpen} event={editing} onClose={() => { setModalOpen(false); setEditing(null) }} onSaved={onSaved} onDeleted={onDeleted} />
    </div>
  )
}

// ── Mini month (left rail) ──
function MiniMonth({ cursor, selected, onSelect, eventsByDay }: { cursor: Date; selected: Date; onSelect: (d: Date) => void; eventsByDay: Map<string, CalendarEventData[]> }) {
  const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 })
  const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start, end })
  return (
    <div>
      <div className="text-sm font-semibold text-zinc-800 mb-2">{format(cursor, 'MMMM yyyy')}</div>
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <div key={i} className="text-[10px] text-zinc-400">{d}</div>)}
        {days.map((d) => {
          const has = (eventsByDay.get(format(d, 'yyyy-MM-dd')) ?? []).length > 0
          return (
            <button key={d.toISOString()} onClick={() => onSelect(d)}
              className={cn('h-7 text-xs rounded-md relative', !isSameMonth(d, cursor) && 'text-zinc-300',
                isSameDay(d, selected) ? 'bg-[var(--kf-green)] text-white' : isToday(d) ? 'text-[var(--kf-green)] font-semibold' : 'hover:bg-zinc-100')}>
              {format(d, 'd')}
              {has && !isSameDay(d, selected) && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--kf-green)]" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Month grid (main) ──
function MonthGrid({ cursor, eventsByDay, weather, onDayClick, onEventClick, dragId, setDragId, onDrop }: {
  cursor: Date; eventsByDay: Map<string, CalendarEventData[]>; weather: Map<string, DayWeather>
  onDayClick: (d: Date) => void; onEventClick: (e: CalendarEventData) => void
  dragId: string | null; setDragId: (id: string | null) => void; onDrop: (id: string, d: Date) => void
}) {
  const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 })
  const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start, end })
  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-7 border-b border-zinc-200">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => <div key={d} className="px-2 py-1.5 text-xs font-medium text-zinc-500">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 flex-1" style={{ gridTemplateRows: `repeat(${days.length / 7}, minmax(0,1fr))` }}>
        {days.map((d) => {
          const key = format(d, 'yyyy-MM-dd')
          const dayEvents = eventsByDay.get(key) ?? []
          const holiday = holidayFor(d)
          const w = weather.get(key)
          return (
            <div key={key}
              onClick={() => onDayClick(d)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => { if (dragId) { onDrop(dragId, d); setDragId(null) } }}
              className={cn('border-b border-r border-zinc-100 p-1 min-h-[84px] cursor-pointer hover:bg-zinc-50/60 transition', !isSameMonth(d, cursor) && 'bg-zinc-50/40')}>
              <div className="flex items-center justify-between">
                <span className={cn('text-xs w-6 h-6 flex items-center justify-center rounded-full', isToday(d) ? 'bg-[var(--kf-green)] text-white' : !isSameMonth(d, cursor) ? 'text-zinc-300' : 'text-zinc-600')}>{format(d, 'd')}</span>
                {w && <span className="text-[10px] text-zinc-400" title={`${w.tempMin}°–${w.tempMax}°`}>{weatherGlyph(w.code)} {w.tempMax}°</span>}
              </div>
              {holiday && <div className="text-[10px] text-rose-500 truncate mt-0.5">{holiday}</div>}
              <div className="mt-0.5 space-y-0.5">
                {dayEvents.slice(0, 3).map((e) => (
                  <div key={e.id} draggable onDragStart={() => setDragId(e.id ?? null)}
                    onClick={(ev) => { ev.stopPropagation(); onEventClick(e) }}
                    className="text-[11px] truncate px-1.5 py-0.5 rounded text-white cursor-grab active:cursor-grabbing"
                    style={{ background: e.color ?? 'var(--kf-green)' }}>
                    {e.allDay ? '' : format(new Date(e.startDate), 'HH:mm') + ' '}{e.title}
                  </div>
                ))}
                {dayEvents.length > 3 && <div className="text-[10px] text-zinc-400 px-1">+{dayEvents.length - 3} more</div>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Week grid ──
function WeekGrid({ cursor, eventsByDay, onDayClick, onEventClick }: { cursor: Date; eventsByDay: Map<string, CalendarEventData[]>; onDayClick: (d: Date) => void; onEventClick: (e: CalendarEventData) => void }) {
  const start = startOfWeek(cursor, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start, end: endOfWeek(cursor, { weekStartsOn: 1 }) })
  return (
    <div className="grid grid-cols-7 h-full">
      {days.map((d) => {
        const dayEvents = eventsByDay.get(format(d, 'yyyy-MM-dd')) ?? []
        return (
          <div key={d.toISOString()} onClick={() => onDayClick(d)} className="border-r border-zinc-100 p-2 cursor-pointer hover:bg-zinc-50/60">
            <div className={cn('text-center mb-2', isToday(d) && 'text-[var(--kf-green)] font-semibold')}>
              <div className="text-[11px] text-zinc-400">{format(d, 'EEE')}</div>
              <div className="text-lg">{format(d, 'd')}</div>
            </div>
            <div className="space-y-1">
              {dayEvents.map((e) => (
                <div key={e.id} onClick={(ev) => { ev.stopPropagation(); onEventClick(e) }} className="text-[11px] px-1.5 py-1 rounded text-white truncate" style={{ background: e.color ?? 'var(--kf-green)' }}>
                  {format(new Date(e.startDate), 'HH:mm')} {e.title}
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Day view ──
function DayView({ cursor, events, onCreate, onEventClick }: { cursor: Date; events: CalendarEventData[]; onCreate: () => void; onEventClick: (e: CalendarEventData) => void }) {
  const sorted = [...events].sort((a, b) => +new Date(a.startDate) - +new Date(b.startDate))
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-zinc-800">{format(cursor, 'EEEE, d MMMM')}</h3>
        <button onClick={onCreate} className="text-sm flex items-center gap-1 text-[var(--kf-green)]"><Plus className="w-4 h-4" /> Add</button>
      </div>
      {holidayFor(cursor) && <div className="text-sm text-rose-500 mb-3">🇰🇪 {holidayFor(cursor)}</div>}
      {sorted.length === 0 ? <p className="text-sm text-zinc-400">No events this day.</p> : (
        <div className="space-y-2">
          {sorted.map((e) => (
            <button key={e.id} onClick={() => onEventClick(e)} className="w-full text-left flex gap-3 p-3 rounded-xl border border-zinc-100 hover:bg-zinc-50">
              <span className="w-1.5 rounded-full" style={{ background: e.color ?? 'var(--kf-green)' }} />
              <div>
                <div className="font-medium text-zinc-800">{e.title}</div>
                <div className="text-xs text-zinc-400">{e.allDay ? 'All day' : `${format(new Date(e.startDate), 'HH:mm')} – ${format(new Date(e.endDate), 'HH:mm')}`}</div>
                {e.location && <div className="text-xs text-zinc-400">{e.location}</div>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Year grid (12 mini-months) ──
function YearGrid({ cursor, eventsByDay, onMonthClick }: { cursor: Date; eventsByDay: Map<string, CalendarEventData[]>; onMonthClick: (d: Date) => void }) {
  const months = Array.from({ length: 12 }, (_, i) => setMonth(startOfYear(cursor), i))
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-5">
      {months.map((m) => {
        const start = startOfWeek(startOfMonth(m), { weekStartsOn: 1 })
        const end = endOfWeek(endOfMonth(m), { weekStartsOn: 1 })
        const days = eachDayOfInterval({ start, end })
        return (
          <button key={m.toISOString()} onClick={() => onMonthClick(m)} className="text-left p-2 rounded-xl border border-zinc-100 hover:bg-zinc-50">
            <div className="text-sm font-medium text-zinc-700 mb-1">{format(m, 'MMMM')}</div>
            <div className="grid grid-cols-7 gap-0.5 text-center">
              {days.map((d) => {
                const has = (eventsByDay.get(format(d, 'yyyy-MM-dd')) ?? []).length > 0
                return (
                  <div key={d.toISOString()} className={cn('text-[9px] h-4 flex items-center justify-center rounded relative', !isSameMonth(d, m) && 'text-zinc-300', isToday(d) && 'bg-[var(--kf-green)] text-white rounded-full')}>
                    {format(d, 'd')}
                    {has && !isToday(d) && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-0.5 rounded-full bg-[var(--kf-green)]" />}
                  </div>
                )
              })}
            </div>
          </button>
        )
      })}
    </div>
  )
}
