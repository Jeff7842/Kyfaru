// ============================================================
// CASE STUDIES LISTING PAGE
// Featured cards with result-stat callouts in gold.
// ============================================================

import Link from 'next/link'
import { Icon } from '@iconify/react'
import Header from '@/components/header/header'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/shared/PageHero'
import CTASection from '@/components/sections/CTASection'
import { getAllCaseStudies } from '@/lib/data/case-studies'

/** Renders the Case Studies listing page. */
export default function CaseStudiesPage() {
  const studies = getAllCaseStudies()

  return (
    <div className="min-h-screen bg-ky-base">
      <Header />

      <PageHero
        label="Case Studies"
        labelIcon="heroicons:document-text"
        headline={{ lead: 'Real projects.', accent: 'Measurable results', tail: '.' }}
        subtitle="Detailed breakdowns of how we partnered with real African businesses to ship systems that moved the needle."
      />

      {/* Studies list */}
      <section className="bg-ky-base py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6 flex flex-col gap-8">
          {studies.map((study) => (
            <Link
              key={study.slug}
              href={`/case-studies/${study.slug}`}
              className="group bg-ky-surface ghost-border card-lift p-8 md:p-12 grid lg:grid-cols-2 gap-10"
            >
              {/* Left — Story */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[10px] font-medium tracking-[0.25em] uppercase px-2.5 py-1 bg-ky-raised text-ky-gold-hi font-display">
                    {study.industry}
                  </span>
                  <span className="text-xs text-ky-faint font-inter">{study.duration}</span>
                </div>
                <p className="text-xs text-ky-faint font-display tracking-wider uppercase mb-2">{study.clientName}</p>
                <h2 className="text-2xl md:text-3xl font-semibold text-ky-ivory tracking-tight font-display leading-tight mb-5 group-hover:text-ky-gold transition-colors">
                  {study.title}
                </h2>
                <p className="text-sm md:text-base text-ky-muted leading-relaxed font-inter mb-6">
                  {study.challenge}
                </p>
                <span className="inline-flex items-center gap-2 text-ky-gold text-sm font-display tracking-wider">
                  READ THE FULL STORY
                  <Icon icon="heroicons:arrow-right" className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>

              {/* Right — Result stats */}
              <div className="grid grid-cols-2 gap-3 content-center">
                {study.results.map((result) => (
                  <div key={result} className="bg-ky-base ghost-border p-5">
                    <Icon icon="heroicons:check-circle" className="w-5 h-5 text-ky-gold mb-3" />
                    <p className="text-sm text-ky-ivory leading-snug font-inter">{result}</p>
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <CTASection />
      <Footer />
    </div>
  )
}
