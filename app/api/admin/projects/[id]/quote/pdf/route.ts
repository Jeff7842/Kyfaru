import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { projects } from '@/lib/admin/db/schema'
import { eq } from 'drizzle-orm'
import { buildQuotePdf, type QuoteLineItem } from '@/lib/admin/docs/quote-pdf'
import { getOrCreateQuote } from '@/app/api/admin/projects/[id]/quote/route'
import { priceFor, type StackItem } from '@/lib/admin/constants/tech-catalog'
import type { ProjectRequirementsDoc } from '@/lib/admin/types/project-requirements'

export const runtime = 'nodejs'

const fmtDate = (d?: Date | string | null) => (d ? new Date(d).toLocaleDateString('en-GB') : '')
const firstWord = (s: string | null | undefined) => (s ?? '').trim().split(/\s+/)[0] || 'Document'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const project = await db.query.projects.findFirst({ where: eq(projects.id, id), with: { client: true } })
  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

  const quote = await getOrCreateQuote(id, project.clientId, session.user.id as string)

  // Standard tool-integration fees are shown to the client as one generic
  // "Tools & Equipment" line, never broken out by tool name - see priceFor()'s
  // own docs on why this stays a derived total, not a saved line item.
  const projectTools = ((project.scopeDocument as ProjectRequirementsDoc | null)?.tools ?? []) as StackItem[]
  const toolsTotal = quote.includeToolsRow ? projectTools.reduce((s, t) => s + priceFor(t), 0) : 0
  const items: QuoteLineItem[] = [...((quote.lineItems as QuoteLineItem[]) ?? [])]
  if (toolsTotal > 0) items.push({ description: 'Tools & Equipment', quantity: 1, unitPrice: toolsTotal })

  const buf = await buildQuotePdf({
    quoteNumber: quote.quoteNumber,
    quoteDate: fmtDate(quote.quoteDate),
    dueDate: fmtDate(quote.dueDate),
    clientName: project.client?.name,
    clientAddress: project.client?.address ?? undefined,
    projectTitle: project.name,
    items,
    taxRate: Number(quote.taxRate ?? 0),
    depositEnabled: quote.depositEnabled,
    depositPercent: Number(quote.depositPercent ?? 50),
    maintenanceEnabled: quote.maintenanceEnabled,
    maintenanceFee: Number(quote.maintenanceFee ?? 0),
    termsAndConditions: quote.termsAndConditions ?? undefined,
  })

  return new NextResponse(new Uint8Array(buf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="[${firstWord(project.name)}] Quote ${quote.quoteNumber}.pdf"`,
    },
  })
}
