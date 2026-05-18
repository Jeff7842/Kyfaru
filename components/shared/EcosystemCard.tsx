// ============================================================
// ECOSYSTEM CARD
// One branch in the 2x2 ecosystem grid. Ghost border, hover lift,
// accent-coloured icon, gold tagline.
// ============================================================

import Link from 'next/link'
import { Icon } from '@iconify/react'
import type { EcosystemBranch } from '@/types'
import { cn } from '@/lib/utils'

interface EcosystemCardProps {
  branch: EcosystemBranch
}

/**
 * One ecosystem branch card.
 */
export default function EcosystemCard({ branch }: EcosystemCardProps) {
  return (
    <Link
      href={branch.href}
      className="group relative block bg-ky-surface ghost-border ky-rounded card-lift p-8 md:p-10"
    >
      {/* Icon block */}
      <div
        className={cn(
          'w-14 h-14 mb-7 flex items-center justify-center bg-ky-raised',
          branch.accentClass
        )}
      >
        <Icon icon={branch.icon} className="w-7 h-7" />
      </div>

      {/* Name */}
      <h3 className="text-2xl md:text-3xl font-semibold text-ky-ivory tracking-tight mb-2 font-display group-hover:text-ky-gold transition-colors">
        {branch.name}
      </h3>

      {/* Tagline — gold */}
      <p className={cn('text-sm font-medium tracking-wide mb-5 font-display', branch.accentClass)}>
        {branch.tagline}
      </p>

      {/* Description */}
      <p className="text-ky-muted leading-relaxed font-inter mb-6">
        {branch.description}
      </p>

      {/* Learn-more arrow */}
      <div className="flex items-center gap-2 text-ky-ivory/70 group-hover:text-ky-gold transition-colors text-sm font-medium font-display">
        <span className="tracking-wider">LEARN MORE</span>
        <Icon
          icon="heroicons:arrow-right"
          className="w-4 h-4 transition-transform group-hover:translate-x-1"
        />
      </div>
    </Link>
  )
}
