import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { invoices, auditLogs } from '@/lib/admin/db/schema'
import { requireRole } from '@/lib/admin/permissions'
import { eq } from 'drizzle-orm'
import type { Role } from '@/lib/admin/permissions'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  requireRole(session.user.role as Role, 'finance')

  const { id } = await params
  const body = await req.json()
  const existing = await db.query.invoices.findFirst({ where: eq(invoices.id, id) })
  if (!existing) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })

  const updates: Record<string, unknown> = { updatedAt: new Date() }
  for (const k of ['status', 'notes', 'paymentMethod', 'paymentReference', 'lineItems', 'milestoneId']) {
    if (body[k] !== undefined) updates[k] = body[k]
  }
  if (body.amount !== undefined) updates.amount = String(body.amount)
  if (body.vatAmount !== undefined) updates.vatAmount = String(body.vatAmount)
  for (const k of ['issuedAt', 'dueDate', 'paidAt']) {
    if (body[k] !== undefined) updates[k] = body[k] ? new Date(body[k]) : null
  }

  const [updated] = await db.update(invoices).set(updates).where(eq(invoices.id, id)).returning()

  await db.insert(auditLogs).values({
    userId: session.user.id as string,
    action: 'invoice.update',
    entityType: 'invoice',
    entityId: id,
    before: { status: existing.status, amount: existing.amount },
    after: updates,
  })

  return NextResponse.json({ invoice: updated })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  requireRole(session.user.role as Role, 'admin')

  const { id } = await params
  const existing = await db.query.invoices.findFirst({ where: eq(invoices.id, id) })
  if (!existing) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })

  await db.update(invoices).set({ status: 'cancelled', updatedAt: new Date() }).where(eq(invoices.id, id))

  await db.insert(auditLogs).values({
    userId: session.user.id as string,
    action: 'invoice.delete',
    entityType: 'invoice',
    entityId: id,
    before: { invoiceNumber: existing.invoiceNumber },
  })

  return NextResponse.json({ ok: true })
}
