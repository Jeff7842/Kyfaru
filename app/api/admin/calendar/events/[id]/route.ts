import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { calendarEvents } from '@/lib/admin/db/schema'
import { eq } from 'drizzle-orm'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  const existing = await db.query.calendarEvents.findFirst({
    where: eq(calendarEvents.id, id),
  })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const updates: Partial<typeof calendarEvents.$inferInsert> = {}
  if (body.title !== undefined) updates.title = body.title
  if (body.type !== undefined) updates.eventType = body.type
  if (body.startDate !== undefined) updates.startAt = new Date(body.startDate)
  if (body.endDate !== undefined) updates.endAt = new Date(body.endDate)
  if (body.allDay !== undefined) updates.isAllDay = body.allDay
  if (body.location !== undefined) updates.location = body.location
  if (body.meetingLink !== undefined) updates.meetingLink = body.meetingLink
  if (body.description !== undefined) updates.description = body.description
  if (body.color !== undefined) updates.color = body.color
  if (body.projectId !== undefined) updates.projectId = body.projectId
  if (body.clientId !== undefined) updates.clientId = body.clientId

  const [event] = await db
    .update(calendarEvents)
    .set(updates)
    .where(eq(calendarEvents.id, id))
    .returning()

  return NextResponse.json({ event })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await db.delete(calendarEvents).where(eq(calendarEvents.id, id))
  return NextResponse.json({ ok: true })
}
