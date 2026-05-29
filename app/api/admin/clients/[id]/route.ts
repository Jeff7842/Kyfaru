import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { clients, auditLogs } from '@/lib/admin/db/schema'
import { requireRole } from '@/lib/admin/permissions'
import { eq } from 'drizzle-orm'
import type { Role } from '@/lib/admin/permissions'

const EDITABLE = [
  'name', 'email', 'contactPerson', 'phone', 'whatsappNumber',
  'industry', 'logoUrl', 'address', 'country', 'county', 'kraPin', 'notes', 'isActive',
] as const

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  requireRole(session.user.role as Role, 'manager')

  const { id } = await params
  const body = await req.json()
  const existing = await db.query.clients.findFirst({ where: eq(clients.id, id) })
  if (!existing) return NextResponse.json({ error: 'Client not found' }, { status: 404 })

  const updates: Record<string, unknown> = { updatedAt: new Date() }
  for (const k of EDITABLE) if (body[k] !== undefined) updates[k] = body[k]

  const [updated] = await db.update(clients).set(updates).where(eq(clients.id, id)).returning()

  await db.insert(auditLogs).values({
    userId: session.user.id as string,
    action: 'client.update',
    entityType: 'client',
    entityId: id,
    before: { name: existing.name, email: existing.email, isActive: existing.isActive },
    after: updates,
  })

  return NextResponse.json({ client: updated })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  requireRole(session.user.role as Role, 'admin')

  const { id } = await params
  const existing = await db.query.clients.findFirst({ where: eq(clients.id, id) })
  if (!existing) return NextResponse.json({ error: 'Client not found' }, { status: 404 })

  // Soft delete to preserve referential history (projects/invoices reference clients).
  await db.update(clients).set({ isActive: false, updatedAt: new Date() }).where(eq(clients.id, id))

  await db.insert(auditLogs).values({
    userId: session.user.id as string,
    action: 'client.delete',
    entityType: 'client',
    entityId: id,
    before: { name: existing.name, email: existing.email },
  })

  return NextResponse.json({ ok: true })
}
