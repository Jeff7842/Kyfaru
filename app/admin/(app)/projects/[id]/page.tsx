import { notFound } from 'next/navigation'
import { db } from '@/lib/admin/db'
import { projects } from '@/lib/admin/db/schema'
import { eq } from 'drizzle-orm'
import ProjectDetailsView from '@/components/admin/projects/ProjectDetailsView'

export const dynamic = 'force-dynamic'

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await db.query.projects.findFirst({ where: eq(projects.id, id), with: { client: true } })
  if (!project) notFound()

  return <ProjectDetailsView projectId={id} initialProject={project} />
}
