// ============================================================
// ABOUT PAGE
// Order: Hero → Mission (hierarchical grid) → Timeline → Values
//        → Achievements Carousel → Ecosystem → CTA → Footer.
// ============================================================

import Header from '@/components/header/header'
import Footer from '@/components/layout/Footer'
import EcosystemCard from '@/components/shared/EcosystemCard'
import CTASection from '@/components/sections/CTASection'
import PageHero from '@/components/shared/PageHero'
import TimelineSection from '@/components/sections/TimelineSection'
import AchievementsCarousel from '@/components/sections/AchievementsCarousel'
import RadialValuesOrbital from '@/components/sections/RadialValuesOrbital'
import { ecosystemBranches } from '@/lib/data/ecosystem'
import { Icon } from '@iconify/react'

const MISSION_STATS = [
  { label: 'Founded', value: '2025' },
  { label: 'Active Projects', value: '12+' },
  { label: 'Client Retention', value: '100%' },
  { label: 'Team Members', value: '8' },
]

/** Renders the About page. */
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ky-base">
      <Header />

      <PageHero
        label="About Kyfaru"
        labelIcon="heroicons:building-office-2"
        headline={{
          lead: 'We design systems that',
          accent: 'move Africa forward',
          tail: '.',
        }}
        subtitle="Kyfaru is a Kenyan technology company. We build web apps, mobile apps, AI systems, USSD solutions, and digital infrastructure for the businesses and institutions shaping Africa's next chapter."
      />

      {/* ═══════ MISSION — Hierarchical asymmetric grid ═══════ */}
      <section className="bg-ky-base py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-5 lg:gap-6">
            {/* Big headline tile — top-left, spans 2 rows */}
            <div className="lg:col-span-7 lg:row-span-2 bg-ky-surface ghost-border ky-rounded p-8 md:p-12 flex flex-col justify-between min-h-[280px] md:min-h-[420px]">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-ky-green-hi" />
                <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-ky-green-hi font-display">
                  Our Mission
                </span>
              </div>
              <div className="flex-1 flex items-center">
                <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold tracking-tight leading-[1.05] text-ky-ivory font-display">
                  Empower African businesses with{' '}
                  <span className="text-ky-gold">world-class</span>{' '}
                  technology.
                </h2>
              </div>
              <div className="mt-8 pt-6 border-t border-ky-border grid grid-cols-2 sm:grid-cols-4 gap-4">
                {MISSION_STATS.map((s) => (
                  <div key={s.label}>
                    <div className="text-2xl md:text-3xl font-display font-semibold text-ky-ivory tracking-tight mb-1">
                      {s.value}
                    </div>
                    <div className="text-[10px] font-display tracking-[0.25em] uppercase text-ky-faint">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top-right paragraph tile */}
            <div className="lg:col-span-5 bg-ky-dark ghost-border ky-rounded p-7 md:p-9">
              <Icon icon="heroicons:bolt" className="w-7 h-7 text-ky-gold mb-4" />
              <h3 className="font-display font-semibold text-ky-ivory text-lg mb-3">
                Built locally, engineered globally
              </h3>
              <p className="text-ky-muted leading-relaxed">
                We believe Africa does not need to import its digital future. It can — and should — be designed and built here, by people who understand the context.
              </p>
            </div>

            {/* Bottom-right small tile */}
            <div className="lg:col-span-5 bg-ky-dark ghost-border ky-rounded p-7 md:p-9">
              <Icon icon="heroicons:heart" className="w-7 h-7 text-ky-gold mb-4" />
              <h3 className="font-display font-semibold text-ky-ivory text-lg mb-3">
                Small enough to care
              </h3>
              <p className="text-ky-muted leading-relaxed">
                Skilled enough to build at any scale. Committed enough to be here for the long term — every detail matters to us.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ HISTORY ROADMAP ═══════ */}
      <TimelineSection />

      {/* ═══════ VALUES — radial orbital ═══════ */}
      <RadialValuesOrbital />

      {/* ═══════ ACHIEVEMENTS CAROUSEL ═══════ */}
      <AchievementsCarousel />

      {/* ═══════ ECOSYSTEM ═══════ */}
      <section id="ecosystem" className="bg-ky-dark py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-ky-gold" />
              <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-ky-gold font-display">The Ecosystem</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-ky-ivory tracking-tight font-display">
              One ecosystem. Four focused arms.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5 md:gap-6">
            {ecosystemBranches.map((branch) => (
              <EcosystemCard key={branch.id} branch={branch} />
            ))}
          </div>
        </div>
      </section>

      <CTASection />
      <Footer />
    </div>
  )
}
