// ============================================================
// KYFARU PROJECT DATA
//
// HOW TO ADD A NEW PROJECT:
//   1. Copy one object below
//   2. Give it a new unique id like 'proj-005'
//   3. Fill in title, description, liveUrl, and tags
//   4. Set featured: true to show it on the homepage grid
//   5. Save. The page updates automatically — no other changes needed.
//
// PROJECT PREVIEW:
//   The homepage card shows a live screenshot of liveUrl using thum.io.
//   thum.io is a free screenshot service with no API key needed.
//   If a screenshot loads slowly on first view, that is normal — it caches.
// ============================================================

import type { Project } from '@/types'

/** Full list of all Kyfaru portfolio projects */
export const projects: Project[] = [
  {
    id: 'proj-001',
    title: 'Kyfaru Showcase',
    description:
      'The Kyfaru flagship website itself — a dark, editorial portfolio built with Next.js, Tailwind v4, and a custom design system.',
    liveUrl: 'https://kyfaru.vercel.app',
    tags: ['Web App', 'Branding'],
    featured: true,
  },
  {
    id: 'proj-002',
    title: 'School Polling System',
    description:
      'A real-time digital voting platform for school elections — secure, transparent, and tamper-resistant.',
    liveUrl: 'https://example.com',
    tags: ['Web App', 'Polling System'],
    featured: true,
  },
  {
    id: 'proj-003',
    title: 'Fintech Mobile App',
    description:
      'A cross-platform money-transfer mobile app with M-Pesa integration and instant peer-to-peer settlements.',
    liveUrl: 'https://example.com',
    tags: ['Mobile App', 'Fintech'],
    featured: true,
  },
  {
    id: 'proj-004',
    title: 'USSD Payments Gateway',
    description:
      'A nationwide USSD payment service that lets feature-phone users transact without internet access.',
    liveUrl: 'https://example.com',
    tags: ['USSD', 'Payments'],
    featured: false,
  },
]

/**
 * Returns only projects marked as featured.
 * Used on the homepage Projects section.
 */
export function getFeaturedProjects(): Project[] {
  try {
    return projects.filter((p) => p.featured === true)
  } catch (error) {
    console.error('[getFeaturedProjects] Error:', error)
    return []
  }
}

/**
 * Returns every project in the array.
 * Used on the /projects page for the full portfolio view.
 */
export function getAllProjects(): Project[] {
  try {
    return projects
  } catch (error) {
    console.error('[getAllProjects] Error:', error)
    return []
  }
}
