'use client'

// ============================================================
// TESTIMONIALS SECTION — Dual Marquee
// Two horizontal rows of testimonial cards that scroll smoothly
// in opposite directions:
//   • Row 1 → left (animate-marquee-slow)
//   • Row 2 → right (animate-marquee-rev)
// Hovering anywhere over a row pauses just that row, so users
// can read whatever caught their eye without the whole carousel
// freezing. No arrows, no dots — pure continuous motion.
// ============================================================

import { motion } from 'motion/react'
import SectionHeading from '@/components/shared/SectionHeading'
import TestimonialCard from '@/components/shared/TestimonialCard'
import { testimonials } from '@/lib/data/testimonials'
import type { Testimonial } from '@/types'

/**
 * Renders the testimonials section as two opposing infinite marquees.
 */
export default function TestimonialsSection() {
  // Split the testimonials so each row carries roughly half + the other
  // half stays unique-feeling. If there are fewer than 6 we just reuse
  // the full set on both rows.
  const half = Math.ceil(testimonials.length / 2)
  const rowA = testimonials.length >= 4 ? testimonials.slice(0, half) : testimonials
  const rowB = testimonials.length >= 4 ? testimonials.slice(half).concat(testimonials.slice(0, 1)) : testimonials

  return (
    <section className="relative bg-ky-surface py-24 md:py-32 overflow-hidden">
      {/* Ambient halo */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-ky-gold/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="mb-12 md:mb-14 max-w-3xl mx-auto text-center"
        >
          <SectionHeading
            label="Client Trust"
            headline="What our clients say about working with us."
            subtitle="From principals to fintech founders — here is what real Kyfaru clients say after launch."
            centered
          />
        </motion.div>
      </div>

      {/* Marquee rows — full bleed so cards can drift edge-to-edge */}
      <div className="relative">
        <MarqueeRow items={rowA} direction="left" />
        <div className="h-5 md:h-6" />
        <MarqueeRow items={rowB} direction="right" />

        {/* Soft side fades for an editorial finish */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-ky-surface to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-ky-surface to-transparent" />
      </div>
    </section>
  )
}

/* ============================================================
   MARQUEE ROW — duplicates `items` so the translateX(-50%) loop
   appears seamless. The animation auto-pauses on hover.
   ============================================================ */
function MarqueeRow({ items, direction }: { items: Testimonial[]; direction: 'left' | 'right' }) {
  // Duplicate 4× so -50% translateX reset is invisible even with few source cards.
  const sequence = [...items, ...items, ...items, ...items]

  return (
    <div className="overflow-hidden">
      <div
        className={
          'flex gap-5 md:gap-6 w-max marquee-pause-on-hover ' +
          (direction === 'left' ? 'animate-marquee-slow' : 'animate-marquee-rev')
        }
        style={{ willChange: 'transform' }}
      >
        {sequence.map((t, i) => (
          <div
            key={`${t.id}-${i}`}
            className="w-[320px] sm:w-[380px] md:w-[420px] shrink-0"
          >
            <TestimonialCard testimonial={t} />
          </div>
        ))}
      </div>
    </div>
  )
}
