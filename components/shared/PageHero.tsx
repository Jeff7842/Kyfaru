'use client'

// ============================================================
// PAGE HERO
// Reusable hero block for every inner page (About, Services,
// Solutions, Contact, Blog, etc.). Provides:
//   • Dotted decorative backdrop (ky-hero-bg-dots)
//   • Soft ambient gold/green glows
//   • Animated label chip with pulsing dots
//   • The new ky-hero-title / ky-hero-accent treatment
//   • Optional sub-CTA row (children prop)
//   • Floating ornament circles
// Everything respects light/dark theme tokens.
// ============================================================

import { motion } from 'motion/react'
import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'

interface PageHeroProps {
  /** Small uppercase eyebrow label, e.g. "About Kyfaru" */
  label: string
  /** Optional icon shown beside the label */
  labelIcon?: string
  /**
   * Headline split into two parts \u2014 the second receives the
   * .ky-hero-accent underlined-italic treatment.
   */
  headline: { lead: string; accent: string; tail?: string }
  /** Subtitle paragraph below the headline */
  subtitle: string
  /** Optional extra content (CTAs, stats, etc.) rendered below the subtitle */
  children?: React.ReactNode
  /** Centre everything (defaults to true). Set false for left-aligned heroes. */
  centered?: boolean
  /** Optional className extension on the outer section */
  className?: string
}

export default function PageHero({
  label,
  labelIcon,
  headline,
  subtitle,
  children,
  centered = true,
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden bg-ky-dark pt-32 md:pt-44 pb-20 md:pb-28',
        className,
      )}
    >
      {/* Dotted decorative backdrop \u2014 fades into the section */}
      <div className="absolute inset-0 ky-hero-bg-dots opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

      {/* Ambient soft glows \u2014 colored halos drifting behind the headline */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-10 left-1/4 w-[420px] h-[420px] rounded-full bg-ky-green-hi/15 blur-[110px]" />
        <div className="absolute bottom-0 right-1/4 w-[380px] h-[380px] rounded-full bg-ky-gold/12 blur-[110px]" />
      </div>

      {/* Floating circle ornaments */}
      <FloatingOrnaments />

      <div
        className={cn(
          'relative max-w-5xl mx-auto px-6',
          centered ? 'text-center' : 'text-left',
        )}
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={cn(
            'inline-flex items-center gap-3 mb-6 px-3 py-1.5 bg-ky-surface/60 ghost-border rounded-md backdrop-blur',
            centered ? 'mx-auto' : '',
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-ky-gold animate-dot-pulse-gold" />
          {labelIcon && <Icon icon={labelIcon} className="w-3.5 h-3.5 text-ky-gold" />}
          <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-ky-gold font-display">
            {label}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-ky-gold animate-dot-pulse-gold" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className={cn(
            'ky-hero-title text-4xl md:text-6xl lg:text-7xl font-display mb-6',
            centered ? 'mx-auto max-w-4xl' : '',
          )}
        >
          {headline.lead}{' '}
          <span className="ky-hero-accent">{headline.accent}</span>
          {headline.tail ? `${headline.tail.startsWith(' ') ? '' : ' '}${headline.tail}` : '.'}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={cn(
            'text-base md:text-lg text-ky-muted leading-relaxed font-inter',
            centered ? 'mx-auto max-w-2xl' : 'max-w-2xl',
          )}
        >
          {subtitle}
        </motion.p>

        {children && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32 }}
            className="mt-8"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────────────────────── */

function FloatingOrnaments() {
  return (
    <>
      {/* Top-right ring outline */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.85, rotate: -12 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="pointer-events-none absolute -top-10 -right-10 w-60 h-60 rounded-full border border-ky-gold/30"
      />
      {/* Top-right concentric ring */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: 'easeOut', delay: 0.1 }}
        className="pointer-events-none absolute top-16 right-16 w-28 h-28 rounded-full border border-ky-green-hi/25"
      />
      {/* Bottom-left small gold dot */}
      <span className="pointer-events-none absolute bottom-12 left-12 w-2 h-2 rounded-full bg-ky-gold-hi animate-dot-pulse-gold" />
      {/* Bottom-left ring */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.18, ease: 'easeOut' }}
        className="pointer-events-none absolute -bottom-16 -left-16 w-72 h-72 rounded-full border border-ky-border"
      />
    </>
  )
}
