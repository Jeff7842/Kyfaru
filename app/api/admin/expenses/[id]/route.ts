import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { expenses, auditLogs } from '@/lib/admin/db/schema'
import { requireRole } from '@/lib/admin/permissions'
import { eq } from 'drizzle-orm'
import type { Role } from '@/lib/admin/permissions'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  requireRole(session.user.role as Role, 'finance')

  const { id } = await params
  const body = await req.json()
  const existing = await db.query.expenses.findFirst({ where: eq(expenses.id, id) })
  if (!existing) return NextResponse.json({ error: 'Expense not found' }, { status: 404 })

  const updates: Record<string, unknown> = {}
  for (const k of ['category', 'description', 'currency', 'receiptUrl', 'notes', 'projectId']) {
    if (body[k] !== undefined) updates[k] = body[k] || null
  }
  if (body.amount !== undefined) updates.amount = String(body.amount)
  if (body.paidAt !== undefined) updates.paidAt = body.paidAt ? new Date(body.paidAt) : null

  const [updated] = await db.update(expenses).set(updates).where(eq(expenses.id, id)).returning()

  await db.insert(auditLogs).values({
    userId: session.user.id as string,
    action: 'expense.update',
    entityType: 'expense',
    entityId: id,
    after: updates,
  })

  return NextResponse.json({ expense: updated })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  requireRole(session.user.role as Role, 'admin')

  const { id } = await params
  const existing = await db.query.expenses.findFirst({ where: eq(expenses.id, id) })
  if (!existing) return NextResponse.json({ error: 'Expense not found' }, { status: 404 })

  await db.delete(expenses).where(eq(expenses.id, id))

  await db.insert(auditLogs).values({
    userId: session.user.id as string,
    action: 'expense.delete',
    entityType: 'expense',
    entityId: id,
    before: { category: existing.category, amount: existing.amount },
  })

  return NextResponse.json({ ok: true })
}
