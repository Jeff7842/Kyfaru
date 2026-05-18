'use client'

// ============================================================
// ECOSYSTEM SECTION — Hierarchical Grid
// Asymmetric prestige layout:
//   Row 1 — Mwamba AI hero card (60% wide) + Stackable tall card (40%)
//   Row 2 — Kiliforge + Kyfaru Core, equal halves
// Each card uses motion.dev stagger reveal, ambient glow, and a
// large background icon watermark for visual hierarchy.
// ============================================================

import { motion } from 'motion/react'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import SectionHeading from '@/components/shared/SectionHeading'
import { ecosystemBranches } from '@/lib/data/ecosystem'
import type { EcosystemBranch } from '@/types'
import { cn } from '@/lib/utils'

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}
const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.7, 0.3, 1] as const } },
}

/**
 * Renders the Kyfaru Ecosystem hierarchical grid section.
 */
export default function EcosystemSection() {
  // Map branches by id so the JSX layout reads naturally
  const byId = Object.fromEntries(ecosystemBranches.map((b) => [b.id, b])) as Record<string, EcosystemBranch>
  const mwamba = byId['mwamba-ai']
  const stackable = byId['stackable']
  const kiliforge = byId['kiliforge']
  const core = byId['kyfaru-core']

  return (
    <section className="relative bg-ky-base py-24 md:py-32 overflow-hidden">
      {/* Ambient decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/3 w-[520px] h-[520px] rounded-full bg-ky-gold/5 blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="mb-14 md:mb-20 max-w-3xl">
          <SectionHeading
            label="The Kyfaru Ecosystem"
            headline="One ecosystem. Four specialised arms."
            subtitle="Kyfaru is more than a tech company. It is an ecosystem of focused entities — each solving a specific layer of Africa's digital transformation."
          />
        </div>

        <motion.div
          variants={CONTAINER_VARIANTS}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-12 gap-5 md:gap-6 auto-rows-fr"
        >
          {/* Row 1 — Mwamba AI large featured card (60%) */}
          <FeaturedCard branch={mwamba} className="col-span-12 lg:col-span-7" />

          {/* Row 1 — Stackable tall card (40%) */}
          <TallCard branch={stackable} className="col-span-12 lg:col-span-5" />

          {/* Row 2 — Equal halves */}
          <StandardCard branch={kiliforge} className="col-span-12 md:col-span-6" />
          <StandardCard branch={core} className="col-span-12 md:col-span-6" />
        </motion.div>
      </div>
    </section>
  )
}

/* ============================================================
   FEATURED CARD — large hero panel for Mwamba AI
   ============================================================ */
function FeaturedCard({ branch, className }: { branch: EcosystemBranch; className?: string }) {
  return (
    <motion.article
      variants={CARD_VARIANTS}
      className={cn(
        'group relative overflow-hidden bg-ky-surface ghost-border p-8 md:p-10 lg:p-12 flex flex-col',
        'min-h-[420px] ambient-glow',
        className
      )}
    >
      {/* Coming Soon badge */}
      <span className="absolute top-4 right-4 z-10 bg-ky-gold/15 text-ky-gold text-[10px] tracking-[0.2em] font-display font-semibold px-3 py-1.5 ky-rounded-sm">
        COMING SOON
      </span>

      {/* Background gold radial glow */}
      <span className="pointer-events-none absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full bg-ky-gold/15 blur-[100px]" />
      <span className="pointer-events-none absolute inset-0 tessellation-bg opacity-25" />

      {/* Giant background icon watermark */}
      <Icon
        icon={branch.icon}
        className="pointer-events-none absolute -right-12 -bottom-16 w-[340px] h-[340px] text-ky-gold/[0.05]"
      />

      <div className="relative flex items-center gap-3 mb-6">
        <span className="text-[10px] font-display tracking-[0.3em] uppercase text-ky-gold animate-terminal-blink">
          [ Core Intelligence ]
        </span>
      </div>

      <div className="relative flex items-center gap-4 mb-5">
        <div className="w-14 h-14 flex items-center justify-center bg-ky-raised ghost-border text-ky-gold">
          <Icon icon={branch.icon} className="w-7 h-7" />
        </div>
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold tracking-tight text-ky-ivory leading-tight">
          {branch.name}
        </h3>
      </div>

      <p className="relative text-ky-gold-hi font-display tracking-wider text-sm md:text-base mb-5">
        {branch.tagline}
      </p>

      <p className="relative text-ky-muted leading-relaxed text-base md:text-lg max-w-xl flex-1">
        {branch.description}
      </p>

      <span
        className="relative mt-8 inline-flex items-center gap-3 text-ky-faint text-xs font-display tracking-[0.25em] uppercase cursor-default w-fit"
      >
        <span>Explore Mwamba AI</span>
        <Icon icon="heroicons:arrow-right" className="w-4 h-4" />
      </span>
    </motion.article>
  )
}

/* ============================================================
   TALL CARD — Stackable, narrower full-height column
   ============================================================ */
function TallCard({ branch, className }: { branch: EcosystemBranch; className?: string }) {
  return (
    <motion.article
      variants={CARD_VARIANTS}
      className={cn(
        'group relative overflow-hidden bg-ky-surface ghost-border p-8 md:p-10 flex flex-col min-h-[420px]',
        className
      )}
    >
      {/* Coming Soon badge */}
      <span className="absolute top-4 right-4 z-10 bg-ky-green-hi/15 text-ky-green-hi text-[10px] tracking-[0.2em] font-display font-semibold px-3 py-1.5 ky-rounded-sm">
        COMING SOON
      </span>

      <span className="pointer-events-none absolute -top-24 -right-24 w-[300px] h-[300px] rounded-full bg-ky-green-hi/10 blur-[80px]" />
      <Icon icon={branch.icon} className="pointer-events-none absolute -bottom-10 -right-6 w-[200px] h-[200px] text-ky-green-hi/[0.06]" />

      <div className="relative text-[10px] font-display tracking-[0.3em] uppercase text-ky-green-hi mb-6">
        [ Education ]
      </div>

      <div className="relative w-12 h-12 flex items-center justify-center bg-ky-raised ghost-border text-ky-green-hi mb-6">
        <Icon icon={branch.icon} className="w-6 h-6" />
      </div>

      <h3 className="relative text-2xl md:text-3xl font-display font-semibold text-ky-ivory tracking-tight leading-tight mb-3">
        {branch.name}
      </h3>
      <p className="relative text-ky-green-hi font-display tracking-wider text-sm mb-5">
        {branch.tagline}
      </p>
      <p className="relative text-ky-muted leading-relaxed text-sm md:text-base flex-1">
        {branch.description}
      </p>

      <span
        className="relative mt-6 inline-flex items-center gap-2 text-ky-faint text-xs font-display tracking-[0.25em] uppercase cursor-default w-fit"
      >
        <span>Discover Stackable</span>
        <Icon icon="heroicons:arrow-right" className="w-3.5 h-3.5" />
      </span>
    </motion.article>
  )
}

/* ============================================================
   STANDARD CARD — Row 2 entries
   ============================================================ */
function StandardCard({ branch, className }: { branch: EcosystemBranch; className?: string }) {
  return (
    <motion.article
      variants={CARD_VARIANTS}
      className={cn(
        'group relative overflow-hidden bg-ky-surface ghost-border p-8 md:p-10 flex flex-col card-lift min-h-[280px]',
        className
      )}
    >
      <Icon icon={branch.icon} className={cn('pointer-events-none absolute -right-8 -bottom-8 w-[170px] h-[170px]', branch.accentClass, 'opacity-[0.06]')} />

      <div className={cn('relative w-11 h-11 flex items-center justify-center bg-ky-raised ghost-border mb-6', branch.accentClass)}>
        <Icon icon={branch.icon} className="w-5 h-5" />
      </div>

      <h3 className="relative text-xl md:text-2xl font-display font-semibold text-ky-ivory tracking-tight leading-tight mb-2">
        {branch.name}
      </h3>
      <p className={cn('relative font-display tracking-wider text-xs md:text-sm mb-4', branch.accentClass)}>
        {branch.tagline}
      </p>
      <p className="relative text-ky-muted leading-relaxed text-sm flex-1">
        {branch.description}
      </p>

      <Link
        href={branch.href ?? '#'}
        className="relative mt-5 inline-flex items-center gap-2 text-ky-ivory/80 text-[11px] font-display tracking-[0.25em] uppercase hover:text-ky-gold transition-colors w-fit"
      >
        <span>Learn More</span>
        <Icon icon="heroicons:arrow-up-right" className="w-3 h-3" />
      </Link>
    </motion.article>
  )
}
