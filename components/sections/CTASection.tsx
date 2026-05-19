// ============================================================
// CTA SECTION
// Two-column prestige CTA — left: headline + buttons,
// right: vertical auto-scrolling marquee. Radial green glow.
// ============================================================

'use client'

import Link from 'next/link'
import { Icon } from '@iconify/react'
import { useEffect, useRef } from 'react'

const marqueeItems = [
  'Web Applications',
  'Portfolio Webistes',
  'AI-Powered Systems',
  'Education Platforms',
  'CRMs',
  'E-Commerce Platforms',
  'Startup Founders',
  'Enterprise Teams',
  'Mobile Applications',
]

function VerticalMarquee({
  children,
  speed = 30,
  reverse = false,
}: {
  children: React.ReactNode
  speed?: number
  reverse?: boolean
}) {
  return (
    <div
      className="flex flex-col overflow-hidden h-full bg-transparent"
      style={{ '--duration': `${speed}s` } as React.CSSProperties}
    >
      <div
        className={`flex shrink-0 flex-col animate-marquee-vertical${reverse ? ' [animation-direction:reverse]' : ''}`}
      >
        {children}
      </div>
      <div
        className={`flex shrink-0 flex-col animate-marquee-vertical${reverse ? ' [animation-direction:reverse]' : ''}`}
        aria-hidden="true"
      >
        {children}
      </div>
    </div>
  )
}

/**
 * Renders the homepage final CTA section.
 */
export default function CTASection() {
  const marqueeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = marqueeRef.current
    if (!container) return

    let frame: number

    const updateOpacity = () => {
      const items = container.querySelectorAll('.marquee-item')
      const rect = container.getBoundingClientRect()
      const centerY = rect.top + rect.height / 2

      items.forEach((item) => {
        const itemRect = item.getBoundingClientRect()
        const itemCenterY = itemRect.top + itemRect.height / 2
        const distance = Math.abs(centerY - itemCenterY)
        const normalizedDistance = Math.min(distance / (rect.height / 2), 1)
        ;(item as HTMLElement).style.opacity = (1 - normalizedDistance * 0.8).toString()
      })

      frame = requestAnimationFrame(updateOpacity)
    }

    frame = requestAnimationFrame(updateOpacity)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <section className="relative bg-ky-base py-24 md:py-32 overflow-hidden">
      {/* Radial glow — green centre + gold hint */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-ky-green/10 blur-[130px]" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-ky-gold/5 blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Left: content ── */}
          <div className="flex flex-col gap-8 max-w-3xl w-full">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-ky-gold" />
              <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-ky-gold font-display">
                Ready to Begin?
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-ky-gold" />
            </div>

            <h2 className="text-5xl w-2xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] text-ky-ivory font-display">
              Let&apos;s build the system that <span className="text-[#1b6e38] italic">moves your business ahead</span>.
            </h2>

            <p className="text-base md:text-lg text-ky-muted leading-relaxed font-inter">
              Tell us your idea, your problem, or your vision. We will show you exactly
              how Kyfaru can build it — and what it takes to get there.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
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

            <p className="text-xs text-ky-faint tracking-wider font-inter">
              Free 30-minute discovery call · No obligations · Reply within 24 hours
            </p>
          </div>

          {/* ── Right: vertical marquee ── */}
          <div
            ref={marqueeRef}
            className="relative h-140 lg:h-180 overflow-hidden -top-10 pl-10 left-30"
          >
            <VerticalMarquee speed={22}>
              {marqueeItems.map((item, idx) => (
                <div
                  key={idx}
                  className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight py-6 text-ky-ivory marquee-item"
                >
                  {item}
                </div>
              ))}
            </VerticalMarquee>

            {/* Top vignette */}
            <div className="pointer-events-none absolute top-0 inset-x-0 h-40 bg-linear-to-b from-ky-base to-transparent z-10" />
            {/* Bottom vignette */}
            <div className="pointer-events-none absolute bottom-0 inset-x-0 h-40 bg-linear-to-t from-ky-base to-transparent z-10" />
          </div>

        </div>
      </div>
    </section>
  )
}
