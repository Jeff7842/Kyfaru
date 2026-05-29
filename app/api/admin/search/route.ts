import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { projects, clients, invoices } from '@/lib/admin/db/schema'
import { ilike, or, desc } from 'drizzle-orm'

export interface SearchResult {
  type: 'project' | 'client' | 'invoice'
  id: string
  title: string
  subtitle?: string
  url: string
}

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const q = (new URL(req.url).searchParams.get('q') ?? '').trim()
  if (q.length < 2) return NextResponse.json({ results: [] })

  const like = `%${q}%`
  const [projRows, clientRows, invRows] = await Promise.all([
    db.select().from(projects).where(or(ilike(projects.name, like), ilike(projects.projectCode, like))).orderBy(desc(projects.createdAt)).limit(5),
    db.select().from(clients).where(or(ilike(clients.name, like), ilike(clients.email, like))).orderBy(desc(clients.createdAt)).limit(5),
    db.select().from(invoices).where(ilike(invoices.invoiceNumber, like)).orderBy(desc(invoices.createdAt)).limit(5),
  ])

  const results: SearchResult[] = [
    ...projRows.map((p) => ({ type: 'project' as const, id: p.id, title: p.name, subtitle: p.projectCode, url: `/admin/projects/${p.id}` })),
    ...clientRows.map((c) => ({ type: 'client' as const, id: c.id, title: c.name, subtitle: c.email, url: `/admin/clients/${c.id}` })),
    ...invRows.map((i) => ({ type: 'invoice' as const, id: i.id, title: i.invoiceNumber, subtitle: `KES ${i.amount}`, url: `/admin/finance` })),
  ]

  return NextResponse.json({ results })
}
