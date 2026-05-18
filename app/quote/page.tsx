'use client'

// ============================================================
// QUOTE PAGE
// Full quotation form with: Why Choose Us, Form, What Happens Next,
// Process, and Testimonials sections.
// ============================================================

import { useState, useEffect, useRef, FormEvent } from 'react'
import { motion, useInView, useAnimation, AnimatePresence } from 'motion/react'
import Header from '@/components/header/header'
import Footer from '@/components/layout/Footer'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import KySelect, { type KySelectOption } from '@/components/ui/KySelect'
import KyPhoneInput from '@/components/ui/KyPhoneInput'
import KyLocationInput from '@/components/ui/KyLocationInput'
import PageHero from '@/components/shared/PageHero'

type FormState = {
  name: string
  email: string
  company: string
  phoneCountry: string
  phoneNumber: string
  location: string
  service: string
  budget: string
  message: string
}

const SERVICE_OPTIONS: KySelectOption[] = [
  { value: 'web',     label: 'Web App Development',    icon: 'heroicons:globe-alt',           description: 'Next.js platforms & SaaS' },
  { value: 'mobile',  label: 'Mobile App Development', icon: 'heroicons:device-phone-mobile', description: 'iOS + Android' },
  { value: 'design',  label: 'UI/UX Design',           icon: 'heroicons:paint-brush',         description: 'Product & brand systems' },
  { value: 'ussd',    label: 'USSD Solutions',         icon: 'heroicons:signal',              description: 'Reach any phone' },
  { value: 'ai',      label: 'AI Integration',         icon: 'heroicons:cpu-chip',            description: 'Powered by Mwamba AI' },
  { value: 'backend', label: 'Backend & Database',     icon: 'heroicons:server-stack',        description: 'APIs, auth, infra' },
  { value: 'other',   label: 'Something else',         icon: 'heroicons:sparkles',            description: 'Tell us about it' },
]

const BUDGET_OPTIONS: KySelectOption[] = [
  { value: 'starter',     label: 'Under KES 200,000',        icon: 'heroicons:banknotes' },
  { value: 'professional', label: 'KES 200,000 — 500,000',   icon: 'heroicons:banknotes' },
  { value: 'growth',      label: 'KES 500,000 — 1,500,000',  icon: 'heroicons:chart-bar-square' },
  { value: 'enterprise',  label: 'KES 1,500,000+',           icon: 'heroicons:building-office-2' },
  { value: 'unknown',     label: 'Not sure yet',             icon: 'heroicons:question-mark-circle' },
]

const CONTACT_INFO = [
  { icon: 'heroicons:envelope',          label: 'Email',    value: 'hello@kyfaru.com',     href: 'mailto:hello@kyfaru.com' },
  { icon: 'heroicons:phone',             label: 'Phone',    value: '+254 700 000 000',    href: 'tel:+254700000000' },
  { icon: 'heroicons:map-pin',           label: 'Location', value: 'Nairobi, Kenya',      href: null },
  { icon: 'heroicons:clock',             label: 'Hours',    value: 'Mon — Fri, 9am — 6pm EAT', href: null },
]

export default function QuotePage() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    company: '',
    phoneCountry: 'KE',
    phoneNumber: '',
    location: '',
    service: '',
    budget: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    console.log('[Quote form submission]', form)
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-ky-base">
      <Header />

      <PageHero
        label="Request a Quote"
        labelIcon="heroicons:document-text"
        headline={{
          lead: 'Tell us about',
          accent: 'your project',
          tail: '.',
        }}
        subtitle="Get a detailed proposal with timelines and pricing. We reply within 24 hours — no bots, no sales scripts."
      />

      {/* ═══════ WHY CHOOSE US ═══════ */}
      <section className="bg-ky-dark py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] font-display text-ky-gold uppercase mb-4">
              <Icon icon="heroicons:shield-check" className="w-4 h-4" />
              Why Kyfaru
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-ky-ivory tracking-tight">
              Why clients choose us
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY_CHOOSE_US.map((item) => (
              <div key={item.title} className="bg-ky-surface ghost-border ky-rounded p-6 flex flex-col gap-4">
                <div className="w-11 h-11 flex items-center justify-center bg-ky-raised ky-rounded-sm text-ky-gold">
                  <Icon icon={item.icon} className="w-5 h-5" />
                </div>
                <h3 className="font-display font-semibold text-ky-ivory text-base">{item.title}</h3>
                <p className="text-sm text-ky-muted leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ QUOTE FORM ═══════ */}
      <section className="bg-ky-base py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="bg-ky-surface ghost-border ky-rounded p-10 md:p-14 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full gold-gradient-bg flex items-center justify-center text-ky-base">
                  <Icon icon="heroicons:check" className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-semibold text-ky-ivory font-display mb-4">
                  Quote request received.
                </h2>
                <p className="text-ky-muted font-inter mb-8 max-w-md mx-auto">
                  Thank you, {form.name || 'friend'}. The Kyfaru team will send you a detailed proposal within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false)
                    setForm({ name: '', email: '', company: '', phoneCountry: 'KE', phoneNumber: '', location: '', service: '', budget: '', message: '' })
                  }}
                  className="ghost-border ky-rounded-sm px-6 py-3 text-sm tracking-wider font-display text-ky-ivory hover:bg-ky-raised transition-colors"
                >
                  SEND ANOTHER
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-ky-surface ghost-border ky-rounded p-8 md:p-12 flex flex-col gap-6">
                <h2 className="text-2xl md:text-3xl font-semibold text-ky-ivory font-display mb-2">
                  Project quotation
                </h2>
                <p className="text-sm text-ky-muted font-inter -mt-4 mb-2">
                  All fields except company are required.
                </p>

                <FormField label="Your name" required>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={inputClasses}
                    placeholder="Jane Wanjiku"
                  />
                </FormField>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField label="Email" required>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className={inputClasses}
                      placeholder="jane@example.com"
                    />
                  </FormField>
                  <FormField label="Company (optional)">
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => handleChange('company', e.target.value)}
                      className={inputClasses}
                      placeholder="Acme Ltd"
                    />
                  </FormField>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField label="Phone" required>
                    <KyPhoneInput
                      countryCode={form.phoneCountry}
                      number={form.phoneNumber}
                      onCountryChange={(v) => handleChange('phoneCountry', v)}
                      onNumberChange={(v) => handleChange('phoneNumber', v)}
                      required
                    />
                  </FormField>
                  <FormField label="Location" required>
                    <KyLocationInput
                      value={form.location}
                      onChange={(v) => handleChange('location', v)}
                      placeholder="e.g. Nairobi, Kenya"
                      required
                    />
                  </FormField>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField label="Service needed" required>
                    <KySelect
                      value={form.service}
                      onValueChange={(v) => handleChange('service', v)}
                      options={SERVICE_OPTIONS}
                      placeholder="Choose a service…"
                      ariaLabel="Service needed"
                      required
                    />
                  </FormField>
                  <FormField label="Estimated budget" required>
                    <KySelect
                      value={form.budget}
                      onValueChange={(v) => handleChange('budget', v)}
                      options={BUDGET_OPTIONS}
                      placeholder="Select a range…"
                      ariaLabel="Estimated budget"
                      required
                    />
                  </FormField>
                </div>

                <FormField label="Tell us about your project" required>
                  <textarea
                    required
                    rows={6}
                    value={form.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    className={cn(inputClasses, 'resize-none')}
                    placeholder="What problem are you trying to solve? What does success look like for you?"
                  />
                </FormField>

                <button
                  type="submit"
                  className="group inline-flex items-center justify-center gap-3 gold-gradient-bg text-ky-base px-8 py-4 font-semibold text-sm tracking-[0.15em] font-display uppercase transition-transform hover:scale-[1.01] active:scale-[0.99] ky-rounded-sm mt-4"
                >
                  <span>Request Quote</span>
                  <Icon icon="heroicons:paper-airplane" className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </form>
            )}
          </div>

          <aside className="flex flex-col gap-4">
            <div className="bg-ky-surface ghost-border ky-rounded p-7">
              <h3 className="text-xs tracking-[0.2em] text-ky-gold font-display mb-5">DIRECT CONTACT</h3>
              <ul className="flex flex-col gap-5">
                {CONTACT_INFO.map((c) => (
                  <li key={c.label} className="flex gap-4 items-start">
                    <div className="w-9 h-9 bg-ky-raised ky-rounded-sm flex items-center justify-center text-ky-green-hi shrink-0">
                      <Icon icon={c.icon} className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs text-ky-faint tracking-wider font-display uppercase mb-1">{c.label}</div>
                      {c.href ? (
                        <a href={c.href} className="text-sm text-ky-ivory hover:text-ky-gold transition-colors font-inter">{c.value}</a>
                      ) : (
                        <div className="text-sm text-ky-ivory font-inter">{c.value}</div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-ky-surface ghost-border ky-rounded p-7">
              <h3 className="text-xs tracking-[0.2em] text-ky-gold font-display mb-3">PREFER A QUICK CALL?</h3>
              <p className="text-sm text-ky-muted font-inter mb-5">
                Book a free 30-minute discovery call. No prep needed — just bring your questions.
              </p>
              <Link
                href="tel:+254700000000"
                className="inline-flex items-center gap-2 text-ky-gold hover:text-ky-gold-hi transition-colors text-sm font-display tracking-wider"
              >
                <span>SCHEDULE A CALL</span>
                <Icon icon="heroicons:arrow-right" className="w-4 h-4" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* ═══════ WHAT HAPPENS NEXT ═══════ */}
      <section className="bg-ky-dark py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] font-display text-ky-gold uppercase mb-4">
              <Icon icon="heroicons:arrow-path" className="w-4 h-4" />
              After You Submit
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-ky-ivory tracking-tight">
              What happens next
            </h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-ky-border" />

            <div className="flex flex-col gap-10">
              {WHAT_HAPPENS_NEXT.map((step, i) => (
                <div key={step.title} className="relative flex gap-5 md:gap-7 pl-2">
                  <div className="relative z-10 w-10 h-10 md:w-12 md:h-12 shrink-0 flex items-center justify-center bg-ky-surface ghost-border rounded-full text-ky-gold">
                    <Icon icon={step.icon} className="w-5 h-5" />
                  </div>
                  <div className="pt-1.5">
                    <div className="text-[10px] font-display tracking-[0.3em] text-ky-faint mb-1">
                      STEP {String(i + 1).padStart(2, '0')}
                    </div>
                    <h3 className="font-display font-semibold text-ky-ivory text-lg mb-1.5">{step.title}</h3>
                    <p className="text-sm text-ky-muted leading-relaxed max-w-lg">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ OUR PROCESS ═══════ */}
      <section className="bg-ky-base py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] font-display text-ky-gold uppercase mb-4">
              <Icon icon="heroicons:cog-6-tooth" className="w-4 h-4" />
              Our Process
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-ky-ivory tracking-tight">
              How we build your project
            </h2>
            <p className="text-ky-muted mt-4 max-w-2xl mx-auto">
              A proven, repeatable process that ensures quality delivery on every engagement.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BUILD_PROCESS.map((step, i) => (
              <div key={step.title} className="bg-ky-surface ghost-border ky-rounded p-7 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-display tracking-[0.3em] text-ky-faint">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="w-9 h-9 flex items-center justify-center bg-ky-raised ky-rounded-sm text-ky-gold">
                    <Icon icon={step.icon} className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="font-display font-semibold text-ky-ivory">{step.title}</h3>
                <p className="text-sm text-ky-muted leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <QuoteTestimonials />

      <Footer />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════

const WHY_CHOOSE_US = [
  { icon: 'heroicons:clock', title: '24hr Response', description: 'We get back to every enquiry within a business day. No ghosting, no auto-replies.' },
  { icon: 'heroicons:code-bracket', title: 'End-to-End Build', description: 'From design to deployment and beyond — one team owns the entire lifecycle.' },
  { icon: 'heroicons:shield-check', title: 'Quality Guarantee', description: 'Rigorous QA, automated testing, and post-launch support included in every project.' },
  { icon: 'heroicons:currency-dollar', title: 'Transparent Pricing', description: 'Fixed-price quotes with milestone payments. No hidden fees or scope surprises.' },
]

const WHAT_HAPPENS_NEXT = [
  { icon: 'heroicons:document-magnifying-glass', title: 'We review your quote', description: 'Our team reads your submission carefully and prepares initial thoughts on scope, timeline, and feasibility.' },
  { icon: 'heroicons:phone-arrow-up-right', title: 'An agent calls you', description: 'Within 24 hours, a dedicated project agent reaches out by phone to discuss your needs further.' },
  { icon: 'heroicons:chat-bubble-left-right', title: 'We agree on pricing', description: 'Based on your specific requirements, we present a transparent, fixed-price quote for your solution.' },
  { icon: 'heroicons:light-bulb', title: 'We understand & propose', description: 'Before the main call, we research your problem domain and come up with a quick proposed solution.' },
  { icon: 'heroicons:video-camera', title: '30-minute strategy call', description: 'A focused call to align on the approach, walk through the proposed architecture, and answer all questions.' },
  { icon: 'heroicons:document-check', title: 'Invoice & legal', description: 'You receive a detailed invoice and contract. Once signed, we kick off development immediately.' },
]

const BUILD_PROCESS = [
  { icon: 'heroicons:magnifying-glass', title: 'Discovery', description: 'Deep-dive into your business goals, users, and technical requirements.' },
  { icon: 'heroicons:pencil-square', title: 'Design', description: 'UI/UX wireframes and high-fidelity mockups for your approval before any code is written.' },
  { icon: 'heroicons:code-bracket-square', title: 'Development', description: 'Agile sprints with weekly demos so you see progress in real-time.' },
  { icon: 'heroicons:bug-ant', title: 'Testing & QA', description: 'Comprehensive automated and manual testing across devices and scenarios.' },
  { icon: 'heroicons:rocket-launch', title: 'Launch', description: 'Deployment to production with monitoring, performance tuning, and go-live support.' },
  { icon: 'heroicons:wrench-screwdriver', title: 'Support & Growth', description: 'Ongoing maintenance, feature iterations, and scaling as your business grows.' },
]

const QUOTE_TESTIMONIALS = [
  { id: 1, name: 'James Mwangi', role: 'CTO', company: 'FinTech Africa', content: 'Kyfaru delivered our mobile banking platform in half the time we expected. Their process was transparent and the quality exceeded our standards.', rating: 5 },
  { id: 2, name: 'Sarah Odhiambo', role: 'Founder', company: 'EduTech Kenya', content: 'From the first call to launch, Kyfaru felt like an extension of our team. They understood our vision immediately and executed flawlessly.', rating: 5 },
  { id: 3, name: 'David Kimani', role: 'Head of Digital', company: 'HealthCorp', content: 'The strategy call alone was worth it. They came prepared with solutions before we even finished explaining the problem. Remarkable team.', rating: 5 },
]

// ═══════════════════════════════════════════════════════════════
// TESTIMONIALS SECTION
// ═══════════════════════════════════════════════════════════════

function QuoteTestimonials() {
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) controls.start('visible')
  }, [isInView, controls])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((c) => (c + 1) % QUOTE_TESTIMONIALS.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section ref={sectionRef} className="bg-ky-dark py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20"
        >
          {/* Left: heading + nav dots */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
            className="flex flex-col justify-center"
          >
            <span className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] font-display text-ky-gold uppercase mb-4">
              <Icon icon="heroicons:star" className="w-4 h-4" />
              Client Stories
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-ky-ivory tracking-tight mb-4">
              Loved by founders & teams
            </h2>
            <p className="text-ky-muted max-w-md mb-8">
              Don't just take our word for it — hear from clients who trusted us with their most important projects.
            </p>
            <div className="flex items-center gap-3">
              {QUOTE_TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={cn(
                    'h-2.5 rounded-full transition-all duration-300',
                    activeIndex === i ? 'w-10 bg-ky-gold' : 'w-2.5 bg-ky-border'
                  )}
                  aria-label={`View testimonial ${i + 1}`}
                />
              ))}
            </div>
          </motion.div>

          {/* Right: card carousel */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
            className="relative min-h-[320px] md:min-h-[380px]"
          >
            <AnimatePresence mode="wait">
              {QUOTE_TESTIMONIALS.map((t, i) =>
                activeIndex === i ? (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -60 }}
                    transition={{ duration: 0.45, ease: 'easeInOut' }}
                    className="absolute inset-0"
                  >
                    <div className="bg-ky-surface ghost-border ky-rounded p-8 md:p-10 h-full flex flex-col">
                      <div className="flex gap-1 mb-6">
                        {Array(t.rating).fill(0).map((_, s) => (
                          <Icon key={s} icon="heroicons:star-solid" className="w-5 h-5 text-ky-gold" />
                        ))}
                      </div>
                      <div className="relative flex-1 mb-6">
                        <Icon icon="heroicons:chat-bubble-bottom-center-text" className="absolute -top-1 -left-1 w-8 h-8 text-ky-gold/20" />
                        <p className="relative z-10 text-lg text-ky-ivory leading-relaxed font-inter">
                          &ldquo;{t.content}&rdquo;
                        </p>
                      </div>
                      <div className="border-t border-ky-border pt-5 flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-ky-raised flex items-center justify-center text-ky-gold font-display font-semibold text-sm">
                          {t.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-display font-semibold text-ky-ivory text-sm">{t.name}</div>
                          <div className="text-xs text-ky-muted">{t.role}, {t.company}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : null
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════
// LOCAL COMPONENTS & CLASSES
// ═══════════════════════════════════════════════════════════════

const inputClasses =
  'w-full bg-ky-base ghost-border ky-rounded-sm px-4 py-3.5 text-sm text-ky-ivory font-inter placeholder:text-ky-faint focus:outline-none focus:border-ky-gold-dim focus:bg-ky-raised transition-colors'

function FormField({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs tracking-[0.15em] uppercase text-ky-muted font-display">
        {label} {required && <span className="text-ky-gold">*</span>}
      </span>
      {children}
    </label>
  )
}
