import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { projects } from '@/lib/admin/db/schema'
import { requireRole } from '@/lib/admin/permissions'
import { logAudit } from '@/lib/admin/audit'
import { projectRequirementsSchema } from '@/lib/admin/types/project-requirements'
import { eq } from 'drizzle-orm'
import type { Role } from '@/lib/admin/permissions'

const DATE_FIELDS = ['startDate', 'expectedEndDate', 'actualEndDate', 'goLiveDate', 'supportExpiryDate']

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const project = await db.query.projects.findFirst({ where: eq(projects.id, id), with: { client: true } })
  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

  return NextResponse.json({ project })
}

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
  if (body.scopeDocument !== undefined) {
    const parsed = projectRequirementsSchema.safeParse(body.scopeDocument)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid project details' }, { status: 400 })
    updates.scopeDocument = parsed.data
  }

  const [updated] = await db.update(projects).set(updates).where(eq(projects.id, id)).returning()

  await logAudit({
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

  await logAudit({
    userId: session.user.id as string,
    action: 'project.delete',
    entityType: 'project',
    entityId: id,
    before: { name: existing.name },
  })

  return NextResponse.json({ ok: true })
}
