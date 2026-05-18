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
 */
export default function ProjectCard({ project, variant = 'default' }: ProjectCardProps) {
  const screenshotUrl = getProjectScreenshotUrl(project.liveUrl)
  const isFeatured = variant === 'featured'

  return (
    <Link
      href={project.liveUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group relative block bg-ky-surface ghost-border card-lift overflow-hidden',
        'corner-cut-tr',
        isFeatured ? 'col-span-2' : ''
      )}
    >
      {/* Top-right gold triangle accent — sits in the clip cut */}
      <span className="absolute top-0 right-0 w-[18px] h-[18px] bg-ky-gold z-10" />

      {/* Screenshot — fixed aspect ratio */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-ky-dark">
        {screenshotUrl ? (
          <Image
            src={screenshotUrl}
            alt={`${project.title} live preview`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ky-faint">
            <Icon icon="heroicons:photo" className="w-12 h-12" />
          </div>
        )}
        {/* Bottom dark gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-ky-base/80 via-transparent to-transparent" />
      </div>

      {/* Text block */}
      <div className="p-6 md:p-8">
        {/* Tag pills */}
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

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-semibold text-ky-ivory tracking-tight mb-3 font-display group-hover:text-ky-gold transition-colors">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-sm md:text-base text-ky-muted leading-relaxed font-inter mb-5">
          {project.description}
        </p>

        {/* Gold arrow */}
        <div className="flex items-center gap-2 text-ky-gold text-sm font-medium font-display">
          <span className="tracking-wider">VIEW LIVE</span>
          <Icon
            icon="heroicons:arrow-up-right"
            className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </div>
      </div>
    </Link>
  )
}
