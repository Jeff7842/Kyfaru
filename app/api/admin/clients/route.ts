import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { clients, auditLogs } from '@/lib/admin/db/schema'
import { requireRole } from '@/lib/admin/permissions'
import { paginatedSearch } from '@/lib/admin/db/query-helpers'
import { desc } from 'drizzle-orm'
import type { Role } from '@/lib/admin/permissions'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const { rows, total, page, pageSize } = await paginatedSearch({
    table: clients,
    searchColumns: [clients.name, clients.email, clients.contactPerson],
    page: Number(searchParams.get('page') ?? 0),
    pageSize: Number(searchParams.get('pageSize') ?? 20),
    q: searchParams.get('q') ?? '',
    orderBy: [desc(clients.createdAt)],
  })

  return NextResponse.json({ clients: rows, total, page, pageSize })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  requireRole(session.user.role as Role, 'manager')

  const body = await req.json()
  const { name, email } = body
  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
  }

  const [client] = await db
    .insert(clients)
    .values({
      name,
      email,
      contactPerson: body.contactPerson ?? null,
      phone: body.phone ?? null,
      whatsappNumber: body.whatsappNumber ?? null,
      industry: body.industry ?? null,
      logoUrl: body.logoUrl ?? null,
      address: body.address ?? null,
      country: body.country ?? null,
      county: body.county ?? null,
      kraPin: body.kraPin ?? null,
      notes: body.notes ?? null,
      isActive: body.isActive ?? true,
      createdById: session.user.id as string,
    })
    .returning()

  await db.insert(auditLogs).values({
    userId: session.user.id as string,
    action: 'client.create',
    entityType: 'client',
    entityId: client.id,
    after: { name, email },
  })

  return NextResponse.json({ client }, { status: 201 })
}
