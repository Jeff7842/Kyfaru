import { db } from '@/lib/admin/db'
import { projects } from '@/lib/admin/db/schema'
import { desc } from 'drizzle-orm'
import Link from 'next/link'
import HeroSection from '@/components/admin/layout/HeroSection'
import ProjectsTable from '@/components/admin/projects/ProjectsTable'

export const metadata = { title: 'Projects — Kyfaru Admin' }
export const dynamic = 'force-dynamic'

export default async function ProjectsPage() {
  const data = await db.query.projects.findMany({
    orderBy: [desc(projects.createdAt)],
    with: { client: true },
  })

  return (
    <div className="space-y-6 kf-anim-in">
      <HeroSection
        title="Projects"
        subtitle="Manage all client projects and their status."
        actions={
          <Link href="/admin/projects/new" className="kf-btn-primary">
            New Project
          </Link>
        }
      />
      <ProjectsTable initialData={data} />
    </div>
  )
}
