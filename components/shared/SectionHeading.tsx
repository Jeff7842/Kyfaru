// ============================================================
// SECTION HEADING COMPONENT
// label → headline → subtitle hierarchy used at the top of every
// landing section. Stitch directive: large editorial display +
// gold tracked label + muted body subtitle.
// ============================================================

import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  label: string
  headline: string
  subtitle?: string
  centered?: boolean
  /** Optional accent style for label dot color */
  accent?: 'gold' | 'green'
}

/**
 * Renders the three-level section heading used across all landing sections.
 */
export default function SectionHeading({
  label,
  headline,
  subtitle,
  centered = false,
  accent = 'gold',
}: SectionHeadingProps) {
  const align = centered ? 'text-center mx-auto items-center' : 'text-left items-start'
  const dotColor = accent === 'gold' ? 'bg-ky-gold' : 'bg-ky-green-hi'

  return (
    <div className={cn('flex flex-col gap-5 max-w-3xl', align)}>
      {/* Small label — accent dot + tracked uppercase */}
      <div className={cn('flex items-center gap-3', centered && 'justify-center')}>
        <span className={cn('w-1.5 h-1.5 rounded-full', dotColor)} />
        <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-ky-gold font-display">
          {label}
        </span>
      </div>

      {/* Main headline — large display, tight leading */}
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05] text-ky-ivory font-display">
        {headline}
      </h2>

      {subtitle && (
        <p className="text-base md:text-lg text-ky-muted leading-relaxed max-w-2xl font-inter">
          {subtitle}
        </p>
      )}
    </div>
  )
}
