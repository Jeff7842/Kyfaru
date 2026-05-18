// ============================================================
// TESSELLATION OVERLAY
// Decorative SVG inspired by the Kyfaru logo triangular motif.
// Used as a low-opacity background pattern on large sections to
// add texture without visual noise.
// ============================================================

import { cn } from '@/lib/utils'

interface TessellationOverlayProps {
  className?: string
  opacity?: number
}

/**
 * Renders a triangular tessellation SVG used as a section background overlay.
 */
export default function TessellationOverlay({
  className,
  opacity = 0.04,
}: TessellationOverlayProps) {
  return (
    <svg
      className={cn('absolute inset-0 w-full h-full pointer-events-none', className)}
      style={{ opacity }}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id="ky-tess" width="80" height="70" patternUnits="userSpaceOnUse">
          <polygon points="40,0 80,70 0,70" fill="none" stroke="#4aaf6e" strokeWidth="0.5" />
          <polygon points="0,0 80,0 40,70" fill="none" stroke="#c9a84c" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ky-tess)" />
    </svg>
  )
}
