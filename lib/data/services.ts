// ============================================================
// KYFARU SERVICES DATA
// To add a service, copy one object below, increment the number,
// and update title/description/icon/highlights.
// Icons use Iconify format: 'collection:name' — see icones.js.org
// ============================================================

import type { Service } from '@/types'

/** All Kyfaru services — displayed as a numbered accordion on the homepage */
export const services: Service[] = [
  {
    id: 'web-app',
    number: '01',
    title: 'Web App Development',
    description:
      'Fast, scalable web applications built for real business operations — dashboards, portals, SaaS platforms, and custom tools that work.',
    icon: 'heroicons:globe-alt',
    highlights: ['Next.js & React', 'Fully responsive', 'Built to scale', 'SEO-optimised'],
  },
  {
    id: 'mobile-app',
    number: '02',
    title: 'Mobile App Development',
    description:
      'Cross-platform mobile apps that reach your customers on iOS and Android. Built for performance and built for African users.',
    icon: 'heroicons:device-phone-mobile',
    highlights: ['React Native', 'Cross-platform iOS + Android', 'Offline support', 'App Store ready'],
  },
  {
    id: 'ui-ux',
    number: '03',
    title: 'UI/UX Design',
    description:
      'Interfaces that are beautiful and functional. We design systems your users understand, trust, and enjoy — which keeps them coming back.',
    icon: 'heroicons:paint-brush',
    highlights: ['User research', 'Wireframes & prototypes', 'Full design systems', 'Figma handoff'],
  },
  {
    id: 'ussd',
    number: '04',
    title: 'USSD Solutions',
    description:
      'Reach customers on any phone — even without internet. USSD is the most inclusive way to deliver services at scale in Africa.',
    icon: 'heroicons:signal',
    highlights: ['Works on every phone', 'No smartphone or data needed', 'M-Pesa integration', 'Africa-ready'],
  },
  {
    id: 'email',
    number: '05',
    title: 'Custom Email Systems',
    description:
      'Professional email infrastructure for your brand and your team. Domain emails, transactional systems, and newsletter tools.',
    icon: 'heroicons:envelope',
    highlights: ['Brand email addresses', 'Transactional email', 'Newsletter systems', 'Anti-spam configured'],
  },
  {
    id: 'ai',
    number: '06',
    title: 'AI Integration',
    description:
      'Embed real intelligence into your product — AI chatbots, automation, recommendation engines, and decision support powered by Mwamba AI.',
    icon: 'heroicons:cpu-chip',
    highlights: ['AI-powered chatbots', 'Process automation', 'Decision support', 'Powered by Mwamba AI'],
  },
  {
    id: 'backend',
    number: '07',
    title: 'Backend & Database Systems',
    description:
      'The engine behind your product. Secure APIs, scalable databases, and cloud infrastructure designed to grow with your business.',
    icon: 'heroicons:server',
    highlights: ['REST & GraphQL APIs', 'Supabase & PostgreSQL', 'Auth & security', 'Cloud deployment'],
  },
  {
    id: 'support',
    number: '08',
    title: '30-Day Technical Support',
    description:
      'Every project includes 30 days of hands-on post-launch support. If something breaks, needs adjusting, or needs explaining — we are here.',
    icon: 'heroicons:lifebuoy',
    highlights: ['Bug fixing', 'Performance checks', 'User training', 'Direct team access'],
  },
]
