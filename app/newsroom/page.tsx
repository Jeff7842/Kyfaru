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
    date: '2026-03-12',
    tag: 'Product',
    title: 'Stackable Launches a Six-Month Pilot for Educators',
    body: 'We are kicking off a six-month pilot with 10 schools across multiple regions. Stackable — the digital learning arm of Kyfaru — will roll out three starter courses during the pilot: Classroom AI Basics, Digital Records 101, and Mobile-First Teaching.',
    link: '#',
  },
  {
    date: '2026-05-04',
    tag: 'Technology',
    title: 'Mwamba AI Pilot Crosses 100,000 Inference Requests',
    body: 'The Mwamba AI engine — the intelligence layer being piloted across select Kyfaru products — has now processed over one hundred thousand inference requests in early customer trials. Initial stability has been strong as we prepare for a broader rollout.',
    link: '#',
  },
  {
    date: '2026-06-18',
    tag: 'Research',
    title: 'Kyfaru Opens an Applied Research Track',
    body: 'We are starting a research track focused on practical AI and product learning, with short experiments across education, health, and SME workflows. Findings will feed into product decisions and public learning notes.',
    link: '#',
  },
  {
    date: '2026-07-22',
    tag: 'Learning',
    title: 'Learning Sprints Begin Across the Network',
    body: 'Our teams and partner schools will run monthly learning sprints to test teaching workflows and digital record systems. We will publish a short learning memo after each sprint.',
    link: '#',
  },
  {
    date: '2026-08-14',
    tag: 'Studio',
    title: 'Baoba Ecosystem Enters the Build Phase',
    body: 'We are setting up Baoba, a new ecosystem inside Kyfaru Studio inspired by the baobab tree. It will deliver UI/UX, graphic design, and animation solutions, with a planned launch in September 2026.',
    link: '#',
  },
  {
    date: '2026-09-03',
    tag: 'Research',
    title: 'Prototype Labs Start Exploring Creator Tools',
    body: 'Prototype Labs is exploring creator tools for lesson design, brand kits, and motion assets. Early prototypes are in internal review as we gather feedback from pilot partners.',
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
