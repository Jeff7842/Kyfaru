import { db } from '@/lib/admin/db'
import { calendarEvents } from '@/lib/admin/db/schema'
import { gte, asc } from 'drizzle-orm'
import HeroSection from '@/components/admin/layout/HeroSection'
import Link from 'next/link'
import CalendarView from '@/components/admin/calendar/CalendarView'

export const metadata = { title: 'Calendar — Kyfaru Admin' }
export const dynamic = 'force-dynamic'

export default async function CalendarPage() {
  const now = new Date()
  const events = await db
    .select()
    .from(calendarEvents)
    .where(gte(calendarEvents.startAt, now))
    .orderBy(asc(calendarEvents.startAt))
    .limit(50)

  return (
    <div className="space-y-6 kf-anim-in">
      <HeroSection
        title="Calendar"
        subtitle="Upcoming events, meetings, and deadlines."
        actions={
          <Link href="/admin/calendar/new" className="kf-btn-primary">
            New Event
          </Link>
        }
      />
      <CalendarView events={events} />
    </div>
  )
}
