'use client'

// ============================================================
// SERVICE ROW
// One expandable row in the homepage Services accordion.
// Stitch-styled: large faint gold number, no dividers, bg tier
// shift on expand, gold chevron rotate.
// ============================================================

import { useState } from 'react'
import { Icon } from '@iconify/react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Service } from '@/types'
import { cn } from '@/lib/utils'

interface ServiceRowProps {
  service: Service
  /** Whether the row starts open (only the first row, usually) */
  defaultOpen?: boolean
}

/**
 * One expandable service row in the accordion.
 */
export default function ServiceRow({ service, defaultOpen = false }: ServiceRowProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  function handleToggle() {
    try {
      setIsOpen((prev) => !prev)
    } catch (error) {
      console.error('[ServiceRow] Toggle error:', error)
    }
  }

  return (
    <div
      className={cn(
        'group transition-all duration-300',
        isOpen ? 'bg-ky-surface' : 'bg-transparent hover:bg-ky-surface/40'
      )}
    >
      <button
        onClick={handleToggle}
        className="w-full flex items-start gap-6 md:gap-10 px-6 md:px-10 py-7 text-left"
        aria-expanded={isOpen}
      >
        {/* Large faint gold number */}
        <span
          className={cn(
            'text-sm md:text-base font-medium tracking-[0.2em] font-display pt-1 transition-colors',
            isOpen ? 'text-ky-gold' : 'text-ky-gold-dim group-hover:text-ky-gold'
          )}
        >
          {service.number}
        </span>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              'text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight font-display transition-colors',
              isOpen ? 'text-ky-ivory' : 'text-ky-ivory/85'
            )}
          >
            {service.title}
          </h3>
        </div>

        {/* Chevron */}
        <Icon
          icon="heroicons:chevron-down"
          className={cn(
            'w-5 h-5 mt-2 text-ky-muted transition-transform duration-300',
            isOpen && 'rotate-180 text-ky-gold'
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 md:px-10 pb-9 pl-16 md:pl-28 grid md:grid-cols-[1fr,auto] gap-8 items-start">
              <div>
                <p className="text-ky-muted font-inter leading-relaxed text-base md:text-lg max-w-2xl mb-5">
                  {service.description}
                </p>
                <ul className="flex flex-wrap gap-x-6 gap-y-2">
                  {service.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-center gap-2 text-sm text-ky-ivory/80">
                      <span className="w-1 h-1 rounded-full bg-ky-gold" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="hidden md:flex w-14 h-14 items-center justify-center bg-ky-raised text-ky-green-hi">
                <Icon icon={service.icon} className="w-7 h-7" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
