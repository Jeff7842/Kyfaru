import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { quotes, projects, type Quote } from '@/lib/admin/db/schema'
import { requireRole, type Role } from '@/lib/admin/permissions'
import { logAudit } from '@/lib/admin/audit'
import { paginatedSearch } from '@/lib/admin/db/query-helpers'
import { priceFor, type StackItem } from '@/lib/admin/constants/tech-catalog'
import type { ProjectRequirementsDoc } from '@/lib/admin/types/project-requirements'
import type { ToolPricing, QuoteLineItem } from '@/lib/admin/docs/quote-pdf'
import { computeQuoteTotal } from '@/lib/admin/docs/quote-totals'
import { MONTH_CODE } from '@/lib/admin/docs/document-code'
import { eq, desc, sql } from 'drizzle-orm'

const DEFAULT_TERMS = 'This quote is valid for 14 days from the quote date. First 30 days of maintenance after delivery are free; a monthly maintenance fee applies thereafter. Any feature requested outside this scope requires a separate quote and invoice.'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { searchParams } = new URL(req.url)
  const page = Number(searchParams.get('page') ?? 0)
  const pageSize = Number(searchParams.get('pageSize') ?? 20)
  const q = searchParams.get('q') ?? undefined

  const { rows, total } = await paginatedSearch<Quote>({
    table: quotes,
    searchColumns: [quotes.quoteNumber, quotes.title],
    page,
    pageSize,
    q,
    orderBy: [desc(quotes.createdAt)],
    baseWhere: eq(quotes.projectId, id),
  })

  const quotesWithAmount = rows.map((quote) => ({
    ...quote,
    amount: computeQuoteTotal({
      lineItems: quote.lineItems as QuoteLineItem[] | null,
      toolsPricing: quote.toolsPricing as ToolPricing[] | null,
      includeToolsRow: quote.includeToolsRow,
      discount: quote.discount,
      taxRate: quote.taxRate,
    }),
  }))

  return NextResponse.json({ quotes: quotesWithAmount, total, page, pageSize })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  requireRole(session.user.role as Role, 'sales')

  const { id } = await params
  const project = await db.query.projects.findFirst({ where: eq(projects.id, id) })
  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

  const body = await req.json().catch(() => ({}))

  // Same "month + running total" concept as the Agreement/SOW document code
  // (getOrCreateDocumentCode) - QT- prefix keeps it visually distinct from
  // that KY-<Mon><NNNN> scheme (quotes have their own atomic sequence, a
  // running count of quotations specifically, never reset monthly).
  const seq = await db.execute<{ n: number }>(sql`SELECT nextval('quote_number_seq') AS n`)
  const monthCode = MONTH_CODE[new Date().getMonth()]
  const quoteNumber = `QT-${monthCode}${String(seq.rows[0].n).padStart(4, '0')}`
  const dueDate = new Date(Date.now() + 14 * 86400000)

  // Seed the editable per-quote pricing table from the project's selected
  // tools + the catalog's standard fee - a one-time snapshot the admin then
  // freely edits (price, duration) without touching the project's tools list.
  const projectTools = ((project.scopeDocument as ProjectRequirementsDoc | null)?.tools ?? []) as StackItem[]
  const toolsPricing: ToolPricing[] = projectTools
    .filter((t) => priceFor(t) > 0)
    .map((t) => ({ name: t.name, price: priceFor(t), duration: 'one_time' as const }))

  const [created] = await db
    .insert(quotes)
    .values({
      quoteNumber,
      projectId: project.id,
      clientId: project.clientId,
      title: typeof body.title === 'string' && body.title.trim() ? body.title.trim() : null,
      dueDate,
      lineItems: [],
      toolsPricing,
      termsAndConditions: DEFAULT_TERMS,
      createdById: session.user.id as string,
    })
    .returning()

  await logAudit({
    userId: session.user.id as string,
    action: 'quote.create',
    entityType: 'quote',
    entityId: created.id,
    after: { quoteNumber: created.quoteNumber },
    title: `Quote ${created.quoteNumber} created`,
    icon: 'plus',
  })

  return NextResponse.json({ quote: created }, { status: 201 })
}
