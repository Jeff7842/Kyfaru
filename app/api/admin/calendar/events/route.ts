import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { calendarEvents } from '@/lib/admin/db/schema'
import { and, gte, lte } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const start = searchParams.get('start')
  const end = searchParams.get('end')

  const conditions = []
  if (start) conditions.push(gte(calendarEvents.startAt, new Date(start)))
  if (end) conditions.push(lte(calendarEvents.startAt, new Date(end)))

  const rows = await db.query.calendarEvents.findMany({
    where: conditions.length ? and(...conditions) : undefined,
    orderBy: (t, { asc }) => [asc(t.startAt)],
  })

  const events = rows.map((e) => ({
    id: e.id,
    title: e.title,
    type: e.eventType,
    startDate: e.startAt.toISOString(),
    endDate: (e.endAt ?? e.startAt).toISOString(),
    allDay: e.isAllDay ?? false,
    location: e.location,
    meetingLink: e.meetingLink,
    description: e.description,
    color: e.color,
  }))

  return NextResponse.json({ events })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const {
    title, type, startDate, endDate, allDay, location,
    meetingLink, description, color, projectId, clientId,
  } = body

  if (!title || !startDate) {
    return NextResponse.json({ error: 'title and startDate are required' }, { status: 400 })
  }

  const [event] = await db
    .insert(calendarEvents)
    .values({
      title,
      eventType: type ?? 'meeting',
      startAt: new Date(startDate),
      endAt: endDate ? new Date(endDate) : new Date(startDate),
      isAllDay: allDay ?? false,
      location: location ?? null,
      meetingLink: meetingLink ?? null,
      description: description ?? null,
      color: color ?? null,
      projectId: projectId ?? null,
      clientId: clientId ?? null,
      createdById: session.user.id as string,
    })
    .returning()

  return NextResponse.json({
    event: {
      id: event.id,
      title: event.title,
      type: event.eventType,
      startDate: event.startAt.toISOString(),
      endDate: (event.endAt ?? event.startAt).toISOString(),
      allDay: event.isAllDay ?? false,
      location: event.location,
      meetingLink: event.meetingLink,
      description: event.description,
      color: event.color,
    },
  }, { status: 201 })
}
