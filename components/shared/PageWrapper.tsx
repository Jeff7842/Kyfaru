'use client'

// ============================================================
// PAGE WRAPPER
// Replaces the original styled-components PageWrapper.
// Theme-aware radial gradient background + motion.dev fade-in
// on first reveal. Used to host the lower homepage sections.
// ============================================================

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface PageWrapperProps {
  children: React.ReactNode
  className?: string
}

/**
 * Renders a full-bleed, theme-aware radial-gradient background
 * that gently fades in when it enters the viewport.
 */
export default function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.02 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={cn('relative isolate overflow-hidden bg-ky-base', className)}
    >
      {/* Radial highlight (top center) */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(circle at top, rgba(74, 175, 110, 0.06) 0%, transparent 55%)',
        }}
      />
      {/* Subtle tessellation overlay */}
      <div className="pointer-events-none absolute inset-0 -z-10 tessellation-bg opacity-30 dark:opacity-50" />

      {children}
    </motion.div>
  )
}
