import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { projects, quotes } from '@/lib/admin/db/schema'
import { eq, and } from 'drizzle-orm'
import { buildQuotePdf, type QuoteLineItem, type ToolPricing } from '@/lib/admin/docs/quote-pdf'

export const runtime = 'nodejs'

const fmtDate = (d?: Date | string | null) => (d ? new Date(d).toLocaleDateString('en-GB') : '')
const firstWord = (s: string | null | undefined) => (s ?? '').trim().split(/\s+/)[0] || 'Document'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string; quoteId: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const preview = new URL(req.url).searchParams.get('preview') === '1'
  const { id, quoteId } = await params
  const [project, quote] = await Promise.all([
    db.query.projects.findFirst({ where: eq(projects.id, id), with: { client: true } }),
    db.query.quotes.findFirst({ where: and(eq(quotes.id, quoteId), eq(quotes.projectId, id)) }),
  ])
  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  if (!quote) return NextResponse.json({ error: 'Quote not found' }, { status: 404 })

  // The editable per-quote tools pricing table - one-time tools fold into the
  // main line-items total as one generic "Tools & Equipment" row, monthly/
  // annual ones show as aggregate recurring-cost lines in the payment
  // schedule. Neither ever itemises by tool name on this client-facing doc.
  const toolsPricing = (quote.toolsPricing as ToolPricing[] | null) ?? []
  const oneTimeTotal = quote.includeToolsRow
    ? toolsPricing.filter((t) => t.duration === 'one_time').reduce((s, t) => s + t.price, 0)
    : 0
  const recurringMonthly = quote.includeToolsRow
    ? toolsPricing.filter((t) => t.duration === 'monthly').reduce((s, t) => s + t.price, 0)
    : 0
  const recurringAnnual = quote.includeToolsRow
    ? toolsPricing.filter((t) => t.duration === 'annual').reduce((s, t) => s + t.price, 0)
    : 0
  const items: QuoteLineItem[] = [...((quote.lineItems as QuoteLineItem[]) ?? [])]
  if (oneTimeTotal > 0) items.push({ description: 'Tools & Equipment', quantity: 1, unitPrice: oneTimeTotal })

  const buf = await buildQuotePdf({
    quoteNumber: quote.quoteNumber,
    quoteDate: fmtDate(quote.quoteDate),
    dueDate: fmtDate(quote.dueDate),
    clientName: project.client?.name,
    clientAddress: project.client?.address ?? undefined,
    projectTitle: project.name,
    items,
    taxRate: Number(quote.taxRate ?? 0),
    discount: Number(quote.discount ?? 0),
    currency: quote.currency,
    accentColor: quote.accentColor,
    contactEmail: quote.contactEmail,
    contactPhone: quote.contactPhone,
    depositEnabled: quote.depositEnabled,
    depositPercent: Number(quote.depositPercent ?? 50),
    maintenanceEnabled: quote.maintenanceEnabled,
    maintenanceFee: Number(quote.maintenanceFee ?? 0),
    recurringMonthly,
    recurringAnnual,
    termsAndConditions: quote.termsAndConditions ?? undefined,
  })

  return new NextResponse(new Uint8Array(buf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `${preview ? 'inline' : 'attachment'}; filename="[${firstWord(project.name)}] Quote ${quote.quoteNumber}.pdf"`,
    },
  })
}
