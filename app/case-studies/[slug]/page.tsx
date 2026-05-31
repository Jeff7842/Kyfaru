// ============================================================
// CASE STUDY DETAIL PAGE (dynamic [slug])
// Full structured layout — challenge / solution / results.
// ============================================================

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Icon } from '@iconify/react'
import Header from '@/components/header/header'
import Footer from '@/components/layout/Footer'
import CTASection from '@/components/sections/CTASection'
import { getCaseStudyBySlug, caseStudies } from '@/lib/data/case-studies'

interface PageProps {
  params: Promise<{ slug: string }>
}

/** Pre-generate static paths for all case studies */
export function generateStaticParams() {
  try {
    return caseStudies.map((cs) => ({ slug: cs.slug }))
  } catch (error) {
    console.error('[CaseStudy] generateStaticParams error:', error)
    return []
  }
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { slug } = await params
  const study = getCaseStudyBySlug(slug)

  if (!study) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-ky-base">
      <Header />

      {/* Hero band */}
      <section className="relative bg-ky-dark pt-32 md:pt-44 pb-16 md:pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-sm text-ky-muted hover:text-ky-gold transition-colors font-display tracking-wider mb-8"
          >
            <Icon icon="heroicons:arrow-left" className="w-4 h-4" />
            <span>BACK TO CASE STUDIES</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="text-[10px] font-medium tracking-[0.25em] uppercase px-2.5 py-1 bg-ky-raised text-ky-gold-hi font-display">
              {study.industry}
            </span>
            <span className="text-xs text-ky-faint font-inter">{study.duration}</span>
            <span className="text-xs text-ky-faint font-inter">·</span>
            <span className="text-xs text-ky-faint font-display tracking-wider uppercase">{study.clientName}</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold text-ky-ivory tracking-tight font-display leading-[1.05]">
            {study.title}
          </h1>
        </div>
      </section>

      {/* Body */}
      <section className="bg-ky-base py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6 flex flex-col gap-16">
          {/* Challenge */}
          <div>
            <div className="text-xs tracking-[0.25em] uppercase text-ky-gold font-display mb-3">01 - The Challenge</div>
            <h2 className="text-2xl md:text-3xl font-semibold text-ky-ivory font-display tracking-tight mb-5">
              The problem we were brought in to solve.
            </h2>
            <p className="text-base md:text-lg text-ky-muted leading-relaxed font-inter">
              {study.challenge}
            </p>
          </div>

          {/* Solution */}
          <div>
            <div className="text-xs tracking-[0.25em] uppercase text-ky-gold font-display mb-3">02 - The Solution</div>
            <h2 className="text-2xl md:text-3xl font-semibold text-ky-ivory font-display tracking-tight mb-5">
              What Kyfaru designed, built, and shipped.
            </h2>
            <p className="text-base md:text-lg text-ky-muted leading-relaxed font-inter">
              {study.solution}
            </p>
          </div>

          {/* Results */}
          <div>
            <div className="text-xs tracking-[0.25em] uppercase text-ky-gold font-display mb-3">03 - The Results</div>
            <h2 className="text-2xl md:text-3xl font-semibold text-ky-ivory font-display tracking-tight mb-8">
              Measurable outcomes after launch.
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              {study.results.map((result) => (
                <div key={result} className="bg-ky-surface ghost-border p-6 flex gap-4 items-start">
                  <div className="w-9 h-9 bg-ky-raised flex items-center justify-center text-ky-gold flex-shrink-0">
                    <Icon icon="heroicons:check" className="w-4 h-4" />
                  </div>
                  <p className="text-sm md:text-base text-ky-ivory leading-snug font-inter">{result}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection />
      <Footer />
    </div>
  )
}
