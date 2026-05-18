'use client'

// ============================================================
// PROCESS SECTION — Vertical Scroll-Progress Timeline
// Left rail: 2px ky-border vertical line; an inner overlay fills
//   with ky-gold based on scroll progress through the section
//   (driven by GSAP ScrollTrigger with scrub:true).
// Right: each step is a card with icon, number, title, body. The
//   step closest to the scroll head animates to an "active" state
//   (gold-glow ring, raised background) via Motion + an IntersectionObserver.
// ============================================================

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'motion/react'
import { Icon } from '@iconify/react'
import SectionHeading from '@/components/shared/SectionHeading'
import { processSteps } from '@/lib/data/process-steps'
import { cn } from '@/lib/utils'

/**
 * Renders the "How We Work" vertical scroll-progress timeline section.
 */
export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const railRef = useRef<HTMLDivElement | null>(null)
  const fillRef = useRef<HTMLDivElement | null>(null)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  // ── GSAP scrub: drive the rail fill height as user scrolls ──
  useEffect(() => {
    if (!sectionRef.current || !fillRef.current) return

    gsap.registerPlugin(ScrollTrigger)

    const tween = gsap.fromTo(
      fillRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        transformOrigin: 'top center',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top center',
          end: 'bottom 70%',
          scrub: true,
        },
      }
    )

    return () => {
      tween.kill()
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === sectionRef.current) st.kill()
      })
    }
  }, [])

  // ── Track which step is currently in the centre of the viewport ──
  useEffect(() => {
    const refs = stepRefs.current
    if (!refs.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-step-index'))
            if (!Number.isNaN(idx)) setActiveIndex(idx)
          }
        })
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    )

    refs.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative bg-ky-dark py-24 md:py-32 overflow-hidden"
    >
      {/* Ambient decoration */}
      <div className="pointer-events-none absolute inset-0 tessellation-bg opacity-25" />

      <div className="relative max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="mb-16 md:mb-20 max-w-3xl"
        >
          <SectionHeading
            label="Our Process"
            headline="Four steps. Zero confusion. Total clarity."
            subtitle="From the first call to long after launch, we work in clear, predictable phases. You know exactly what is happening and exactly when."
          />
        </motion.div>

        {/* Timeline grid */}
        <div className="relative grid grid-cols-[44px_1fr] md:grid-cols-[88px_1fr] gap-x-4 md:gap-x-8">
          {/* ── Left rail ── */}
          <div ref={railRef} className="relative">
            {/* Background track */}
            <div className="absolute left-1/2 -translate-x-1/2 top-7 bottom-7 w-px bg-ky-border" />
            {/* Animated fill (GSAP scaleY) */}
            <div className="absolute left-1/2 -translate-x-1/2 top-7 bottom-7 w-px overflow-hidden">
              <div
                ref={fillRef}
                className="absolute inset-0 origin-top"
                style={{
                  background: 'linear-gradient(to bottom, var(--color-ky-gold-hi), var(--color-ky-gold))',
                  boxShadow: '0 0 12px rgba(239, 188, 49, 0.6)',
                  transform: 'scaleY(0)',
                }}
              />
            </div>
          </div>

          {/* ── Right column — step cards stack ── */}
          <div className="flex flex-col gap-12 md:gap-16">
            {processSteps.map((step, i) => {
              const isActive = i === activeIndex
              return (
                <div
                  key={step.id}
                  ref={(el) => { stepRefs.current[i] = el }}
                  data-step-index={i}
                  className="relative"
                >
                  {/* Floating step marker positioned over the rail */}
                  <div
                    className={cn(
                      'absolute -left-[60px] md:-left-[92px] top-4 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center transition-all duration-500',
                      'border bg-ky-base',
                      isActive
                        ? 'border-ky-gold text-ky-gold shadow-[0_0_24px_rgba(239,188,49,0.45)]'
                        : 'border-ky-border text-ky-muted'
                    )}
                  >
                    <Icon icon={step.icon} className="w-5 h-5 md:w-6 md:h-6" />
                    {isActive && (
                      <motion.span
                        layoutId="process-active-pulse"
                        className="absolute inset-0 border border-ky-gold animate-glow-pulse pointer-events-none"
                      />
                    )}
                  </div>

                  {/* Step card */}
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: [0.2, 0.7, 0.3, 1] }}
                    animate={{
                      backgroundColor: isActive
                        ? 'var(--color-ky-raised)'
                        : 'var(--color-ky-surface)',
                    }}
                    className="ghost-border p-7 md:p-9 relative overflow-hidden"
                  >
                    {/* Faint giant step number watermark */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-2 -bottom-8 text-[120px] md:text-[160px] font-display font-bold leading-none select-none"
                      style={{ color: 'rgba(239, 188, 49, 0.04)' }}
                    >
                      {step.number}
                    </span>

                    <div
                      className={cn(
                        'relative text-[11px] tracking-[0.3em] font-display uppercase mb-3 transition-colors duration-500',
                        isActive ? 'text-ky-gold' : 'text-ky-faint'
                      )}
                    >
                      STEP {step.number} — OF 04
                    </div>

                    <h3 className="relative text-2xl md:text-3xl font-display font-semibold text-ky-ivory tracking-tight mb-4 leading-tight">
                      {step.title}
                    </h3>

                    <p className="relative text-ky-muted leading-relaxed text-sm md:text-base max-w-2xl">
                      {step.description}
                    </p>
                  </motion.div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
