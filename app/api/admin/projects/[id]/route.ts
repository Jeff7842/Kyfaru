import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { projects, auditLogs } from '@/lib/admin/db/schema'
import { requireRole } from '@/lib/admin/permissions'
import { eq } from 'drizzle-orm'
import type { Role } from '@/lib/admin/permissions'

const DATE_FIELDS = ['startDate', 'expectedEndDate', 'actualEndDate', 'goLiveDate', 'supportExpiryDate']

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  requireRole(session.user.role as Role, 'manager')

  const { id } = await params
  const body = await req.json()
  const existing = await db.query.projects.findFirst({ where: eq(projects.id, id) })
  if (!existing) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

  const editable = [
    'name', 'description', 'clientId', 'status', 'currency', 'techStack', 'stack', 'tags',
    'coverImageUrl', 'githubRepoUrl', 'notes', 'progress', 'assignedToId',
  ]
  const updates: Record<string, unknown> = { updatedAt: new Date() }
  for (const k of editable) if (body[k] !== undefined) updates[k] = body[k]
  for (const k of DATE_FIELDS) if (body[k] !== undefined) updates[k] = body[k] ? new Date(body[k]) : null
  if (body.quotedAmount !== undefined)
    updates.quotedAmount = body.quotedAmount === '' || body.quotedAmount == null ? null : String(body.quotedAmount)

  const [updated] = await db.update(projects).set(updates).where(eq(projects.id, id)).returning()

  await db.insert(auditLogs).values({
    userId: session.user.id as string,
    action: 'project.update',
    entityType: 'project',
    entityId: id,
    before: { name: existing.name, status: existing.status },
    after: updates,
  })

  return NextResponse.json({ project: updated })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  requireRole(session.user.role as Role, 'admin')

  const { id } = await params
  const existing = await db.query.projects.findFirst({ where: eq(projects.id, id) })
  if (!existing) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

  await db.update(projects).set({ status: 'cancelled', updatedAt: new Date() }).where(eq(projects.id, id))

  await db.insert(auditLogs).values({
    userId: session.user.id as string,
    action: 'project.delete',
    entityType: 'project',
    entityId: id,
    before: { name: existing.name },
  })

  return NextResponse.json({ ok: true })
}
