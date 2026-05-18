'use client'

// ============================================================
// ACHIEVEMENTS CAROUSEL
// 3D rotating trophy carousel inspired by CSS perspective ring.
// Each trophy is positioned in 3D space at an angle around the
// Y-axis. Auto-rotates and supports manual nav controls.
// ============================================================

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'

interface Achievement {
  icon: string
  title: string
  year: string
  description: string
  /** Tailwind colour class — applied to the trophy ring */
  accent: string
}

const ACHIEVEMENTS: Achievement[] = [
  {
    icon: 'heroicons:trophy',
    title: 'Top SME Tech Partner',
    year: '2025',
    description: 'Recognised by the Kenya SME Association for outstanding service and delivery quality.',
    accent: '#efbc31',
  },
  {
    icon: 'heroicons:star',
    title: 'Innovator of the Year',
    year: '2025',
    description: 'Shortlisted for innovation in AI for African languages with the Mwamba initiative.',
    accent: '#1b6e38',
  },
  {
    icon: 'heroicons:academic-cap',
    title: 'Open Source Contributor',
    year: '2025',
    description: 'Active contributors to leading Kenyan and global open source projects.',
    accent: '#efbc31',
  },
  {
    icon: 'heroicons:rocket-launch',
    title: 'Fastest Time-to-Launch',
    year: '2025',
    description: 'Average client project ships 40% faster than industry standard with full quality.',
    accent: '#775a00',
  },
  {
    icon: 'heroicons:users',
    title: '100% Client Retention',
    year: '2025',
    description: 'Every client we have signed since founding has stayed with us — repeat partnerships and referrals.',
    accent: '#1b6e38',
  },
  {
    icon: 'heroicons:globe-africa',
    title: 'Pan-African Reach',
    year: '2026',
    description: 'Projects deployed across Kenya, Uganda, Tanzania, and Rwanda — and expanding.',
    accent: '#efbc31',
  },
]

export default function AchievementsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const total = ACHIEVEMENTS.length
  const angleStep = 360 / total

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((c) => (c + 1) % total)
    }, 5000)
    return () => clearInterval(id)
  }, [total])

  const rotation = -activeIndex * angleStep
  const active = ACHIEVEMENTS[activeIndex]

  return (
    <section className="relative bg-ky-base py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-ky-gold" />
            <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-ky-gold font-display">
              Achievements
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-ky-gold" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-ky-ivory tracking-tight font-display">
            Trophies on the wall.
          </h2>
          <p className="mt-4 text-ky-muted">
            Wins, recognitions, and milestones that mark the journey so far.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_460px] gap-12 lg:gap-16 items-center">
          {/* Carousel stage */}
          <div
            className="relative h-[420px] md:h-[500px] flex items-center justify-center"
            style={{ perspective: '1400px' }}
          >
            <motion.div
              className="relative w-44 h-56 md:w-52 md:h-64"
              style={{ transformStyle: 'preserve-3d' }}
              animate={{ rotateY: rotation }}
              transition={{ type: 'spring', stiffness: 60, damping: 16 }}
            >
              {ACHIEVEMENTS.map((a, i) => {
                const angle = i * angleStep
                const isActive = i === activeIndex
                return (
                  <button
                    key={a.title}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    className={cn(
                      'absolute inset-0 ky-rounded p-5 flex flex-col items-center justify-center text-center cursor-pointer',
                      'transition-all duration-500',
                      'bg-ky-surface ghost-border'
                    )}
                    style={{
                      transform: `rotateY(${angle}deg) translateZ(280px)`,
                      backfaceVisibility: 'hidden',
                      borderColor: isActive ? a.accent : undefined,
                      boxShadow: isActive
                        ? `0 12px 40px ${a.accent}33`
                        : '0 4px 16px rgba(0,0,0,0.08)',
                      opacity: isActive ? 1 : 0.85,
                    }}
                  >
                    <div
                      className="w-16 h-16 md:w-20 md:h-20 mb-4 rounded-full flex items-center justify-center"
                      style={{
                        background: `${a.accent}15`,
                        border: `1.5px solid ${a.accent}55`,
                      }}
                    >
                      <Icon icon={a.icon} className="w-8 h-8 md:w-10 md:h-10" style={{ color: a.accent }} />
                    </div>
                    <div className="text-[10px] font-display tracking-[0.3em] text-ky-faint mb-2">
                      {a.year}
                    </div>
                    <div className="font-display font-semibold text-ky-ivory text-sm md:text-base leading-tight px-1">
                      {a.title}
                    </div>
                  </button>
                )
              })}
            </motion.div>
          </div>

          {/* Active achievement description + nav */}
          <div className="flex flex-col gap-7">
            <motion.div
              key={active.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-ky-surface ghost-border ky-rounded p-7 md:p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 ky-rounded-sm flex items-center justify-center"
                  style={{ background: `${active.accent}15`, color: active.accent }}
                >
                  <Icon icon={active.icon} className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-display tracking-[0.3em] text-ky-faint">
                  {active.year}
                </span>
              </div>
              <h3 className="font-display font-semibold text-ky-ivory text-xl md:text-2xl mb-3 tracking-tight">
                {active.title}
              </h3>
              <p className="text-ky-muted leading-relaxed">{active.description}</p>
            </motion.div>

            {/* Navigation controls */}
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setActiveIndex((c) => (c - 1 + total) % total)}
                aria-label="Previous achievement"
                className="w-11 h-11 flex items-center justify-center bg-ky-surface ghost-border ky-rounded-sm text-ky-ivory hover:bg-ky-raised transition-colors"
              >
                <Icon icon="heroicons:chevron-left" className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                {ACHIEVEMENTS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    aria-label={`Go to achievement ${i + 1}`}
                    className={cn(
                      'h-2 rounded-full transition-all duration-300',
                      activeIndex === i ? 'w-8 bg-ky-gold' : 'w-2 bg-ky-border'
                    )}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => setActiveIndex((c) => (c + 1) % total)}
                aria-label="Next achievement"
                className="w-11 h-11 flex items-center justify-center bg-ky-surface ghost-border ky-rounded-sm text-ky-ivory hover:bg-ky-raised transition-colors"
              >
                <Icon icon="heroicons:chevron-right" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
