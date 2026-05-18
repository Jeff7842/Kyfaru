// ============================================================
// INDUSTRY CARD
// Icon + title + description, ghost border, hover lift.
// ============================================================

import { Icon } from '@iconify/react'
import type { Industry } from '@/types'

interface IndustryCardProps {
  industry: Industry
}

/**
 * One industry card in the 4-col Industries grid.
 */
export default function IndustryCard({ industry }: IndustryCardProps) {
  return (
    <div className="group bg-ky-surface ghost-border ky-rounded card-lift p-7 md:p-8">
      {/* Icon */}
      <div className="w-12 h-12 mb-6 flex items-center justify-center bg-ky-raised text-ky-green-hi group-hover:text-ky-gold transition-colors">
        <Icon icon={industry.icon} className="w-6 h-6" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-ky-ivory tracking-tight mb-2 font-display">
        {industry.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-ky-muted leading-relaxed font-inter">
        {industry.description}
      </p>
    </div>
  )
}
