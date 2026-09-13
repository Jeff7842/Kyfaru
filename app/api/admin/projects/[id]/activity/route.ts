import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { auditLogs, invoices } from '@/lib/admin/db/schema'
import { and, desc, eq, inArray, or } from 'drizzle-orm'

// Shared response shape - import these (type-only) rather than re-declaring
// them in whatever renders the activity stepper, so the two can't drift.
export interface ActivityEntry { id: string; icon: string; title: string; time: string }
export interface ActivityGroup { label: string; entries: ActivityEntry[] }

// Kyfaru operates out of Kenya - bucket "Today"/"Yesterday" in Africa/Nairobi
// (UTC+3) rather than the server process's own timezone (commonly UTC),
// which would otherwise mislabel entries created 21:00-00:00 UTC by a day.
const TZ = 'Africa/Nairobi'
const dateKey = (d: Date) => d.toLocaleDateString('en-CA', { timeZone: TZ })

function dayLabel(d: Date): string {
  const today = new Date()
  const yesterday = new Date(today.getTime() - 86400000)
  const key = dateKey(d)
  if (key === dateKey(today)) return 'Today'
  if (key === dateKey(yesterday)) return 'Yesterday'
  return d.toLocaleDateString('en-GB', { timeZone: TZ, weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
}

// A project's timeline includes its own audit trail plus that of invoices
// billed against it - "Invoice INV-0004 marked as paid" is the whole point
// of the stepper, and invoices carry no separate entityType view of their own.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const projectInvoices = await db.select({ id: invoices.id }).from(invoices).where(eq(invoices.projectId, id))
  const invoiceIds = projectInvoices.map((r) => r.id)

  const conds = [and(eq(auditLogs.entityType, 'project'), eq(auditLogs.entityId, id))]
  if (invoiceIds.length) conds.push(and(eq(auditLogs.entityType, 'invoice'), inArray(auditLogs.entityId, invoiceIds)))

  const rows = await db
    .select()
    .from(auditLogs)
    .where(or(...conds))
    .orderBy(desc(auditLogs.createdAt))

  const groups: ActivityGroup[] = []
  for (const row of rows) {
    const created = new Date(row.createdAt)
    const label = dayLabel(created)
    let group = groups.find((g) => g.label === label)
    if (!group) {
      group = { label, entries: [] }
      groups.push(group)
    }
    group.entries.push({
      id: row.id,
      icon: row.icon ?? 'circle',
      title: row.title ?? row.action,
      time: created.toLocaleTimeString('en-US', { timeZone: TZ, hour: 'numeric', minute: '2-digit' }),
    })
  }

  return NextResponse.json({ groups })
}
