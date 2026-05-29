import HeroSection from '@/components/admin/layout/HeroSection'
import ProjectsTable from '@/components/admin/projects/ProjectsTable'

export const metadata = { title: 'Projects — Kyfaru Admin' }
export const dynamic = 'force-dynamic'

export default function ProjectsPage() {
  return (
    <div className="space-y-6 kf-anim-in">
      <HeroSection title="Projects" subtitle="Manage all client projects and their status." />
      <ProjectsTable />
    </div>
  )
}
