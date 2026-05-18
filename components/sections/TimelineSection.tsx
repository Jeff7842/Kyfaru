'use client'

// ============================================================
// TIMELINE SECTION
// Vertical roadmap of Kyfaru milestones starting from 2025.
// Alternating left/right cards on desktop, stacked left-aligned
// on mobile. A central vertical line connects each milestone dot.
// ============================================================

import { motion } from 'motion/react'
import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'

interface TimelineMilestone {
  year: string
  quarter?: string
  title: string
  description: string
  icon: string
  /** Highlight as a future/aspirational milestone */
  upcoming?: boolean
}

const MILESTONES: TimelineMilestone[] = [
  {
    year: '2025',
    quarter: 'Q1',
    title: 'Kyfaru founded',
    description:
      'A small team of engineers and designers came together with one mission — build world-class systems for African businesses.',
    icon: 'heroicons:flag',
  },
  {
    year: '2025',
    quarter: 'Q2',
    title: 'First production launch',
    description:
      'Our first commercial web platform went live, serving an active SME client across Kenya. Validation that the model works.',
    icon: 'heroicons:rocket-launch',
  },
  {
    year: '2025',
    quarter: 'Q3',
    title: 'Mwamba AI announced',
    description:
      'We began R&D on Mwamba — our home-grown AI engine for embedding intelligence into local products.',
    icon: 'heroicons:cpu-chip',
  },
  {
    year: '2025',
    quarter: 'Q4',
    title: 'Stackable preview',
    description:
      'Internal tooling that powers our delivery speed will be opened up as Stackable — composable building blocks for Kenyan teams.',
    icon: 'heroicons:cube',
  },
  {
    year: '2026',
    quarter: 'Q1',
    title: 'Cross-border expansion',
    description:
      'Kyfaru is expanding deliberately into the wider East African market with strategic clients in Uganda and Tanzania.',
    icon: 'heroicons:globe-africa',
    upcoming: true,
  },
  {
    year: '2026',
    quarter: 'Q3',
    title: 'Mwamba AI public beta',
    description:
      'Mwamba AI will open to a curated developer beta. The first locally-trained AI infrastructure built for African languages.',
    icon: 'heroicons:sparkles',
    upcoming: true,
  },
]

export default function TimelineSection() {
  return (
    <section className="relative bg-ky-dark py-20 md:py-28 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-ky-gold" />
            <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-ky-gold font-display">
              Our Journey
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-ky-gold" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-ky-ivory tracking-tight font-display">
            Milestones since 2025.
          </h2>
          <p className="mt-4 text-ky-muted">
            From a small founding team to a continental ambition — a public log of where we have been and where we are going.
          </p>
        </div>

        {/* Timeline rail */}
        <div className="relative">
          {/* Vertical line — centered on desktop, left-aligned on mobile */}
          <div className="absolute top-0 bottom-0 left-5 md:left-1/2 md:-translate-x-1/2 w-px bg-gradient-to-b from-transparent via-ky-border to-transparent" />

          <div className="flex flex-col gap-12 md:gap-16">
            {MILESTONES.map((m, i) => {
              const isLeft = i % 2 === 0
              return (
                <motion.div
                  key={`${m.year}-${m.title}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: 0.05 * i }}
                  className={cn(
                    'relative grid grid-cols-[44px_1fr] md:grid-cols-2 gap-5 md:gap-12 items-start',
                    !isLeft && 'md:[direction:rtl]'
                  )}
                >
                  {/* Dot marker */}
                  <div className="md:col-span-2 md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1 z-10 row-start-1 row-span-2 flex justify-center [direction:ltr]">
                    <span className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-ky-base ghost-border">
                      <Icon icon={m.icon} className={cn('w-4 h-4 md:w-5 md:h-5', m.upcoming ? 'text-ky-gold-hi' : 'text-ky-gold')} />
                      {m.upcoming && (
                        <span className="absolute inset-0 rounded-full border border-dashed border-ky-gold-hi animate-reticle-spin pointer-events-none" />
                      )}
                    </span>
                  </div>

                  {/* Card */}
                  <div className={cn('md:col-span-1 [direction:ltr]', isLeft ? 'md:pr-8 lg:pr-14' : 'md:pl-8 lg:pl-14')}>
                    <div className={cn('bg-ky-surface ghost-border ky-rounded p-6 md:p-7', isLeft ? 'md:text-right' : 'md:text-left')}>
                      <div className="flex items-center gap-2 mb-3 md:justify-start" style={isLeft ? { justifyContent: 'flex-end' } : undefined}>
                        <span className="text-[11px] font-display tracking-[0.3em] text-ky-gold">
                          {m.year}{m.quarter ? ` · ${m.quarter}` : ''}
                        </span>
                        {m.upcoming && (
                          <span className="text-[9px] font-display tracking-[0.25em] text-ky-gold-hi bg-ky-gold-hi/10 px-2 py-0.5 ky-rounded-sm">
                            UPCOMING
                          </span>
                        )}
                      </div>
                      <h3 className="font-display font-semibold text-ky-ivory text-lg md:text-xl tracking-tight mb-2">
                        {m.title}
                      </h3>
                      <p className="text-sm md:text-base text-ky-muted leading-relaxed">
                        {m.description}
                      </p>
                    </div>
                  </div>

                  {/* Spacer (the alternating side) */}
                  <div className="hidden md:block md:col-span-1" />
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
