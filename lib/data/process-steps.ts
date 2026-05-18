// ============================================================
// PROCESS STEPS DATA
// The four-step Kyfaru working process.
// Add or rename steps by editing the array.
// ============================================================

import type { ProcessStep } from '@/types'

/** The four-step Kyfaru working process shown on the homepage */
export const processSteps: ProcessStep[] = [
  {
    id: 'step-01',
    number: '01',
    title: 'Discovery Call',
    description:
      'A free 30-minute call where we understand your business, your problem, and exactly what you need. No technical jargon. No pressure. Just clarity.',
    icon: 'heroicons:phone',
  },
  {
    id: 'step-02',
    number: '02',
    title: 'Design & Architecture',
    description:
      'We map out what the system will look like, how it works, and how it grows with your business. You approve everything before we write a single line of code.',
    icon: 'heroicons:squares-2x2',
  },
  {
    id: 'step-03',
    number: '03',
    title: 'Build & Iterate',
    description:
      'We build with weekly progress updates. You see it growing in real time. We adjust based on your feedback so the final result is exactly what you need.',
    icon: 'heroicons:code-bracket',
  },
  {
    id: 'step-04',
    number: '04',
    title: 'Launch & 30-Day Support',
    description:
      'We deploy your system and stay with you for 30 days after launch. If anything needs fixing, adjusting, or explaining — we are here, immediately.',
    icon: 'heroicons:rocket-launch',
  },
]
