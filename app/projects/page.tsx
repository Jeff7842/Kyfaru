'use client'

// ============================================================
// PROJECTS PAGE
// Full portfolio with tag filter chip bar. Uses getAllProjects().
// ============================================================

import { useMemo, useState } from 'react'
import Header from '@/components/header/header'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/shared/PageHero'
import ProjectCard from '@/components/shared/ProjectCard'
import CTASection from '@/components/sections/CTASection'
import { getAllProjects } from '@/lib/data/projects'
import { cn } from '@/lib/utils'

export default function ProjectsPage() {
  const allProjects = getAllProjects()
  const [activeTag, setActiveTag] = useState<string>('All')

  // Build the tag filter list from all unique project tags
  const tags = useMemo(() => {
    try {
      const set = new Set<string>()
      allProjects.forEach((p) => p.tags.forEach((t) => set.add(t)))
      return ['All', ...Array.from(set)]
    } catch (error) {
      console.error('[ProjectsPage] Building tags failed:', error)
      return ['All']
    }
  }, [allProjects])

  // Filter the visible projects based on active tag
  const visibleProjects = useMemo(() => {
    try {
      if (activeTag === 'All') return allProjects
      return allProjects.filter((p) => p.tags.includes(activeTag))
    } catch (error) {
      console.error('[ProjectsPage] Filter failed:', error)
      return allProjects
    }
  }, [allProjects, activeTag])

  return (
    <div className="min-h-screen bg-ky-base">
      <Header />

      <PageHero
        label="Portfolio"
        labelIcon="heroicons:rectangle-stack"
        headline={{ lead: 'Projects shipping', accent: 'across Africa', tail: '.' }}
        subtitle="A selection of the systems we have built. Click any card to see it live."
      />

      {/* Filter bar */}
      <section className="bg-ky-base pt-16 pb-8 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={cn(
                  'px-5 py-2.5 text-xs font-medium tracking-[0.15em] uppercase font-display transition-all',
                  activeTag === tag
                    ? 'bg-ky-gold text-ky-base'
                    : 'bg-ky-surface ghost-border text-ky-muted hover:text-ky-ivory hover:border-ky-border-hi'
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-ky-base pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-6">
          {visibleProjects.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              {visibleProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-ky-muted font-inter">
              No projects match this filter yet.
            </div>
          )}
        </div>
      </section>

      <CTASection />
      <Footer />
    </div>
  )
}
