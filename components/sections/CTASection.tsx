// ============================================================
// CTA SECTION
// Full-width prestige call-to-action with gold gradient button
// + ghost secondary. Radial green glow background.
// ============================================================

import Link from 'next/link'
import { Icon } from '@iconify/react'

/**
 * Renders the homepage final CTA section.
 */
export default function CTASection() {
  return (
    <section className="relative bg-ky-base py-24 md:py-32 overflow-hidden">
      {/* Radial green glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-ky-green/10 blur-[120px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 text-center flex flex-col items-center gap-8">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-ky-gold" />
          <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-ky-gold font-display">
            Ready to Begin?
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-ky-gold" />
        </div>

        <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05] text-ky-ivory font-display max-w-3xl">
          Let&apos;s build the system that{' '}
          <span className="ky-hero-accent">moves your business forward</span>.
        </h2>

        <p className="text-base md:text-lg text-ky-muted leading-relaxed font-inter max-w-2xl">
          Tell us your idea, your problem, or your vision. We will show you exactly
          how Kyfaru can build it — and what it takes to get there.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 gold-gradient-bg ambient-glow text-ky-base px-8 py-4 font-semibold text-sm tracking-[0.15em] font-display uppercase transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Start Your Project</span>
            <Icon
              icon="heroicons:arrow-right"
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
            />
          </Link>

          <Link
            href="/projects"
            className="group inline-flex items-center gap-3 ghost-border px-8 py-4 font-semibold text-sm tracking-[0.15em] font-display uppercase text-ky-ivory hover:bg-ky-surface transition-colors"
          >
            <span>View Our Work</span>
          </Link>
        </div>

        {/* Sub-note */}
        <p className="text-xs text-ky-faint tracking-wider mt-4 font-inter">
          Free 30-minute discovery call · No obligations · Reply within 24 hours
        </p>
      </div>
    </section>
  )
}
