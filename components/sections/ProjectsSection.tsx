// ============================================================
// PROJECTS SECTION
// Featured-projects grid with header + "view all" link.
// Pulls from getFeaturedProjects() and renders ProjectCard.
// ============================================================

import Link from 'next/link'
import { Icon } from '@iconify/react'
import SectionHeading from '@/components/shared/SectionHeading'
import ProjectCard from '@/components/shared/ProjectCard'
import { getFeaturedProjects } from '@/lib/data/projects'

/**
 * Renders the homepage Featured Projects section.
 */
export default function ProjectsSection() {
  const featured = getFeaturedProjects()

  return (
    <section className="relative bg-ky-surface py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header row — section heading left, "view all" link right */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <SectionHeading
            label="Featured Work"
            headline="Real systems. Real businesses. Real results."
            subtitle="A selection of recent Kyfaru projects shipping production work across Africa."
          />

          <Link
            href="/projects"
            className="group inline-flex items-center gap-3 text-ky-ivory hover:text-ky-gold transition-colors text-sm font-medium font-display tracking-wider whitespace-nowrap"
          >
            <span>VIEW ALL PROJECTS</span>
            <Icon
              icon="heroicons:arrow-right"
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Project grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {featured.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
