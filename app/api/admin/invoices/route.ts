import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { invoices, clients, auditLogs } from '@/lib/admin/db/schema'
import { requireRole } from '@/lib/admin/permissions'
import { and, count, desc, eq, ilike, or } from 'drizzle-orm'
import type { Role } from '@/lib/admin/permissions'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const page = Math.max(0, Number(searchParams.get('page') ?? 0))
  const pageSize = Math.min(100, Number(searchParams.get('pageSize') ?? 20))
  const q = (searchParams.get('q') ?? '').trim()

  const where = q
    ? or(ilike(invoices.invoiceNumber, `%${q}%`), ilike(clients.name, `%${q}%`))
    : undefined

  const [rows, totalRes] = await Promise.all([
    db
      .select({ invoice: invoices, client: clients })
      .from(invoices)
      .leftJoin(clients, eq(invoices.clientId, clients.id))
      .where(where)
      .orderBy(desc(invoices.createdAt))
      .limit(pageSize)
      .offset(page * pageSize),
    db
      .select({ value: count() })
      .from(invoices)
      .leftJoin(clients, eq(invoices.clientId, clients.id))
      .where(where),
  ])

  return NextResponse.json({
    invoices: rows.map((r) => ({ ...r.invoice, client: r.client })),
    total: totalRes[0]?.value ?? 0,
    page,
    pageSize,
  })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  requireRole(session.user.role as Role, 'finance')

  const body = await req.json()
  if (!body.projectId || !body.clientId || !body.amount || !body.dueDate) {
    return NextResponse.json({ error: 'Project, client, amount and due date are required' }, { status: 400 })
  }

  const [{ value: existingCount }] = await db.select({ value: count() }).from(invoices)
  const invoiceNumber = body.invoiceNumber?.trim() || `KY-${String((existingCount ?? 0) + 1).padStart(5, '0')}`

  const [invoice] = await db
    .insert(invoices)
    .values({
      invoiceNumber,
      projectId: body.projectId,
      clientId: body.clientId,
      milestoneId: body.milestoneId ?? null,
      amount: String(body.amount),
      currency: body.currency ?? 'KES',
      vatAmount: body.vatAmount != null ? String(body.vatAmount) : '0',
      status: body.status ?? 'draft',
      issuedAt: body.issuedAt ? new Date(body.issuedAt) : null,
      dueDate: new Date(body.dueDate),
      lineItems: body.lineItems ?? [],
      notes: body.notes ?? null,
      createdById: session.user.id as string,
    })
    .returning()

  await db.insert(auditLogs).values({
    userId: session.user.id as string,
    action: 'invoice.create',
    entityType: 'invoice',
    entityId: invoice.id,
    after: { invoiceNumber, amount: invoice.amount },
  })

  return NextResponse.json({ invoice }, { status: 201 })
}
