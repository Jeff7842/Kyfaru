// ============================================================
// PROJECT CARD
// Featured/listing card with live thum.io screenshot, tags,
// triangular cut-corner accent, and gold arrow on hover.
// ============================================================

import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import type { Project } from '@/types'
import { getProjectScreenshotUrl, cn } from '@/lib/utils'

interface ProjectCardProps {
  project: Project
  /** Use a larger size variant when shown as a featured highlight */
  variant?: 'default' | 'featured'
}

/**
 * Renders a portfolio project card with thum.io live screenshot.
 * When comingSoon is true the card is dimmed, non-interactive, and shows a badge.
 */
export default function ProjectCard({ project, variant = 'default' }: ProjectCardProps) {
  const screenshotUrl = getProjectScreenshotUrl(project.liveUrl)
  const isFeatured = variant === 'featured'
  const isComingSoon = !!project.comingSoon

  const cardClasses = cn(
    'group relative block bg-ky-surface ghost-border overflow-hidden corner-cut-tr',
    isFeatured ? 'col-span-2' : '',
    isComingSoon ? 'opacity-55 cursor-not-allowed select-none' : 'card-lift'
  )

  const inner = (
    <>
      {/* Coming Soon badge */}
      {isComingSoon && (
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 bg-ky-raised ghost-border ky-rounded-sm">
          <Icon icon="heroicons:clock" className="w-3 h-3 text-ky-gold" />
          <span className="text-[9px] font-display tracking-[0.25em] uppercase text-ky-gold">
            Coming Soon
          </span>
        </div>
      )}

      {/* Top-right gold triangle accent */}
      <span className="absolute top-0 right-0 w-[18px] h-[18px] bg-ky-gold z-10" />

      {/* Screenshot */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-ky-dark">
        {screenshotUrl ? (
          <Image
            src={screenshotUrl}
            alt={`${project.title} live preview`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={cn(
              'object-cover object-top transition-transform duration-700',
              !isComingSoon && 'group-hover:scale-105'
            )}
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ky-faint">
            <Icon icon="heroicons:photo" className="w-12 h-12" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ky-base/80 via-transparent to-transparent" />
      </div>

      {/* Text block */}
      <div className="p-6 md:p-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium tracking-widest uppercase px-2.5 py-1 bg-ky-raised text-ky-gold-hi font-display"
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className={cn(
          'text-xl md:text-2xl font-semibold text-ky-ivory tracking-tight mb-3 font-display transition-colors',
          !isComingSoon && 'group-hover:text-ky-gold'
        )}>
          {project.title}
        </h3>

        <p className="text-sm md:text-base text-ky-muted leading-relaxed font-inter mb-5">
          {project.description}
        </p>

        {isComingSoon ? (
          <div className="flex items-center gap-2 text-ky-faint text-sm font-medium font-display">
            <Icon icon="heroicons:lock-closed" className="w-4 h-4" />
            <span className="tracking-wider">NOT YET LIVE</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-ky-gold text-sm font-medium font-display">
            <span className="tracking-wider">VIEW LIVE</span>
            <Icon
              icon="heroicons:arrow-up-right"
              className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </div>
        )}
      </div>
    </>
  )

  if (isComingSoon) {
    return <div className={cardClasses}>{inner}</div>
  }

  return (
    <Link
      href={project.liveUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cardClasses}
    >
      {inner}
    </Link>
  )
}
