'use client'

// ============================================================
// CONTACT PAGE — Simple general enquiry form
// Fields: first name, last name, email, topic dropdown, message.
// ============================================================

import { useState, useRef, useEffect, FormEvent } from 'react'
import Header from '@/components/header/header'
import Footer from '@/components/layout/Footer'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import PageHero from '@/components/shared/PageHero'

const TOPIC_OPTIONS = [
  { value: 'General Inquiry',  icon: 'heroicons:chat-bubble-oval-left-ellipsis' },
  { value: 'Partnership',      icon: 'heroicons:handshake' },
  { value: 'Support',          icon: 'heroicons:lifebuoy' },
  { value: 'Feedback',         icon: 'heroicons:megaphone' },
  { value: 'Other',            icon: 'heroicons:ellipsis-horizontal-circle' },
]

type ContactForm = {
  firstName: string
  lastName: string
  email: string
  topic: string
  message: string
}

const CONTACT_INFO = [
  { icon: 'heroicons:envelope', label: 'Email', value: 'hello@kyfaru.com', href: 'mailto:hello@kyfaru.com' },
  { icon: 'heroicons:phone', label: 'Phone', value: '+254 700 000 000', href: 'tel:+254700000000' },
  { icon: 'heroicons:map-pin', label: 'Location', value: 'Nairobi, Kenya', href: null },
  { icon: 'heroicons:clock', label: 'Hours', value: 'Mon — Fri, 9am — 6pm EAT', href: null },
]

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>({
    firstName: '',
    lastName: '',
    email: '',
    topic: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  function handleChange(field: keyof ContactForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    console.log('[Contact form submission]', form)
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-ky-base">
      <Header />

      <PageHero
        label="Contact Us"
        labelIcon="heroicons:chat-bubble-left-right"
        headline={{
          lead: 'Get in',
          accent: 'touch',
          tail: '.',
        }}
        subtitle="Questions, feedback, or just want to say hello? We&rsquo;d love to hear from you."
      />

      <section className="bg-ky-base py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="bg-ky-surface ghost-border ky-rounded p-10 md:p-14 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full gold-gradient-bg flex items-center justify-center text-ky-base">
                  <Icon icon="heroicons:check" className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-semibold text-ky-ivory font-display mb-4">
                  Message sent.
                </h2>
                <p className="text-ky-muted font-inter mb-8 max-w-md mx-auto">
                  Thank you, {form.firstName || 'friend'}. We'll get back to you shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false)
                    setForm({ firstName: '', lastName: '', email: '', topic: '', message: '' })
                  }}
                  className="ghost-border ky-rounded-sm px-6 py-3 text-sm tracking-wider font-display text-ky-ivory hover:bg-ky-raised transition-colors"
                >
                  SEND ANOTHER
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-ky-surface ghost-border ky-rounded p-8 md:p-12 flex flex-col gap-6">
                <h2 className="text-2xl md:text-3xl font-semibold text-ky-ivory font-display mb-2">
                  Send us a message
                </h2>
                <p className="text-sm text-ky-muted font-inter -mt-4 mb-2">
                  All fields are required.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField label="First name" required>
                    <input
                      type="text"
                      required
                      value={form.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      className={inputClasses}
                      placeholder="Jane"
                    />
                  </FormField>
                  <FormField label="Last name" required>
                    <input
                      type="text"
                      required
                      value={form.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      className={inputClasses}
                      placeholder="Wanjiku"
                    />
                  </FormField>
                </div>

                <FormField label="Email address" required>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={inputClasses}
                    placeholder="jane@example.com"
                  />
                </FormField>

                <FormField label="Topic" required>
                  <TopicDropdown
                    value={form.topic}
                    onChange={(v) => handleChange('topic', v)}
                  />
                </FormField>

                <FormField label="Your message" required>
                  <textarea
                    required
                    rows={6}
                    value={form.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    className={cn(inputClasses, 'resize-none')}
                    placeholder="How can we help you?"
                  />
                </FormField>

                <button
                  type="submit"
                  className="group inline-flex items-center justify-center gap-3 gold-gradient-bg text-ky-base px-8 py-4 font-semibold text-sm tracking-[0.15em] font-display uppercase transition-transform hover:scale-[1.01] active:scale-[0.99] ky-rounded-sm mt-4"
                >
                  <span>Send Message</span>
                  <Icon icon="heroicons:paper-airplane" className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </form>
            )}
          </div>

          {/* Sidebar — contact info */}
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
              <h3 className="text-xs tracking-[0.2em] text-ky-gold font-display mb-3">NEED A PROJECT QUOTE?</h3>
              <p className="text-sm text-ky-muted font-inter mb-5">
                For detailed project proposals with timelines and pricing, use our quotation form.
              </p>
              <Link
                href="/quote"
                className="inline-flex items-center gap-2 text-ky-gold hover:text-ky-gold-hi transition-colors text-sm font-display tracking-wider"
              >
                <span>GET A QUOTE</span>
                <Icon icon="heroicons:arrow-right" className="w-4 h-4" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </div>
  )
}

// ── Local components & classes ──

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

function TopicDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = TOPIC_OPTIONS.find((o) => o.value === value)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((p) => !p)}
        className={cn(
          inputClasses,
          'flex items-center justify-between gap-2 text-left',
          !value && 'text-ky-faint'
        )}
      >
        <span className="flex items-center gap-2">
          {selected && (
            <Icon icon={selected.icon} className="w-4 h-4 text-ky-gold shrink-0" />
          )}
          {selected ? selected.value : 'Select a topic…'}
        </span>
        <Icon
          icon="heroicons:chevron-down"
          className={cn('w-4 h-4 text-ky-faint transition-transform shrink-0', open && 'rotate-180')}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <ul
          role="listbox"
          className="absolute z-50 left-0 right-0 top-full mt-1 bg-ky-surface ghost-border ky-rounded-sm shadow-2xl shadow-black/40 overflow-hidden"
        >
          {TOPIC_OPTIONS.map((option) => (
            <li
              key={option.value}
              role="option"
              aria-selected={value === option.value}
              onClick={() => { onChange(option.value); setOpen(false) }}
              className={cn(
                'flex items-center gap-3 px-4 py-3 cursor-pointer text-sm font-inter transition-colors',
                value === option.value
                  ? 'bg-ky-raised text-ky-gold'
                  : 'text-ky-ivory hover:bg-ky-raised hover:text-ky-gold'
              )}
            >
              <Icon icon={option.icon} className="w-4 h-4 shrink-0" />
              <span>{option.value}</span>
              {value === option.value && (
                <Icon icon="heroicons:check" className="w-3.5 h-3.5 ml-auto text-ky-gold" />
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Hidden native input so the form required check still works */}
      <input type="text" required value={value} onChange={() => {}} className="sr-only" aria-hidden />
    </div>
  )
}
