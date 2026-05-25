// ============================================================
// KYFARU ECOSYSTEM DATA
// The four entities that make up the Kyfaru ecosystem.
// Add a new branch by copying an entry and updating values.
// ============================================================

import type { EcosystemBranch } from '@/types'

/** The four entities that make up the Kyfaru ecosystem */
export const ecosystemBranches: EcosystemBranch[] = [
  {
    id: 'mwamba-ai',
    name: 'Mwamba AI',
    tagline: 'The intelligence powering Kyfaru',
    description:
      'Mwamba AI is the artificial intelligence engine embedded across every Kyfaru product. It delivers automation, agentic assistance, decision support, and accuracy at scale — making every system smarter by default.',
    icon: 'heroicons:cpu-chip',
    accentClass: 'text-ky-gold',
    borderClass: 'border-ky-gold-dim',
    href: '#',
  },
  {
    id: 'stackable',
    name: 'Stackable',
    tagline: 'Education technology for African schools',
    description:
      'Stackable is a complete school management system. Stackable is the digital learning arm — technology education, skills training, and online learning for students and institutions across Africa.',
    icon: 'heroicons:academic-cap',
    accentClass: 'text-ky-green-hi',
    borderClass: 'border-ky-green',
    href: '#',
  },
  {
    id: 'kiliforge',
    name: 'Kiliforge',
    tagline: 'Where new technology is invented',
    description:
      'Kiliforge is the Kyfaru innovation and research laboratory — where new software, hardware, and design ideas are tested, broken, and perfected before becoming the products that move Africa forward.',
    icon: 'heroicons:beaker',
    accentClass: 'text-ky-ivory',
    borderClass: 'border-ky-border-hi',
    href: '#',
  },
  {
    id: 'kyfaru-core',
    name: 'Kyfaru',
    tagline: 'The technology company behind it all',
    description:
      'Kyfaru is the parent company — a dedicated team of designers, engineers, and systems architects who plan, build, and deliver every project. We work across web, mobile, AI, infrastructure, and communication systems.',
    icon: 'heroicons:building-office-2',
    accentClass: 'text-ky-green-mid',
    borderClass: 'border-ky-border-hi',
    href: '/about',
  },
]
