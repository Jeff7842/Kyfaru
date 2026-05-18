// ============================================================
// ORBITAL — shared constants & helpers
// ============================================================

/** Per-service accent colours (mapped by index 0..7). */
export const SERVICE_ACCENT_COLORS = [
  '#22d3ee', // cyan      — Web App
  '#a78bfa', // violet    — Mobile App
  '#f59e0b', // amber     — UI/UX
  '#34d399', // emerald   — USSD
  '#fb7185', // rose      — Email
  '#38bdf8', // sky       — AI
  '#fb923c', // orange    — Backend
  '#a3e635', // lime      — Support
] as const

/** Convert "#rrggbb" to "rgba(r,g,b,a)". */
export function hexToRgba(hex: string, alpha: number): string {
  try {
    const h = hex.replace('#', '')
    const r = parseInt(h.substring(0, 2), 16)
    const g = parseInt(h.substring(2, 4), 16)
    const b = parseInt(h.substring(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  } catch (error) {
    console.error('[hexToRgba] failed:', error)
    return `rgba(201, 168, 76, ${alpha})`
  }
}

/** Service deep-link routes (Solutions page anchors). */
export function serviceHref(id: string): string {
  const map: Record<string, string> = {
    'web-app':    '/solutions#web',
    'mobile-app': '/solutions#mobile',
    'ui-ux':      '/solutions#mobile',
    'ussd':       '/solutions#infrastructure',
    'email':      '/solutions#infrastructure',
    'ai':         '/solutions#intelligence',
    'backend':    '/solutions#infrastructure',
    'support':    '/solutions',
  }
  return map[id] ?? '/solutions'
}
