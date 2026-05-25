import { db } from '@/lib/admin/db'
import { calendarEvents } from '@/lib/admin/db/schema'
import { asc } from 'drizzle-orm'
import HeroSection from '@/components/admin/layout/HeroSection'
import FullCalendarView from '@/components/admin/calendar/FullCalendarView'
import type { CalendarEventData } from '@/components/admin/calendar/EventModal'

export const metadata = { title: 'Calendar — Kyfaru Admin' }
export const dynamic = 'force-dynamic'

export default async function CalendarPage() {
  const rows = await db
    .select()
    .from(calendarEvents)
    .orderBy(asc(calendarEvents.startAt))

  const events: CalendarEventData[] = rows.map((e) => ({
    id: e.id,
    title: e.title,
    type: (e.eventType ?? 'meeting') as CalendarEventData['type'],
    startDate: e.startAt.toISOString(),
    endDate: (e.endAt ?? e.startAt).toISOString(),
    allDay: e.isAllDay ?? false,
    location: e.location ?? undefined,
    meetingLink: e.meetingLink ?? undefined,
    description: e.description ?? undefined,
    color: e.color ?? undefined,
  }))

  return (
    <div className="space-y-6 kf-anim-in">
      <HeroSection
        title="Calendar"
        subtitle="Click any date to add an event. Drag events to reschedule."
      />
      <FullCalendarView initialEvents={events} />
    </div>
  )
}
