// ============================================================
// TERMS OF SERVICE — MASTER HUB PAGE
// Index of all Kyfaru legal documents.
// ============================================================

import Link from 'next/link'
import { Icon } from '@iconify/react'
import Header from '@/components/header/header'
import Footer from '@/components/layout/Footer'

const CARDS = [
  {
    icon: 'ph:file-text-bold',
    title: 'Service Agreement',
    description:
      'Scope of work, deliverables, timelines, change requests, and all obligations of both Kyfaru and the Client.',
    href: '/terms/service-agreement',
    linkLabel: 'Read →',
  },
  {
    icon: 'ph:shield-check-bold',
    title: 'Privacy Policy',
    description:
      'How Kyfaru collects, stores, uses, and protects personal data in compliance with the Kenya Data Protection Act 2019 and applicable international law.',
    href: '/privacy-policy',
    linkLabel: 'Read →',
  },
  {
    icon: 'ph:headset-bold',
    title: 'Support & Maintenance Policy',
    description:
      'Free support periods, Monthly Maintenance Retainer terms, response times, monthly reports, and service suspension procedures.',
    href: '/terms/support-policy',
    linkLabel: 'Read →',
  },
  {
    icon: 'ph:currency-circle-dollar-bold',
    title: 'Refund & Payment Policy',
    description:
      'Payment milestones, forfeit amounts, late payment charges, cancellation consequences, and credential handover conditions.',
    href: '/terms/refund-policy',
    linkLabel: 'Read →',
  },
  {
    icon: 'ph:check-square-bold',
    title: 'Acceptable Use Policy',
    description:
      'What clients may and may not do with systems built by Kyfaru, including data handling, third-party integrations, and legal compliance obligations.',
    href: '/terms/acceptable-use',
    linkLabel: 'Read →',
  },
  {
    icon: 'ph:envelope-simple-bold',
    title: 'Legal Enquiries',
    description:
      'To request a printed copy of any terms, report a concern, or contact Kyfaru\'s legal team.',
    email: 'legal@kyfaru.com',
    href: null,
    linkLabel: null,
  },
]

const LAW_COLS = [
  {
    icon: 'ph:scales-bold',
    label: 'GOVERNING LAW',
    value: 'Laws of Kenya',
    sub: 'Law of Contract Act, Cap. 23',
  },
  {
    icon: 'ph:gavel-bold',
    label: 'DISPUTE RESOLUTION',
    value: 'Mediation then Arbitration',
    sub: 'Arbitration Act, Cap. 49, Nairobi',
  },
  {
    icon: 'ph:shield-bold',
    label: 'DATA PROTECTION',
    value: 'Kenya DPA 2019 Compliant',
    sub: 'Office of the Data Protection Commissioner',
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-ky-base">
      <Header />

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ky-green-mid pt-32 md:pt-44 pb-20 md:pb-28">
        <div className="absolute inset-0 ky-hero-bg-dots opacity-[0.18] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-10 left-1/3 w-[420px] h-[420px] rounded-full bg-white/5 blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-[340px] h-[340px] rounded-full bg-ky-gold/10 blur-[100px]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <p className="text-[11px] font-display tracking-[0.25em] uppercase text-ky-gold mb-4">
            Legal Information
          </p>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-5 tracking-tight">
            Kyfaru Terms of Service
          </h1>
          <p className="text-base md:text-lg text-white/75 max-w-2xl mx-auto leading-relaxed font-inter mb-10">
            These terms govern all projects, services, and engagements undertaken by Kyfaru. By signing a Kyfaru Project Agreement, you agree to these
            terms in full.
          </p>

          {/* Info pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: 'ph:calendar-blank-bold', text: 'Effective: 1 January 2025' },
              { icon: 'ph:map-pin-bold', text: 'Governing Law: Kenya' },
              { icon: 'ph:scales-bold', text: 'Arbitration: Nairobi' },
            ].map((pill) => (
              <span
                key={pill.text}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-[13px] font-inter"
              >
                <Icon icon={pill.icon} className="w-3.5 h-3.5 text-ky-gold shrink-0" />
                {pill.text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INCORPORATION NOTICE ─────────────────────────────── */}
      <section className="bg-ky-base py-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex gap-5 bg-ky-gold/8 border border-ky-gold/30 border-l-[5px] border-l-ky-gold ky-rounded p-6 md:p-8">
            <Icon icon="ph:scales-bold" className="w-8 h-8 text-ky-gold shrink-0 mt-0.5" />
            <div>
              <p className="text-base font-display font-semibold text-ky-ivory mb-2">
                These terms are incorporated by reference into every Kyfaru Project Agreement.
              </p>
              <p className="text-sm text-ky-muted leading-relaxed font-inter">
                When a Client signs a Kyfaru Project Agreement, they simultaneously agree to all terms
                published on this page and all sub-pages listed below. A printed copy of any page is
                available upon written request.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LEGAL DOCUMENTS GRID ─────────────────────────────── */}
      <section className="bg-ky-base py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-center text-3xl md:text-4xl font-display font-bold text-ky-ivory mb-12">
            Our Legal Documents
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CARDS.map((card) => (
              <div
                key={card.title}
                className="group bg-ky-surface border border-ky-border ky-rounded p-7 flex flex-col gap-4 hover:border-ky-green-hi hover:shadow-[0_8px_32px_rgba(74,175,110,0.10)] hover:-translate-y-1 transition-all duration-200"
              >
                <Icon icon={card.icon} className="w-9 h-9 text-ky-green-hi" />
                <div className="flex-1">
                  <h3 className="text-lg font-display font-semibold text-ky-ivory mb-2">{card.title}</h3>
                  <p className="text-sm text-ky-muted leading-relaxed font-inter">{card.description}</p>
                  {card.email && (
                    <a
                      href={`mailto:${card.email}`}
                      className="mt-3 inline-block text-sm text-ky-gold hover:text-ky-gold-hi transition-colors font-display"
                    >
                      {card.email}
                    </a>
                  )}
                </div>
                {card.href && (
                  <Link
                    href={card.href}
                    className="text-sm font-display font-semibold text-ky-green-hi hover:text-ky-gold transition-colors"
                  >
                    {card.linkLabel}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── GOVERNING LAW STRIP ──────────────────────────────── */}
      <section className="bg-ky-dark border-t border-ky-border py-14">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
            {LAW_COLS.map((col) => (
              <div key={col.label} className="flex items-start gap-4">
                <Icon icon={col.icon} className="w-8 h-8 text-ky-green-hi shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-display tracking-[0.22em] uppercase text-ky-faint mb-1">
                    {col.label}
                  </p>
                  <p className="text-lg font-display font-bold text-ky-ivory">{col.value}</p>
                  <p className="text-[13px] text-ky-muted font-inter mt-0.5">{col.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LAST UPDATED STRIP ───────────────────────────────── */}
      <section className="bg-ky-base border-t border-ky-border py-6">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-[13px] text-center text-ky-faint font-inter">
            These terms were last updated on <span className="text-ky-muted">1 January 2025</span>. Version{' '}
            <span className="text-ky-muted">1.0</span>. Kyfaru reserves the right to update these terms at
            any time with 30 days notice to active clients. Continued engagement after the notice period
            constitutes acceptance.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
