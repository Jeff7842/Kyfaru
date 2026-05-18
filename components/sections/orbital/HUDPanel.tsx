'use client'

// ============================================================
// SERVICE CARD (formerly HUD Panel)
// Clean flash-card design for the service info panel.
// Solid surface background, left accent data-trail bar,
// no glassmorphism or sci-fi elements.
// ============================================================

import { motion, AnimatePresence } from 'motion/react'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { serviceHref } from './orbital-utils'
import type { Service } from '@/types'

interface HUDPanelProps {
  service: Service
  accent: string
  /** Mobile mode: narrower, compact spacing */
  compact?: boolean
}

/**
 * Renders the service info flash card.
 */
export default function HUDPanel({ service, accent, compact = false }: HUDPanelProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={service.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.4, ease: [0.25, 0.6, 0.3, 1] }}
        className={`relative bg-ky-surface ghost-border ky-rounded overflow-hidden ${compact ? 'p-5' : 'p-7 md:p-8'}`}
        style={{ minHeight: compact ? undefined : 280 }}
      >
        {/* Left accent data-trail bar */}
        <span
          className="absolute left-0 top-0 bottom-0 w-[3px]"
          style={{ background: accent }}
        />

        {/* Service number */}
        <div className="text-[10px] font-display tracking-[0.3em] text-ky-faint mb-3">
          {String(service.number).padStart(2, '0')} — SERVICE
        </div>

        {/* Service title */}
        <h3
          className={`font-display font-semibold tracking-tight leading-tight mb-4 text-ky-ivory ${compact ? 'text-xl' : 'text-2xl md:text-[28px]'}`}
        >
          {service.title}
        </h3>

        {/* Subtle divider */}
        <div className="h-px w-full bg-ky-border mb-5" />

        {/* Description */}
        <p
          className={`text-ky-muted leading-relaxed ${compact ? 'text-[12.5px]' : 'text-sm md:text-[14.5px]'}`}
        >
          {service.description}
        </p>

        {/* Highlights chips */}
        {!compact && service.highlights && service.highlights.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {service.highlights.slice(0, 4).map((h) => (
              <span
                key={h}
                className="text-[10px] font-display tracking-[0.15em] uppercase px-2.5 py-1 bg-ky-raised text-ky-muted ky-rounded-sm"
              >
                {h}
              </span>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-7 flex items-center justify-between">
          <Link
            href={serviceHref(service.id)}
            className="group inline-flex items-center gap-2 text-[11px] font-display tracking-[0.25em] uppercase hover:text-ky-ivory transition-colors"
            style={{ color: accent }}
          >
            <span>Learn More</span>
            <Icon icon="heroicons:arrow-right" className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>

          <div
            className="w-2 h-2 rounded-full"
            style={{ background: accent }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
