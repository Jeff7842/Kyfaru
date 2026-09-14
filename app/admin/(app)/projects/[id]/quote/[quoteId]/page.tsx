import { notFound } from 'next/navigation'
import { db } from '@/lib/admin/db'
import { projects, quotes } from '@/lib/admin/db/schema'
import { eq, and } from 'drizzle-orm'
import QuoteEditor from '@/components/admin/projects/QuoteEditor'

export default async function ProjectQuoteEditorPage({
  params,
}: {
  params: Promise<{ id: string; quoteId: string }>
}) {
  const { id, quoteId } = await params
  const [project, quote] = await Promise.all([
    db.query.projects.findFirst({ where: eq(projects.id, id), with: { client: true } }),
    db.query.quotes.findFirst({ where: and(eq(quotes.id, quoteId), eq(quotes.projectId, id)) }),
  ])
  if (!project || !quote) notFound()

  return <QuoteEditor projectId={id} quoteId={quoteId} initialProject={project} initialQuote={quote} />
}
