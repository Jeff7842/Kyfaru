'use client'

// ============================================================
// ORBITAL NODE
// Clean icon node on the orbital ring. Solid surface background,
// accent border on active/hover, no glassmorphism or neon glow.
// ============================================================

import { Icon } from '@iconify/react'
import { motion } from 'motion/react'
import { hexToRgba } from './orbital-utils'

interface OrbitalNodeProps {
  icon: string
  accent: string
  isActive: boolean
  /** Hover-preview state for inactive nodes — brightens border + icon */
  isHover?: boolean
  /** When true, render a more compact mobile version */
  mobile?: boolean
  /** Active service name for inline display on desktop */
  serviceName?: string
}

/**
 * Orbital icon node — solid surface, accent highlights.
 */
export default function OrbitalNode({
  icon,
  accent,
  isActive,
  isHover = false,
  mobile = false,
  serviceName,
}: OrbitalNodeProps) {
  return (
    <div className="relative w-full h-full">
      {/* Subtle dotted reticle ring (active only) */}
      {isActive && (
        <span
          aria-hidden="true"
          className="absolute -inset-2 rounded-full border border-dotted animate-reticle-spin pointer-events-none"
          style={{ borderColor: hexToRgba(accent, 0.4) }}
        />
      )}

      {/* Solid disc body */}
      <motion.div
        layout
        className="absolute inset-0 rounded-full flex flex-col items-center justify-center text-center bg-ky-surface ghost-border transition-colors duration-300"
        animate={{
          borderColor: isActive
            ? accent
            : isHover
              ? hexToRgba(accent, 0.6)
              : 'var(--c-ky-border)',
          boxShadow: isActive
            ? `0 4px 20px ${hexToRgba(accent, 0.15)}`
            : '0 2px 8px rgba(0,0,0,0.06)',
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 24 }}
      >
        <Icon
          icon={icon}
          className={mobile ? 'w-5 h-5' : isActive ? 'w-8 h-8' : 'w-5 h-5'}
          style={{
            color: isActive || isHover ? accent : 'var(--c-ky-muted)',
            transition: 'color 0.3s ease',
          }}
        />

        {/* On desktop, active node shows the service name inline */}
        {isActive && !mobile && serviceName && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.35 }}
            className="mt-1.5 px-2 max-w-[140px] text-[10px] font-display tracking-[0.18em] uppercase leading-tight text-ky-ivory"
          >
            {serviceName.split(' ').slice(0, 3).join(' ')}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
