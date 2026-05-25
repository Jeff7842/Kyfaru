'use client'

import { useState, useEffect } from 'react'
import { X, Trash2, Save, Loader2, Link2, MapPin, AlignLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { kfToast } from '@/lib/admin/toast'

export type EventType = 'meeting' | 'deadline' | 'milestone' | 'reminder' | 'other'

export interface CalendarEventData {
  id?: string
  title: string
  type: EventType
  startDate: string
  endDate: string
  allDay: boolean
  location?: string
  meetingLink?: string
  description?: string
  color?: string
}

interface EventModalProps {
  open: boolean
  event: CalendarEventData | null
  onClose: () => void
  onSaved: (event: CalendarEventData) => void
  onDeleted?: (id: string) => void
}

const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: 'meeting', label: 'Meeting' },
  { value: 'deadline', label: 'Deadline' },
  { value: 'milestone', label: 'Milestone' },
  { value: 'reminder', label: 'Reminder' },
  { value: 'other', label: 'Other' },
]

const COLOR_OPTIONS = [
  { value: '#10b981', label: 'Green' },
  { value: '#3b82f6', label: 'Blue' },
  { value: '#f59e0b', label: 'Amber' },
  { value: '#ef4444', label: 'Red' },
  { value: '#8b5cf6', label: 'Purple' },
  { value: '#ec4899', label: 'Pink' },
  { value: '#6b7280', label: 'Gray' },
]

export default function EventModal({ open, event, onClose, onSaved, onDeleted }: EventModalProps) {
  const isEdit = !!event?.id
  const [title, setTitle] = useState('')
  const [type, setType] = useState<EventType>('meeting')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [allDay, setAllDay] = useState(false)
  const [location, setLocation] = useState('')
  const [meetingLink, setMeetingLink] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState(COLOR_OPTIONS[0].value)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (open) {
      setTitle(event?.title ?? '')
      setType(event?.type ?? 'meeting')
      setStartDate(event?.startDate ?? toLocalDateTimeInput(new Date()))
      setEndDate(event?.endDate ?? toLocalDateTimeInput(new Date(Date.now() + 60 * 60 * 1000)))
      setAllDay(event?.allDay ?? false)
      setLocation(event?.location ?? '')
      setMeetingLink(event?.meetingLink ?? '')
      setDescription(event?.description ?? '')
      setColor(event?.color ?? COLOR_OPTIONS[0].value)
    }
  }, [open, event])

  async function handleSave() {
    if (!title.trim()) { kfToast.warning('Title is required'); return }
    setSaving(true)
    try {
      const body = { title, type, startDate, endDate, allDay, location: location || null, meetingLink: meetingLink || null, description: description || null, color }
      const url = isEdit ? `/api/admin/calendar/events/${event!.id}` : '/api/admin/calendar/events'
      const method = isEdit ? 'PATCH' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) { kfToast.error(data.error ?? 'Save failed'); return }
      kfToast.success(isEdit ? 'Event updated' : 'Event created')
      onSaved({ ...body, id: data.event.id })
      onClose()
    } catch { kfToast.error('Something went wrong') }
    finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!event?.id) return
    setDeleting(true)
    try {
      await fetch(`/api/admin/calendar/events/${event.id}`, { method: 'DELETE' })
      kfToast.success('Event deleted')
      onDeleted?.(event.id)
      onClose()
    } catch { kfToast.error('Delete failed') }
    finally { setDeleting(false) }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <h2 className="text-base font-semibold text-zinc-900">{isEdit ? 'Edit event' : 'New event'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <Field label="Title">
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              className="kf-modal-input"
            />
          </Field>

          <Field label="Type">
            <select value={type} onChange={(e) => setType(e.target.value as EventType)} className="kf-modal-input">
              {EVENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </Field>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="allDay" checked={allDay} onChange={(e) => setAllDay(e.target.checked)} className="w-4 h-4 accent-[var(--kf-green)]" />
            <label htmlFor="allDay" className="text-sm text-zinc-700">All day</label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Start">
              <input type={allDay ? 'date' : 'datetime-local'} value={allDay ? startDate.slice(0, 10) : startDate} onChange={(e) => setStartDate(e.target.value)} className="kf-modal-input" />
            </Field>
            <Field label="End">
              <input type={allDay ? 'date' : 'datetime-local'} value={allDay ? endDate.slice(0, 10) : endDate} onChange={(e) => setEndDate(e.target.value)} className="kf-modal-input" />
            </Field>
          </div>

          <Field label={<span className="flex items-center gap-1"><MapPin className="w-3 h-3" />Location</span>}>
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Room, address or virtual" className="kf-modal-input" />
          </Field>

          <Field label={<span className="flex items-center gap-1"><Link2 className="w-3 h-3" />Meeting link</span>}>
            <input value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} placeholder="https://meet.google.com/…" className="kf-modal-input" />
          </Field>

          <Field label={<span className="flex items-center gap-1"><AlignLeft className="w-3 h-3" />Notes</span>}>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Additional details…" className="kf-modal-input resize-none" />
          </Field>

          <Field label="Colour">
            <div className="flex items-center gap-2 flex-wrap">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  title={c.label}
                  className={cn('w-6 h-6 rounded-full border-2 transition', color === c.value ? 'border-zinc-900 scale-110' : 'border-transparent')}
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>
          </Field>
        </div>

        <div className="px-6 py-4 border-t border-zinc-100 flex items-center gap-3">
          {isEdit && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 disabled:opacity-60 mr-auto transition"
            >
              {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              Delete
            </button>
          )}
          <button onClick={onClose} className="flex-1 h-10 rounded-lg border border-zinc-200 text-sm text-zinc-700 hover:bg-zinc-50 transition">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 h-10 rounded-lg bg-[var(--kf-green)] hover:bg-[var(--kf-green-dark)] text-white text-sm font-medium flex items-center justify-center gap-2 transition disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-zinc-700 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

function toLocalDateTimeInput(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
