// ============================================================
// SOLUTIONS PAGE
// 4 high-level solution category blocks with asymmetric layout +
// reuses ServicesSection and ends with CTASection.
// ============================================================

import Header from '@/components/header/header'
import Footer from '@/components/layout/Footer'
import ServicesSection from '@/components/sections/ServicesSection'
import CTASection from '@/components/sections/CTASection'
import PageHero from '@/components/shared/PageHero'
import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'

const SOLUTION_CATEGORIES = [
  {
    id: 'web',
    label: '01',
    icon: 'heroicons:globe-alt',
    title: 'Web Platforms',
    description: 'From corporate websites to complex SaaS dashboards. We build fast, secure, scalable web platforms using Next.js, React, and TypeScript.',
    bullets: ['SaaS platforms', 'Corporate sites', 'Admin dashboards', 'Custom portals'],
  },
  {
    id: 'mobile',
    label: '02',
    icon: 'heroicons:device-phone-mobile',
    title: 'Mobile Apps',
    description: 'Cross-platform iOS and Android apps built with React Native — one codebase, both app stores, optimised for African networks.',
    bullets: ['Cross-platform', 'Offline-first design', 'M-Pesa integration', 'App Store deployment'],
  },
  {
    id: 'intelligence',
    label: '03',
    icon: 'heroicons:cpu-chip',
    title: 'AI & Intelligence',
    description: 'Embed real intelligence into your products with Mwamba AI. Chatbots, automation, recommendations, and decision-support systems.',
    bullets: ['AI chatbots', 'Process automation', 'Recommendation engines', 'Document intelligence'],
  },
  {
    id: 'infrastructure',
    label: '04',
    icon: 'heroicons:server-stack',
    title: 'Digital Infrastructure',
    description: 'The systems behind the systems. APIs, databases, USSD gateways, payment integrations, and the cloud architecture to scale.',
    bullets: ['USSD gateways', 'Payment integrations', 'APIs & databases', 'Cloud architecture'],
  },
]

/** Renders the Solutions page. */
export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-ky-base">
      <Header />

      <PageHero
        label="Solutions"
        labelIcon="heroicons:squares-2x2"
        headline={{
          lead: 'Four core domains.',
          accent: 'Endless combinations',
          tail: '.',
        }}
        subtitle="Every Kyfaru solution sits in one — or several — of these four core domains. We mix and match to solve your unique problem."
      />

      {/* 4 solution category blocks — alternating asymmetric layout */}
      <section className="bg-ky-base py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6 flex flex-col gap-16 md:gap-24">
          {SOLUTION_CATEGORIES.map((cat, i) => {
            const isReverse = i % 2 === 1
            return (
              <div
                key={cat.id}
                id={cat.id}
                className={cn(
                  'grid lg:grid-cols-12 gap-10 lg:gap-16 items-center',
                  isReverse && 'lg:flex-row-reverse'
                )}
              >
                <div className={cn('lg:col-span-7', isReverse && 'lg:order-2')}>
                  <div className="text-sm font-medium tracking-[0.25em] text-ky-gold font-display mb-4">
                    {cat.label} — DOMAIN
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-ky-ivory tracking-tight font-display leading-[1.05] mb-5">
                    {cat.title}
                  </h2>
                  <p className="text-base md:text-lg text-ky-muted leading-relaxed font-inter mb-7 max-w-xl">
                    {cat.description}
                  </p>
                  <ul className="flex flex-wrap gap-x-8 gap-y-3">
                    {cat.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-sm text-ky-ivory/85 font-inter">
                        <span className="w-1 h-1 rounded-full bg-ky-gold" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Icon block */}
                <div className={cn('lg:col-span-5', isReverse && 'lg:order-1')}>
                  <div className="aspect-square max-w-sm mx-auto bg-ky-surface ghost-border flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 tessellation-bg opacity-50" />
                    <Icon icon={cat.icon} className="relative w-24 h-24 text-ky-gold" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Reuse services accordion */}
      <ServicesSection />

      <CTASection />
      <Footer />
    </div>
  )
}
