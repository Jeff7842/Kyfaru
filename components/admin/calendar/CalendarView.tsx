'use client'

import { CalendarDays, MapPin, Link as LinkIcon, Clock } from 'lucide-react'
import { cn } from '@/lib/admin/utils'
import type { CalendarEvent } from '@/lib/admin/db/schema'

const EVENT_TYPE_COLORS: Record<string, string> = {
  meeting: 'bg-blue-100 text-blue-700',
  deadline: 'bg-red-100 text-red-700',
  milestone: 'bg-emerald-100 text-emerald-700',
  review: 'bg-yellow-100 text-yellow-700',
  support_expiry: 'bg-orange-100 text-orange-700',
  payment: 'bg-purple-100 text-purple-700',
  default: 'bg-zinc-100 text-zinc-600',
}

export default function CalendarView({ events }: { events: CalendarEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="kf-card rounded-2xl flex flex-col items-center justify-center py-16 gap-3 text-[var(--kf-text-muted)]">
        <CalendarDays className="w-10 h-10 opacity-30" />
        <p className="text-sm">No upcoming events scheduled.</p>
      </div>
    )
  }

  // Group by date string
  const grouped: Record<string, CalendarEvent[]> = {}
  for (const ev of events) {
    const key = new Date(ev.startAt).toDateString()
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(ev)
  }

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([dateStr, dayEvents]) => (
        <div key={dateStr} className="kf-card rounded-2xl">
          <h3 className="font-semibold text-sm text-[var(--kf-text-muted)] mb-3 uppercase tracking-wide">
            {new Date(dateStr).toLocaleDateString('en-KE', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </h3>
          <div className="space-y-3">
            {dayEvents.map((ev) => {
              const colorCls =
                EVENT_TYPE_COLORS[ev.eventType] ?? EVENT_TYPE_COLORS.default
              return (
                <div
                  key={ev.id}
                  className="flex gap-4 items-start p-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 transition cursor-pointer"
                >
                  <div
                    className={cn(
                      'px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize shrink-0 mt-0.5',
                      colorCls,
                    )}
                  >
                    {ev.eventType.replace('_', ' ')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[var(--kf-text)] truncate">
                      {ev.title}
                    </div>
                    {ev.description && (
                      <div className="text-xs text-[var(--kf-text-muted)] mt-0.5 line-clamp-1">
                        {ev.description}
                      </div>
                    )}
                    <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-1.5">
                      {!ev.isAllDay && (
                        <span className="text-xs text-[var(--kf-text-muted)] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(ev.startAt).toLocaleTimeString('en-KE', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          {ev.endAt &&
                            ` – ${new Date(ev.endAt).toLocaleTimeString('en-KE', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}`}
                        </span>
                      )}
                      {ev.location && (
                        <span className="text-xs text-[var(--kf-text-muted)] flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {ev.location}
                        </span>
                      )}
                      {ev.meetingLink && (
                        <a
                          href={ev.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[var(--kf-green)] flex items-center gap-1 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <LinkIcon className="w-3 h-3" /> Join
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
