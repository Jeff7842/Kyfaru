// ============================================================
// TESTIMONIALS — PLACEHOLDER DATA
// Replace each placeholder with your real client testimonials.
// Keep the same object shape — only change the text values.
// ============================================================

import type { Testimonial } from '@/types'

/** Client testimonials shown in the homepage Testimonials section */
export const testimonials: Testimonial[] = [
  {
    id: 'test-001',
    quote:
      'Kyfaru built our school management system in under six weeks. From student enrollment to fee tracking, everything works exactly as we needed. The team was professional, always reachable, and delivered on every promise.',
    author: 'Grace Wanjiku',
    role: 'Principal',
    company: 'Nairobi Day School',
  },
  {
    id: 'test-002',
    quote:
      'Their USSD solution helped us reach customers in rural areas who do not have smartphones or data. Transaction volume went up significantly in the first month alone. Practical, stable technology that actually works in Kenya.',
    author: 'David Omondi',
    role: 'Founder & CEO',
    company: 'Fintech Startup, Kisumu',
  },
  {
    id: 'test-003',
    quote:
      'The UI design and web app they delivered is genuinely impressive. Our clients comment on how professional and easy-to-use our platform is. The 30-day post-launch support gave us real peace of mind.',
    author: 'Amina Hassan',
    role: 'Director of Operations',
    company: 'E-Commerce Brand, Mombasa',
  },
]
