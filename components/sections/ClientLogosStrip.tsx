// ============================================================
// CLIENT LOGOS STRIP
// Reverse-direction infinite marquee of companies Kyfaru has
// worked with. Mirrors the TrustStrip but moves the opposite
// direction to create visual contrast.
// ============================================================

import { Icon } from '@iconify/react'

/**
 * Placeholder list of clients/partners.
 * Replace `icon` and `label` values when real client logos are ready.
 */
const CLIENT_LOGOS = [
  { icon: 'simple-icons:safaricom', label: 'Safaricom' },
  { icon: 'simple-icons:equitybank', label: 'Equity Bank' },
  { icon: 'simple-icons:kcb', label: 'KCB Group' },
  { icon: 'simple-icons:airtel', label: 'Airtel' },
  { icon: 'simple-icons:mpesa', label: 'M-Pesa' },
  { icon: 'simple-icons:cooperative', label: 'Co-op Bank' },
  { icon: 'simple-icons:absa', label: 'Absa' },
  { icon: 'simple-icons:standardchartered', label: 'Stanchart' },
  { icon: 'simple-icons:ncba', label: 'NCBA' },
  { icon: 'simple-icons:jumia', label: 'Jumia' },
  { icon: 'simple-icons:twiga', label: 'Twiga' },
  { icon: 'simple-icons:sendy', label: 'Sendy' },
]

/**
 * Renders the client logos strip — horizontally scrolling marquee
 * of companies Kyfaru has worked with. Direction is reversed
 * compared to TrustStrip for visual contrast.
 */
export default function ClientLogosStrip() {
  // Duplicate list once so the CSS marquee loops seamlessly
  const doubled = [...CLIENT_LOGOS, ...CLIENT_LOGOS]

  return (
    <section className="relative bg-ky-base py-14 md:py-16 overflow-hidden hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Label */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-ky-gold" />
          <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-ky-gold font-display">
            Companies We&rsquo;ve Worked With
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-ky-gold" />
        </div>

        {/* Marquee track */}
        <div className="relative">
          {/* Edge fade masks */}
          <div className="pointer-events-none absolute top-0 bottom-0 -left-1 w-32 md:w-48 bg-linear-to-r from-ky-base to-transparent z-10" />
          <div className="pointer-events-none absolute top-0 bottom-0 -right-1 w-32 md:w-48 bg-linear-to-l from-ky-base to-transparent z-10" />

          <div className="flex gap-12 md:gap-16 animate-marquee-rev w-max">
            {doubled.map((logo, i) => (
              <div
                key={`${logo.label}-${i}`}
                className="flex items-center gap-3 text-ky-muted hover:text-ky-ivory transition-colors shrink-0"
              >
                <Icon icon={logo.icon} className="w-7 h-7 md:w-8 md:h-8" />
                <span className="text-sm md:text-base font-medium font-display tracking-wider whitespace-nowrap">
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
