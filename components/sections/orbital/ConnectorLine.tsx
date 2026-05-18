'use client'

// ============================================================
// CONNECTOR LINE
// Simple dashed connector from the active orbital node to
// the service info card. No glow, no pulse — clean and minimal.
// ============================================================

import { motion } from 'motion/react'

interface ConnectorLineProps {
  /** Pixel-space start point (edge of active node) */
  start: { x: number; y: number }
  /** Pixel-space end point (left edge of service card) */
  end: { x: number; y: number }
  /** Accent colour */
  accent: string
  /** Re-draw trigger — usually the active service id */
  drawKey: string
}

/**
 * Renders a simple dashed connector line.
 */
export default function ConnectorLine({ start, end, accent, drawKey }: ConnectorLineProps) {
  const stubX = start.x + 24
  const path = `M ${start.x} ${start.y} L ${stubX} ${start.y} L ${end.x} ${end.y}`

  return (
    <svg
      className="absolute inset-0 pointer-events-none w-full h-full overflow-visible"
      aria-hidden="true"
    >
      {/* Dashed connector path */}
      <motion.path
        key={`line-${drawKey}`}
        d={path}
        fill="none"
        stroke={accent}
        strokeWidth={1}
        strokeDasharray="6 4"
        strokeOpacity={0.5}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />

      {/* Small dot at start */}
      <motion.circle
        key={`dot-start-${drawKey}`}
        cx={start.x}
        cy={start.y}
        r={3}
        fill={accent}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      />

      {/* Small dot at end */}
      <motion.circle
        key={`dot-end-${drawKey}`}
        cx={end.x}
        cy={end.y}
        r={3}
        fill={accent}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      />
    </svg>
  )
}
