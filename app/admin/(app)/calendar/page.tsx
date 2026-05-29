import { db } from '@/lib/admin/db'
import { calendarEvents } from '@/lib/admin/db/schema'
import { asc } from 'drizzle-orm'
import CalendarApp from '@/components/admin/calendar/CalendarApp'
import type { CalendarEventData } from '@/components/admin/calendar/EventModal'

export const metadata = { title: 'Calendar — Kyfaru Admin' }
export const dynamic = 'force-dynamic'

export default async function CalendarPage() {
  const rows = await db.select().from(calendarEvents).orderBy(asc(calendarEvents.startAt))

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

  return <CalendarApp initialEvents={events} />
}
