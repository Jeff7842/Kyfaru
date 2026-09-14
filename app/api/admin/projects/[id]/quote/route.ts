import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { quotes, projects } from '@/lib/admin/db/schema'
import { requireRole, type Role } from '@/lib/admin/permissions'
import { logAudit } from '@/lib/admin/audit'
import { eq, sql } from 'drizzle-orm'

const DEFAULT_TERMS = 'This quote is valid for 14 days from the quote date. First 30 days of maintenance after delivery are free; a monthly maintenance fee applies thereafter. Any feature requested outside this scope requires a separate quote and invoice.'

export async function getOrCreateQuote(projectId: string, clientId: string, userId: string) {
  const existing = await db.query.quotes.findFirst({ where: eq(quotes.projectId, projectId) })
  if (existing) return existing

  const seq = await db.execute<{ n: number }>(sql`SELECT nextval('quote_number_seq') AS n`)
  const quoteNumber = `QT-${String(seq.rows[0].n).padStart(5, '0')}`
  const dueDate = new Date(Date.now() + 14 * 86400000)

  const [created] = await db
    .insert(quotes)
    .values({
      quoteNumber,
      projectId,
      clientId,
      dueDate,
      lineItems: [],
      termsAndConditions: DEFAULT_TERMS,
      createdById: userId,
    })
    .returning()
  return created
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const project = await db.query.projects.findFirst({ where: eq(projects.id, id), with: { client: true } })
  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

  const quote = await getOrCreateQuote(id, project.clientId, session.user.id as string)
  return NextResponse.json({ quote, project })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  requireRole(session.user.role as Role, 'sales')

  const { id } = await params
  const existing = await db.query.quotes.findFirst({ where: eq(quotes.projectId, id) })
  if (!existing) return NextResponse.json({ error: 'Quote not found' }, { status: 404 })

  const body = await req.json()
  const editable = [
    'lineItems', 'taxRate', 'termsAndConditions', 'notes', 'status',
    'includeToolsRow', 'depositEnabled', 'depositPercent', 'maintenanceEnabled', 'maintenanceFee',
  ]
  const updates: Record<string, unknown> = { updatedAt: new Date() }
  for (const k of editable) if (body[k] !== undefined) updates[k] = body[k]
  if (body.dueDate !== undefined) updates.dueDate = body.dueDate ? new Date(body.dueDate) : null

  const [updated] = await db.update(quotes).set(updates).where(eq(quotes.projectId, id)).returning()

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
