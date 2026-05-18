'use client'

// ============================================================
// PRICING PAGE
// 3 tier cards (Starter / Professional / Enterprise) with the
// Professional tier highlighted via gold glow.
// FAQ accordion below + final CTA.
// ============================================================

import { useState } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import Header from '@/components/header/header'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/shared/PageHero'
import { cn } from '@/lib/utils'

const TIERS = [
  {
    name: 'Starter',
    tagline: 'For small businesses launching their first digital product or for individuals looking to show off their skills or portfolio',
    price: 'From KES 80K',
    cadence: 'one-time',
    highlight: false,
    features: [
      'Custom single-page or simple multi-page website',
      'Responsive across mobile, tablet, desktop',
      'Basic SEO setup',
      'Contact form integration',
      'Custom Email integration',
      'Automated Whatsapp Business / Custom Email reply',
      '30 days post-launch support',
      'Hosting setup & training',
    ],
    cta: 'Begin Your Journey',
  },
  {
    name: 'Professional',
    tagline: 'Full-stack systems for growing businesses ready to scale',
    price: 'From KES 200K',
    cadence: 'one-time',
    highlight: true,
    features: [
      'Custom web app or mobile application',
      'Backend, database & authentication',
      'Admin dashboard',
      'Payments integration e.g Mpesa',
      'AI feature integration available',
      'Automated Whatsapp Business / Custom Email reply',
      'Advance SEO setup',
      '40 days post-launch support',
      'Performance monitoring',
      'Staff training included',
    ],
    cta: 'Go Professional',
  },
  {
    name: 'Enterprise',
    tagline: 'Complex systems for institutions & high-growth companies',
    price: 'Custom quote',
    cadence: '',
    highlight: false,
    features: [
      'Multi-platform ecosystems (web + mobile + USSD)',
      'Custom AI / ML systems via Mwamba AI',
      'Advanced integrations & APIs',
      'Dedicated project team',
      'SLA-backed uptime & support',
      'Quarterly architecture reviews',
      'Custom training programmes',
      'Long-term partnership',
    ],
    cta: 'Talk to Sales',
  },
]

const FAQS = [
  {
    q: 'How long does a typical project take?',
    a: 'Starter projects take 2–4 weeks. Professional builds run 4–12 weeks. Enterprise engagements are scoped individually but usually run 3–6 months.',
  },
  {
    q: 'Do you offer ongoing maintenance after launch?',
    a: 'Yes. Every project includes 30 days of free post-launch support. After that, we offer monthly retainer packages tailored to the system we built for you.',
  },
  {
    q: 'Can I pay in instalments?',
    a: 'Yes. Most projects are split into three payments — 50% at kick-off, 20% at the design-sign-off milestone, and 30% on launch.',
  },
  {
    q: 'Do you work with clients outside Kenya?',
    a: 'Absolutely. We have shipped projects across East Africa and beyond. We work remote-first with weekly syncs in your timezone.',
  },
  {
    q: 'What if I do not know exactly what I need yet?',
    a: 'That is exactly what the free 30-minute discovery call is for. We help you map your problem and decide the right scope before any contracts are signed.',
  },
]

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  function toggleFaq(index: number) {
    try {
      setOpenFaq((current) => (current === index ? null : index))
    } catch (error) {
      console.error('[PricingPage] FAQ toggle error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-ky-base">
      <Header />

      <PageHero
        label="Pricing"
        labelIcon="heroicons:banknotes"
        headline={{ lead: 'Transparent pricing.', accent: 'No surprises', tail: '.' }}
        subtitle="Every Kyfaru engagement is priced on the scope of the system we build not on hours. Three starting points, infinite custom paths."
      />

      {/* Tier grid */}
      <section className="bg-ky-base py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-6 md:gap-8">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                'relative bg-ky-surface p-8 md:p-10 flex flex-col gap-7',
                tier.highlight ? 'ghost-border ambient-glow' : 'ghost-border',
              )}
            >
              {tier.highlight && (
                <>
                  {/* Top gold accent line */}
                  <div className="absolute top-0 left-0 right-0 h-px gold-gradient-bg" />
                  {/* Popular badge */}
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 gold-gradient-bg text-ky-base text-[10px] font-bold tracking-[0.2em] font-display uppercase px-3 py-1">
                    Most Popular
                  </span>
                </>
              )}

              <div>
                <h3 className="text-2xl font-semibold text-ky-ivory font-display mb-2">{tier.name}</h3>
                <p className="text-sm text-ky-muted font-inter leading-relaxed">{tier.tagline}</p>
              </div>

              <div>
                <div className="text-4xl md:text-5xl font-semibold text-ky-gold font-display leading-none mb-1">
                  {tier.price}
                </div>
                {tier.cadence && (
                  <div className="text-xs text-ky-faint tracking-wider font-inter">{tier.cadence}</div>
                )}
              </div>

              <ul className="flex flex-col gap-3 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm text-ky-ivory/85 font-inter leading-relaxed">
                    <Icon icon="solar:check-circle-linear" className="w-4 h-4 mt-1 text-ky-green-hi flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/quote"
                className={cn(
                  'inline-flex items-center justify-center gap-3 px-6 py-3.5 text-sm tracking-[0.15em] font-display font-semibold uppercase transition-all',
                  tier.highlight
                    ? 'gold-gradient-bg text-ky-base hover:scale-[1.02]'
                    : 'ghost-border text-ky-ivory hover:bg-ky-raised'
                )}
              >
                <span>{tier.cta}</span>
                <Icon icon="heroicons:arrow-right" className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="text-center text-xs text-ky-faint mt-12 font-inter">
          All prices in Kenyan Shillings. VAT excluded. Custom requirements always quoted separately.
        </p>
      </section>

      {/* FAQ */}
      <section className="bg-ky-dark py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-ky-gold" />
              <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-ky-gold font-display">FAQ</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold text-ky-ivory font-display tracking-tight">
              Common questions.
            </h2>
          </div>

          <div className="bg-ky-base ghost-border">
            {FAQS.map((faq, index) => {
              const open = openFaq === index
              return (
                <div key={faq.q} className={cn('transition-all', open ? 'bg-ky-surface' : 'bg-transparent')}>
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center gap-4 px-6 md:px-8 py-6 text-left"
                    aria-expanded={open}
                  >
                    <h3 className="flex-1 text-base md:text-lg font-semibold text-ky-ivory font-display">
                      {faq.q}
                    </h3>
                    <Icon
                      icon="heroicons:plus"
                      className={cn(
                        'w-5 h-5 text-ky-gold transition-transform duration-300',
                        open && 'rotate-45'
                      )}
                    />
                  </button>
                  {open && (
                    <div className="px-6 md:px-8 pb-7">
                      <p className="text-sm md:text-base text-ky-muted leading-relaxed font-inter max-w-2xl">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
