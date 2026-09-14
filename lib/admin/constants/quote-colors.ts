// Accent colour presets for the quote document - shared between the on-screen
// editor (CSS hex) and the PDF generator (pdf-lib rgb fractions), so there's
// one definition instead of two colour palettes drifting apart.

export const ACCENT_COLORS = {
  green: { label: 'Kyfaru Green', hex: '#0B7350' },
  blue: { label: 'Blue', hex: '#2563EB' },
  orange: { label: 'Orange', hex: '#EA580C' },
  purple: { label: 'Purple', hex: '#7C3AED' },
} as const

export type AccentColorKey = keyof typeof ACCENT_COLORS

export const ACCENT_COLOR_OPTIONS = (Object.keys(ACCENT_COLORS) as AccentColorKey[]).map((value) => ({
  value,
  label: ACCENT_COLORS[value].label,
}))

export function accentHex(key: string | null | undefined): string {
  return ACCENT_COLORS[key as AccentColorKey]?.hex ?? ACCENT_COLORS.green.hex
}

export function hexToRgbFraction(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}
