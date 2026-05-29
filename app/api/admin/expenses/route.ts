import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { expenses, auditLogs } from '@/lib/admin/db/schema'
import { requireRole } from '@/lib/admin/permissions'
import { paginatedSearch } from '@/lib/admin/db/query-helpers'
import { desc } from 'drizzle-orm'
import type { Role } from '@/lib/admin/permissions'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const { rows, total, page, pageSize } = await paginatedSearch({
    table: expenses,
    searchColumns: [expenses.category, expenses.description],
    page: Number(searchParams.get('page') ?? 0),
    pageSize: Number(searchParams.get('pageSize') ?? 20),
    q: searchParams.get('q') ?? '',
    orderBy: [desc(expenses.createdAt)],
  })

  return NextResponse.json({ expenses: rows, total, page, pageSize })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  requireRole(session.user.role as Role, 'finance')

  const body = await req.json()
  if (!body.category || !body.description || body.amount == null) {
    return NextResponse.json({ error: 'Category, description and amount are required' }, { status: 400 })
  }

  const [expense] = await db
    .insert(expenses)
    .values({
      projectId: body.projectId || null,
      category: body.category,
      description: body.description,
      amount: String(body.amount),
      currency: body.currency ?? 'KES',
      paidAt: body.paidAt ? new Date(body.paidAt) : null,
      receiptUrl: body.receiptUrl ?? null,
      notes: body.notes ?? null,
      createdById: session.user.id as string,
    })
    .returning()

  await db.insert(auditLogs).values({
    userId: session.user.id as string,
    action: 'expense.create',
    entityType: 'expense',
    entityId: expense.id,
    after: { category: expense.category, amount: expense.amount },
  })

  return NextResponse.json({ expense }, { status: 201 })
}
