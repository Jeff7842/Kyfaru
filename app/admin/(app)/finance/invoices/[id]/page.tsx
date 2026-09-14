import { notFound } from 'next/navigation'
import { db } from '@/lib/admin/db'
import { invoices } from '@/lib/admin/db/schema'
import { eq } from 'drizzle-orm'
import InvoiceEditor from '@/components/admin/finance/InvoiceEditor'

export default async function InvoiceEditorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const invoice = await db.query.invoices.findFirst({
    where: eq(invoices.id, id),
    with: { client: true, project: true },
  })
  if (!invoice) notFound()

  return <InvoiceEditor invoiceId={id} initialInvoice={invoice} />
}
