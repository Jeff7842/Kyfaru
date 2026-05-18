// ============================================================
// SERVICES SECTION
// Editorial split intro (left text, right stack of ServiceRow
// accordions) — all 8 services rendered from data.
// ============================================================

import SectionHeading from '@/components/shared/SectionHeading'
import ServiceRow from '@/components/shared/ServiceRow'
import { services } from '@/lib/data/services'
import TessellationOverlay from '@/components/shared/TessellationOverlay'

/**
 * Renders the homepage Services section.
 */
export default function ServicesSection() {
  return (
    <section className="relative bg-ky-dark py-24 md:py-32 overflow-hidden">
      {/* Decorative tessellation watermark */}
      <TessellationOverlay opacity={0.025} />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section heading */}
        <div className="mb-16 md:mb-20 max-w-3xl">
          <SectionHeading
            label="Our Services"
            headline="Eight ways we help businesses build, scale, and lead."
            subtitle="Every Kyfaru engagement is a partnership. We design systems that solve real problems — and we stand behind everything we build."
          />
        </div>

        {/* Accordion stack — no dividers, tonal background shift on hover/expand */}
        <div className="bg-ky-base ghost-border">
          {services.map((service, index) => (
            <ServiceRow key={service.id} service={service} defaultOpen={index === 0} />
          ))}
        </div>
      </div>
    </section>
  )
}
