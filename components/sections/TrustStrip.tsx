// ============================================================
// TRUST STRIP
// Infinite-scrolling marquee of tech logos (devicon Iconify set).
// Anchors the user immediately after the hero with proof of
// the technologies Kyfaru builds with.
// ============================================================

import { Icon } from '@iconify/react'

/** Tech stack icons displayed in the marquee */
const TECH_LOGOS = [
  { icon: 'devicon:nextjs', label: 'Next.js' },
  { icon: 'devicon:react',  label: 'React' },
  { icon: 'devicon:typescript', label: 'TypeScript' },
  { icon: 'devicon:tailwindcss', label: 'Tailwind' },
  { icon: 'devicon:nodejs', label: 'Node.js' },
  { icon: 'devicon:python', label: 'Python' },
  { icon: 'devicon:postgresql', label: 'PostgreSQL' },
  { icon: 'devicon:supabase', label: 'Supabase' },
  { icon: 'devicon:figma', label: 'Figma' },
  { icon: 'devicon:vercel', label: 'Vercel' },
  { icon: 'devicon:firebase', label: 'Firebase' },
  { icon: 'devicon:flutter', label: 'Flutter' },
]

/**
 * Renders the trust-strip section — horizontally scrolling tech logos.
 */
export default function TrustStrip() {
  // Duplicate list once so the CSS marquee loops seamlessly
  const doubled = [...TECH_LOGOS, ...TECH_LOGOS]

  return (
    <section className="relative bg-ky-dark py-16 md:py-20 overflow-hidden border-y border-ky-border/40">
      <div className="max-w-7xl mx-auto px-6">
        {/* Label */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-ky-gold" />
          <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-ky-gold font-display">
            Trusted Tools — Built with Industry Standards
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-ky-gold" />
        </div>

        {/* Marquee track */}
        <div className="relative">
          {/* Edge fade masks */}
          <div className="pointer-events-none absolute top-0 bottom-0 -left-85 w-82 bg-gradient-to-r from-ky-dark to-transparent z-10" />
          <div className="pointer-events-none absolute top-0 bottom-0 -right-85 w-92 bg-gradient-to-l from-ky-dark to-transparent z-10" />

          <div className="flex gap-14 md:gap-20 animate-marquee w-max">
            {doubled.map((logo, i) => (
              <div
                key={`${logo.label}-${i}`}
                className="flex items-center gap-3 text-ky-muted hover:text-ky-ivory transition-colors flex-shrink-0"
              >
                <Icon icon={logo.icon} className="w-9 h-9" />
                <span className="text-sm font-medium font-display tracking-wider whitespace-nowrap">
                  {logo.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
