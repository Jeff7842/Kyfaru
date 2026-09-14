import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { invoices } from '@/lib/admin/db/schema'
import { eq } from 'drizzle-orm'
import { buildInvoicePdf, type InvoiceLineItem } from '@/lib/admin/docs/invoice-pdf'
import { docFilename } from '@/lib/admin/docs/filename'

export const runtime = 'nodejs'

const money = (n: number) =>
  'KES ' + new Intl.NumberFormat('en-KE', { maximumFractionDigits: 2 }).format(n)

const ordinal = (d: number) => {
  if (d > 3 && d < 21) return `${d}th`
  switch (d % 10) {
    case 1: return `${d}st`
    case 2: return `${d}nd`
    case 3: return `${d}rd`
    default: return `${d}th`
  }
}
const fmtDate = (d: Date) =>
  `${ordinal(d.getDate())} ${d.toLocaleString('en-US', { month: 'long' })} ${d.getFullYear()}`

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const invoice = await db.query.invoices.findFirst({
    where: eq(invoices.id, id),
    with: { client: true, project: true },
  })
  if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })

  const raw = (invoice.lineItems as { product: string; quantity: number; price: number }[]) ?? []
  const items: InvoiceLineItem[] = raw.length
    ? raw.map((it) => ({
        product: it.product,
        price: money(Number(it.price) || 0),
        quantity: it.quantity,
        total: money((Number(it.price) || 0) * (Number(it.quantity) || 0)),
      }))
    : [
        // Legacy invoices created before line items were required - the PDF
        // has nothing real to itemise, so fall back to one row reflecting
        // the invoice's own total rather than rendering a blank table.
        // Edit the invoice and add real line items to replace this.
        {
          product: 'Professional services',
          price: money(Math.max(0, Number(invoice.amount) - Number(invoice.vatAmount ?? 0))),
          quantity: 1,
          total: money(Math.max(0, Number(invoice.amount) - Number(invoice.vatAmount ?? 0))),
        },
      ]

  const pdf = await buildInvoicePdf({
    invoiceNumber: invoice.invoiceNumber,
    date: fmtDate(invoice.issuedAt ?? invoice.createdAt),
    paid: invoice.status === 'paid',
    paymentName: 'Jefferson Kimotho',
    paymentAccount: '0040 7386 0361 50',
    paymentBank: 'I&M Bank',
    clientName: invoice.client?.name,
    items,
    taxes: money(Number(invoice.vatAmount) || 0),
    total: money(Number(invoice.amount) || 0),
  })

  return new NextResponse(Buffer.from(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${docFilename(invoice.project?.name, 'Invoice')}"`,
    },
  })
}
