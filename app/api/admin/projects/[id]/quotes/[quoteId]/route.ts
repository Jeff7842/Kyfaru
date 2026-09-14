import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { quotes, projects } from '@/lib/admin/db/schema'
import { requireRole, type Role } from '@/lib/admin/permissions'
import { logAudit } from '@/lib/admin/audit'
import { eq, and } from 'drizzle-orm'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string; quoteId: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, quoteId } = await params
  const [project, quote] = await Promise.all([
    db.query.projects.findFirst({ where: eq(projects.id, id), with: { client: true } }),
    db.query.quotes.findFirst({ where: and(eq(quotes.id, quoteId), eq(quotes.projectId, id)) }),
  ])
  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  if (!quote) return NextResponse.json({ error: 'Quote not found' }, { status: 404 })

  return NextResponse.json({ quote, project })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string; quoteId: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  requireRole(session.user.role as Role, 'sales')

  const { id, quoteId } = await params
  const existing = await db.query.quotes.findFirst({ where: and(eq(quotes.id, quoteId), eq(quotes.projectId, id)) })
  if (!existing) return NextResponse.json({ error: 'Quote not found' }, { status: 404 })

  const body = await req.json()
  const editable = [
    'title', 'lineItems', 'taxRate', 'discount', 'currency', 'accentColor', 'toolsPricing', 'termsAndConditions', 'notes', 'status',
    'includeToolsRow', 'depositEnabled', 'depositPercent', 'maintenanceEnabled', 'maintenanceFee',
    'contactEmail', 'contactPhone',
  ]
  const updates: Record<string, unknown> = { updatedAt: new Date() }
  for (const k of editable) if (body[k] !== undefined) updates[k] = body[k]
  if (body.dueDate !== undefined) updates.dueDate = body.dueDate ? new Date(body.dueDate) : null

  const [updated] = await db.update(quotes).set(updates).where(eq(quotes.id, quoteId)).returning()

  await logAudit({
    userId: session.user.id as string,
    action: 'quote.update',
    entityType: 'quote',
    entityId: existing.id,
    before: { status: existing.status },
    after: updates,
    title: `Quote ${existing.quoteNumber} updated`,
    icon: 'file-text',
  })

  return NextResponse.json({ quote: updated })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string; quoteId: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  requireRole(session.user.role as Role, 'admin')

  const { id, quoteId } = await params
  const existing = await db.query.quotes.findFirst({ where: and(eq(quotes.id, quoteId), eq(quotes.projectId, id)) })
  if (!existing) return NextResponse.json({ error: 'Quote not found' }, { status: 404 })

  const body = await req.json().catch(() => ({}))
  const reason = typeof body.reason === 'string' ? body.reason.trim() : ''

  await db.delete(quotes).where(eq(quotes.id, quoteId))

  await logAudit({
    userId: session.user.id as string,
    action: 'quote.delete',
    entityType: 'quote',
    entityId: existing.id,
    before: { quoteNumber: existing.quoteNumber, reason: reason || undefined },
    title: `Quote ${existing.quoteNumber} deleted`,
    icon: 'trash-2',
  })

  return NextResponse.json({ ok: true })
}
