'use client'

// ============================================================
// INDUSTRIES SECTION — Horizontal Accordion
// Each industry is a vertical column. Closed state shows only the
// rotated industry name + small icon. Hover (or focus) expands
// that column to flex:5 and rotates the label back to horizontal,
// revealing icon + title + description + CTA.
//
// Inspired by the styled-components "card with rotating labels"
// concept the user shared, restyled into the Kyfaru brand:
//   • ghost-border instead of pink
//   • ky-gold accent on hover
//   • subtle ambient glow on the open panel
// ============================================================

import { useState } from 'react'
import { motion } from 'motion/react'
import { Icon } from '@iconify/react'
import SectionHeading from '@/components/shared/SectionHeading'
import { industries } from '@/lib/data/industries'
import type { Industry } from '@/types'
import { cn } from '@/lib/utils'

/**
 * Renders the Industries section as a horizontal accordion.
 */
export default function IndustriesSection() {
  // `pinnedId` survives hover-out and is set by clicking a panel.
  // `hoverId` is the transient preview while the cursor is over a slim card.
  // The actually-rendered active panel = pinnedId ?? hoverId ?? first.
  const [pinnedId, setPinnedId] = useState<string>(industries[0]?.id ?? '')
  const [hoverId, setHoverId] = useState<string | null>(null)
  const activeId = hoverId ?? pinnedId

  return (
    <section className="relative bg-ky-base py-24 md:py-32 overflow-hidden">
      {/* Ambient decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] rounded-full bg-ky-green-hi/10 blur-[120px]" />
        <div className="absolute -bottom-24 right-0 w-[420px] h-[420px] rounded-full bg-ky-gold/8 blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="mb-12 md:mb-16 max-w-3xl"
        >
          <SectionHeading
            label="Industries We Serve"
            headline="Built for every kind of business."
            subtitle="From schools to fintechs, hospitals to logistics, public agencies to private startups — we design systems that fit each industry's reality."
          />
          <div className="mt-6 inline-flex items-center gap-3 text-[11px] font-display tracking-[0.25em] text-ky-faint">
            <span className="w-1.5 h-1.5 rounded-full bg-ky-green-hi animate-dot-pulse" />
            <span>{industries.length} industries served</span>
          </div>
        </motion.div>

        {/* Accordion — horizontal on md+, vertical stacked on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row gap-3 md:gap-4 md:h-[480px] w-full"
          onMouseLeave={() => setHoverId(null)}
        >
          {industries.map((industry, i) => (
            <IndustryAccordionItem
              key={industry.id}
              industry={industry}
              index={i}
              total={industries.length}
              isActive={activeId === industry.id}
              isPinned={pinnedId === industry.id}
              onHover={() => setHoverId(industry.id)}
              onClick={() => {
                setPinnedId((prev) => (prev === industry.id ? industries[0]?.id ?? '' : industry.id))
              }}
            />
          ))}
        </motion.div>

        {/* Pin status hint */}
        <div className="mt-6 flex items-center gap-2 text-[11px] font-display tracking-[0.25em] uppercase text-ky-faint">
          <Icon icon="heroicons:cursor-arrow-rays" className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Hover to preview · Click to pin</span>
          <span className="md:hidden">Tap to expand</span>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   ACCORDION ITEM
   ============================================================ */
function IndustryAccordionItem({
  industry,
  index,
  total,
  isActive,
  isPinned,
  onHover,
  onClick,
}: {
  industry: Industry
  index: number
  total: number
  isActive: boolean
  isPinned: boolean
  onHover: () => void
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onMouseEnter={onHover}
      onFocus={onHover}
      onClick={onClick}
      aria-label={industry.title}
      aria-expanded={isActive}
      aria-pressed={isPinned}
      className={cn(
        'group relative overflow-hidden text-left cursor-pointer',
        'bg-ky-surface ghost-border ky-rounded',
        'transition-all duration-700 ease-[cubic-bezier(0.2,0.7,0.3,1)]',
        'hover:border-ky-gold-dim focus-visible:outline-none focus-visible:border-ky-gold-dim',
        isPinned && 'border-ky-gold',
        // Desktop: horizontal flex-grow accordion
        'md:h-full',
        isActive ? 'md:flex-[5]' : 'md:flex-[1]'
      )}
      style={{ minWidth: isActive ? undefined : '70px' }}
    >
      {/* Pin marker — visible only when this panel is pinned open */}
      {isPinned && isActive && (
        <span className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2 py-1 bg-ky-base/80 ghost-border ky-rounded-sm text-[9px] font-display tracking-[0.25em] text-ky-gold-hi">
          <span className="w-1.5 h-1.5 rounded-full bg-ky-gold-hi animate-dot-pulse-gold" />
        </span>
      )}

      {/* Background glow — only visible when open */}
      <span
        className={cn(
          'pointer-events-none absolute inset-0 transition-opacity duration-700',
          isActive ? 'opacity-100' : 'opacity-0'
        )}
      >
        <span className="absolute -top-24 -right-24 w-[300px] h-[300px] rounded-full bg-ky-gold/12 blur-[80px]" />
      </span>

      {/* CLOSED STATE — Desktop: rotated vertical label | Mobile: horizontal compact row */}
      <div
        className={cn(
          'transition-opacity duration-300',
          isActive ? 'opacity-0 pointer-events-none h-0 md:h-auto' : 'opacity-100'
        )}
      >
        {/* Desktop closed: rotated label */}
        <div className="hidden md:flex absolute inset-0 flex-col items-center justify-between py-6">
          <span className="text-[10px] font-display tracking-[0.3em] text-ky-faint">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="flex-1 flex items-center justify-center">
            <span
              className="font-display font-semibold tracking-[0.32em] uppercase text-ky-ivory text-base whitespace-nowrap"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              {industry.title}
            </span>
          </div>
          <div className="w-10 h-10 flex items-center justify-center bg-ky-base ghost-border ky-rounded-sm text-ky-gold/70 group-hover:text-ky-gold transition-colors">
            <Icon icon={industry.icon} className="w-4 h-4" />
          </div>
        </div>

        {/* Mobile closed: horizontal compact row */}
        <div className="md:hidden flex items-center gap-4 p-4">
          <div className="w-10 h-10 shrink-0 flex items-center justify-center bg-ky-base ghost-border ky-rounded-sm text-ky-gold/70">
            <Icon icon={industry.icon} className="w-4 h-4" />
          </div>
          <span className="font-display font-semibold tracking-wider uppercase text-ky-ivory text-sm">
            {industry.title}
          </span>
          <Icon icon="heroicons:chevron-down" className="w-4 h-4 ml-auto text-ky-faint" />
        </div>
      </div>

      {/* OPEN STATE — full content fades in once expanded */}
      <motion.div
        initial={false}
        animate={{ opacity: isActive ? 1 : 0, height: isActive ? 'auto' : 0 }}
        transition={{ duration: 0.45, delay: isActive ? 0.25 : 0 }}
        className={cn(
          'relative md:h-full p-5 md:p-9 flex flex-col justify-between overflow-hidden',
          isActive ? 'pointer-events-auto' : 'pointer-events-none'
        )}
      >
        {/* Top row: index + counter */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-display tracking-[0.3em] text-ky-gold">
              [ {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')} ]
            </span>
          </div>
          <Icon icon="heroicons:arrow-up-right" className="w-4 h-4 text-ky-gold" />
        </div>

        {/* Middle: icon + title + description */}
        <div className="max-w-md mt-4 md:mt-0">
          <div className="w-12 h-12 md:w-14 md:h-14 mb-4 md:mb-5 flex items-center justify-center bg-ky-base ghost-border ky-rounded-sm text-ky-gold">
            <Icon icon={industry.icon} className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <h3 className="text-xl md:text-3xl font-display font-semibold text-ky-ivory tracking-tight leading-tight mb-3">
            {industry.title}
          </h3>
          <p className="text-sm md:text-base text-ky-muted leading-relaxed">
            {industry.description}
          </p>
        </div>

        {/* Footer: subtle CTA */}
        <div className="flex items-center gap-2 text-[11px] font-display tracking-[0.25em] uppercase text-ky-gold-hi mt-5 md:mt-0">
          <span>Discover Use Cases</span>
          <Icon icon="heroicons:arrow-right" className="w-3.5 h-3.5" />
        </div>
      </motion.div>
    </button>
  )
}
