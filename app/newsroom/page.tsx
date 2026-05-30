// ============================================================
// NEWSROOM PAGE
// Editorial layout for company announcements and milestones.
// Add new entries by adding to the ANNOUNCEMENTS array below.
// ============================================================

import Link from 'next/link'
import { Icon } from '@iconify/react'
import Header from '@/components/header/header'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/shared/PageHero'
import { formatDate } from '@/lib/utils'

const ANNOUNCEMENTS = [
  {
    date: '2025-11-12',
    tag: 'Product',
    title: 'Stackable Opens Free Starter Courses for Educators',
    body: 'After a six-month pilot with three Nairobi schools, Stackable — the digital learning arm of Kyfaru — is now open to all East African educators. Three free starter courses are live today: Classroom AI Basics, Digital Records 101, and Mobile-First Teaching.',
    link: '#',
  },
  {
    date: '2026-04-04',
    tag: 'Milestone',
    title: 'Mwamba AI Crosses 1,000,000 Inference Requests',
    body: 'The Mwamba AI engine — the intelligence layer embedded across every Kyfaru product — has now processed over one million inference requests across our deployed customer systems. Up-time remains at 99.97% since launch.',
    link: '#',
  },
]

/** Renders the Newsroom page. */
export default function NewsroomPage() {
  return (
    <div className="min-h-screen bg-ky-base">
      <Header />

      <PageHero
        label="Newsroom"
        labelIcon="heroicons:megaphone"
        headline={{ lead: 'Company news &', accent: 'milestones', tail: '.' }}
        subtitle="Product launches, partnerships, and the milestones we hit along the way."
      />

      {/* Announcements */}
      <section className="bg-ky-base py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6 flex flex-col gap-12">
          {ANNOUNCEMENTS.map((item, i) => (
            <article key={i} className="bg-ky-surface ghost-border p-8 md:p-10">
              <div className="flex items-center gap-4 mb-5">
                <span className="text-[10px] font-medium tracking-[0.2em] uppercase px-2.5 py-1 bg-ky-raised text-ky-gold-hi font-display">
                  {item.tag}
                </span>
                <span className="text-xs text-ky-faint font-inter">{formatDate(item.date)}</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-semibold text-ky-ivory tracking-tight font-display leading-tight mb-5">
                {item.title}
              </h2>

              <p className="text-base text-ky-muted leading-relaxed font-inter mb-7">
                {item.body}
              </p>

              <Link
                href={item.link}
                className="inline-flex items-center gap-2 text-ky-gold hover:text-ky-gold-hi transition-colors text-sm font-display tracking-wider"
              >
                <span>READ THE FULL STORY</span>
                <Icon icon="heroicons:arrow-right" className="w-4 h-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
