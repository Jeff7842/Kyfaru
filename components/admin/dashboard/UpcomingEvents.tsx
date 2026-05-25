import Link from 'next/link'
import { CalendarDays, ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/admin/utils'
import type { CalendarEvent } from '@/lib/admin/db/schema'

export default function UpcomingEvents({ events }: { events: CalendarEvent[] }) {
  return (
    <div className="kf-card rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-[var(--kf-text)]">Upcoming Events</h2>
        <Link
          href="/admin/calendar"
          className="text-xs text-[var(--kf-green)] hover:underline flex items-center gap-1"
        >
          Calendar <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      {events.length === 0 ? (
        <p className="text-sm text-[var(--kf-text-muted)]">Nothing scheduled.</p>
      ) : (
        <div className="space-y-3">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="flex gap-3 items-start"
            >
              <div className="p-1.5 bg-[var(--kf-green)]/10 rounded-lg shrink-0">
                <CalendarDays className="w-4 h-4 text-[var(--kf-green)]" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{ev.title}</div>
                <div className="text-xs text-[var(--kf-text-muted)]">
                  {formatDate(ev.startAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
