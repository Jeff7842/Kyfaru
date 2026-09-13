import { NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { projects, projectMilestones, invoices, calendarEvents } from '@/lib/admin/db/schema'
import { and, gte, lte, notInArray, isNull, or } from 'drizzle-orm'
import { cachedJson } from '@/lib/admin/cache'

export const dynamic = 'force-dynamic'

const WINDOW_DAYS = 60

interface Deadline {
  type: 'project_end' | 'milestone' | 'invoice_due' | 'calendar'
  label: string
  date: string
  entityId: string
}

// Merges several date-shaped sources into one sorted upcoming-deadlines list.
// Kept as separate small queries unioned in JS rather than one giant SQL
// statement, since the sources have unrelated shapes.
export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ data: [] }, { status: 401 })

  const data = await cachedJson('dashboard:upcoming-deadlines', 120, async () => {
    const now = new Date()
    const cutoff = new Date(now.getTime() + WINDOW_DAYS * 86400000)

    const [projectRows, milestoneRows, invoiceRows, eventRows] = await Promise.all([
      db
        .select({ id: projects.id, name: projects.name, expectedEndDate: projects.expectedEndDate, goLiveDate: projects.goLiveDate, supportExpiryDate: projects.supportExpiryDate })
        .from(projects)
        .where(
          or(
            and(gte(projects.expectedEndDate, now), lte(projects.expectedEndDate, cutoff)),
            and(gte(projects.goLiveDate, now), lte(projects.goLiveDate, cutoff)),
            and(gte(projects.supportExpiryDate, now), lte(projects.supportExpiryDate, cutoff)),
          ),
        ),
      db
        .select({ id: projectMilestones.id, name: projectMilestones.name, dueDate: projectMilestones.dueDate, projectId: projectMilestones.projectId })
        .from(projectMilestones)
        .where(and(isNull(projectMilestones.paidAt), gte(projectMilestones.dueDate, now), lte(projectMilestones.dueDate, cutoff))),
      db
        .select({ id: invoices.id, invoiceNumber: invoices.invoiceNumber, dueDate: invoices.dueDate })
        .from(invoices)
        .where(and(notInArray(invoices.status, ['paid', 'cancelled']), gte(invoices.dueDate, now), lte(invoices.dueDate, cutoff))),
      db
        .select({ id: calendarEvents.id, title: calendarEvents.title, startAt: calendarEvents.startAt })
        .from(calendarEvents)
        .where(and(gte(calendarEvents.startAt, now), lte(calendarEvents.startAt, cutoff))),
    ])

    const deadlines: Deadline[] = []

    for (const p of projectRows) {
      if (p.expectedEndDate && p.expectedEndDate >= now && p.expectedEndDate <= cutoff) {
        deadlines.push({ type: 'project_end', label: `${p.name} — expected end`, date: p.expectedEndDate.toISOString(), entityId: p.id })
      }
      if (p.goLiveDate && p.goLiveDate >= now && p.goLiveDate <= cutoff) {
        deadlines.push({ type: 'project_end', label: `${p.name} — go-live`, date: p.goLiveDate.toISOString(), entityId: p.id })
      }
      if (p.supportExpiryDate && p.supportExpiryDate >= now && p.supportExpiryDate <= cutoff) {
        deadlines.push({ type: 'project_end', label: `${p.name} — support expires`, date: p.supportExpiryDate.toISOString(), entityId: p.id })
      }
    }

    for (const m of milestoneRows) {
      if (m.dueDate) deadlines.push({ type: 'milestone', label: m.name, date: m.dueDate.toISOString(), entityId: m.projectId })
    }

    for (const inv of invoiceRows) {
      deadlines.push({ type: 'invoice_due', label: `Invoice ${inv.invoiceNumber} due`, date: inv.dueDate.toISOString(), entityId: inv.id })
    }

    for (const ev of eventRows) {
      deadlines.push({ type: 'calendar', label: ev.title, date: ev.startAt.toISOString(), entityId: ev.id })
    }

    deadlines.sort((a, b) => a.date.localeCompare(b.date))
    return deadlines.slice(0, 25)
  })

  return NextResponse.json({ data })
}
