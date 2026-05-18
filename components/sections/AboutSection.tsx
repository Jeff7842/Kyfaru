'use client'

// ============================================================
// ABOUT SECTION
// Asymmetric editorial split — large positioning headline & body
// left, 2x2 stat boxes right with GSAP-driven odometer counters.
// Motion.dev staggered intro reveal + pulsing gold dot.
// ============================================================

import Link from 'next/link'
import { motion } from 'motion/react'
import { Icon } from '@iconify/react'
import StatCounter from '@/components/shared/StatCounter'

/** Four key statistics shown in the About section's stat grid */
const STATS = [
  { value: '50+', label: 'Projects Delivered' },
  { value: '10+', label: 'Industries Served' },
  { value: '4',   label: 'Ecosystem Brands'  },
  { value: '30',  label: 'Days of Free Support' },
]

const CONTAINER = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}
const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.7, 0.3, 1] as const } },
}

/**
 * Renders the homepage About section.
 */
export default function AboutSection() {
  return (
    <section className="relative bg-ky-base py-24 md:py-32 overflow-hidden">
      {/* Ambient gold glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -bottom-32 -right-16 w-[520px] h-[520px] rounded-full bg-ky-gold/6 blur-[120px]" />
      </div>

      <motion.div
        variants={CONTAINER}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 lg:gap-20"
      >
        {/* Left — Heading + body + link */}
        <div className="lg:col-span-7 flex flex-col gap-7">
          <motion.div variants={FADE_UP} className="flex items-center gap-3">
            <span className="relative w-1.5 h-1.5 rounded-full bg-ky-gold-hi animate-dot-pulse-gold" />
            <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-ky-gold font-display">
              About Kyfaru
            </span>
          </motion.div>

          <motion.h2
            variants={FADE_UP}
            className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05] text-ky-ivory font-display"
          >
            We are the technology company designing the systems that{' '}
            <span className="text-highlight">power Africa&apos;s future</span>.
          </motion.h2>

          <motion.p
            variants={FADE_UP}
            className="text-base md:text-lg text-ky-muted leading-relaxed max-w-2xl"
          >
            Kyfaru is a Kenyan technology company building web applications, mobile apps,
            AI systems, USSD solutions, and digital infrastructure for businesses and
            institutions across the continent.
          </motion.p>

          <motion.p
            variants={FADE_UP}
            className="text-base md:text-lg text-ky-muted leading-relaxed max-w-2xl"
          >
            We believe technology is the most powerful tool for transformation. Every
            system we build is designed to solve a real African problem — with the
            stability, security, and scale of world-class engineering.
          </motion.p>

          <motion.div variants={FADE_UP}>
            <Link
              href="/about"
              className="group inline-flex items-center gap-3 text-ky-gold hover:text-ky-gold-hi transition-colors text-sm font-medium font-display tracking-wider w-fit mt-2"
            >
              <span>READ OUR STORY</span>
              <Icon icon="heroicons:arrow-right" className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* Right — 2x2 stat grid */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4 lg:gap-5 content-center">
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              variants={FADE_UP}
              className="bg-ky-surface ghost-border p-7 md:p-8 transition-all duration-300 hover:bg-ky-raised hover:border-ky-gold-dim"
            >
              <StatCounter
                value={stat.value}
                className="block text-5xl md:text-6xl font-semibold text-ky-gold tracking-tight font-display mb-2 leading-none"
              />
              <div className="text-xs md:text-sm text-ky-muted tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
