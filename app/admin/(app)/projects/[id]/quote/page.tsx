import { notFound } from 'next/navigation'
import { db } from '@/lib/admin/db'
import { projects } from '@/lib/admin/db/schema'
import { eq } from 'drizzle-orm'
import QuoteEditor from '@/components/admin/projects/QuoteEditor'

export default async function ProjectQuotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await db.query.projects.findFirst({ where: eq(projects.id, id), with: { client: true } })
  if (!project) notFound()

  return <QuoteEditor projectId={id} initialProject={project} />
}
