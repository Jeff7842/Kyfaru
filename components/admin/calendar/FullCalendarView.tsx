'use client'

import { useState, useRef, useCallback } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin, { type DateClickArg } from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import type { EventClickArg, EventInput, DateSelectArg, EventDropArg } from '@fullcalendar/core'
import { kfToast } from '@/lib/admin/toast'
import EventModal, { type CalendarEventData } from './EventModal'

const KE_HOLIDAYS: EventInput[] = [
  { id: 'h-ny', title: "New Year's Day", start: '2025-01-01', allDay: true, display: 'background', color: '#e5f7e5' },
  { id: 'h-good-fri', title: 'Good Friday', start: '2025-04-18', allDay: true, display: 'background', color: '#e5f7e5' },
  { id: 'h-easter', title: 'Easter Monday', start: '2025-04-21', allDay: true, display: 'background', color: '#e5f7e5' },
  { id: 'h-labour', title: 'Labour Day', start: '2025-05-01', allDay: true, display: 'background', color: '#e5f7e5' },
  { id: 'h-madaraka', title: 'Madaraka Day', start: '2025-06-01', allDay: true, display: 'background', color: '#e5f7e5' },
  { id: 'h-utamaduni', title: 'Utamaduni Day', start: '2025-10-10', allDay: true, display: 'background', color: '#e5f7e5' },
  { id: 'h-jamhuri', title: 'Jamhuri Day', start: '2025-12-12', allDay: true, display: 'background', color: '#e5f7e5' },
  { id: 'h-xmas', title: 'Christmas Day', start: '2025-12-25', allDay: true, display: 'background', color: '#e5f7e5' },
  { id: 'h-boxing', title: 'Boxing Day', start: '2025-12-26', allDay: true, display: 'background', color: '#e5f7e5' },
]

interface FullCalendarViewProps {
  initialEvents: CalendarEventData[]
}

function toFCEvent(e: CalendarEventData): EventInput {
  return {
    id: e.id,
    title: e.title,
    start: e.startDate,
    end: e.endDate,
    allDay: e.allDay,
    backgroundColor: e.color ?? 'var(--kf-green)',
    borderColor: 'transparent',
    extendedProps: { type: e.type, location: e.location, meetingLink: e.meetingLink, description: e.description },
  }
}

export default function FullCalendarView({ initialEvents }: FullCalendarViewProps) {
  const calRef = useRef<InstanceType<typeof FullCalendar>>(null)
  const [events, setEvents] = useState<CalendarEventData[]>(initialEvents)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEventData | null>(null)

  const fcEvents: EventInput[] = [
    ...KE_HOLIDAYS,
    ...events.map(toFCEvent),
  ]

  function handleDateClick(arg: DateClickArg) {
    const pad = (n: number) => String(n).padStart(2, '0')
    const d = arg.date
    const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
    setEditingEvent({
      title: '',
      type: 'meeting',
      startDate: dateStr,
      endDate: new Date(d.getTime() + 60 * 60 * 1000).toISOString().slice(0, 16),
      allDay: arg.allDay,
    })
    setModalOpen(true)
  }

  function handleSelect(arg: DateSelectArg) {
    setEditingEvent({
      title: '',
      type: 'meeting',
      startDate: arg.startStr,
      endDate: arg.endStr,
      allDay: arg.allDay,
    })
    setModalOpen(true)
  }

  function handleEventClick(arg: EventClickArg) {
    if (arg.event.display === 'background') return
    const found = events.find((e) => e.id === arg.event.id)
    if (found) {
      setEditingEvent(found)
      setModalOpen(true)
    }
  }

  async function handleEventDrop(arg: EventDropArg) {
    const { event } = arg
    const start = event.startStr
    const end = event.endStr || event.startStr

    try {
      const res = await fetch(`/api/admin/calendar/events/${event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate: start, endDate: end }),
      })
      if (!res.ok) { arg.revert(); kfToast.error('Failed to update event'); return }
      setEvents((prev) =>
        prev.map((e) => e.id === event.id ? { ...e, startDate: start, endDate: end } : e),
      )
    } catch {
      arg.revert()
      kfToast.error('Failed to update event')
    }
  }

  const handleSaved = useCallback((saved: CalendarEventData) => {
    setEvents((prev) => {
      const idx = prev.findIndex((e) => e.id === saved.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = saved
        return next
      }
      return [...prev, saved]
    })
  }, [])

  const handleDeleted = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }, [])

  return (
    <>
      <div className="kf-card rounded-2xl p-4">
        <FullCalendar
          ref={calRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listYear',
          }}
          buttonText={{
            today: 'Today',
            month: 'Month',
            week: 'Week',
            day: 'Day',
            list: 'Schedule',
          }}
          events={fcEvents}
          editable
          selectable
          selectMirror
          dayMaxEvents={4}
          weekends
          nowIndicator
          height="auto"
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          select={handleSelect}
          eventDrop={handleEventDrop}
          eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
          slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
        />
      </div>

      <EventModal
        open={modalOpen}
        event={editingEvent}
        onClose={() => { setModalOpen(false); setEditingEvent(null) }}
        onSaved={handleSaved}
        onDeleted={handleDeleted}
      />
    </>
  )
}
