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
    title: 'Tallytrack Africa Nominations',
    description:
      'Built a high-traffic awards and nominations platform using HTML, CSS, JavaScript, and Node.js with M-Pesa and international payments, designed to support 100K+ users through secure voting, scalable performance, and seamless user participation.',
    liveUrl: 'https://tallytrack-africa-nominations-2025.vercel.app',
    tags: ['Web App', 'Polling System', 'Professional', 'International Payments'],
    featured: true,
    comingSoon: false,
  },
  {
    id: 'proj-002',
    title: "Siz Let's Pray",
    description:
      'A Gospel-centered digital sisterhood for women. Built with Next.js, Tailwind & PostgreSQL — uniquely integrating Google Sheets via Google Scripts and Supabase file storage for resource management.',
    liveUrl: 'https://www.sizletspray.com',
    tags: ['Starter', 'Web App', 'Gospel', 'Women'],
    featured: true,
    comingSoon: false,
  },
  {
    id: 'proj-003',
    title: 'Rise Again Holdings',
    description:
      'Premium real estate platform with client and admin portals. Built with Next.js, Tailwind & Go backend, PostgreSQL — featuring live property listings and a full management dashboard.',
    liveUrl: 'https://www.riseagainholdings.com',
    tags: ['Professional', 'Web App', 'Real Estate'],
    featured: true,
    comingSoon: false,
  },
  {
    id: 'proj-004',
    title: 'Zoya Botanicals',
    description:
      'A full-stack botanical e-commerce shop for Africa. Built with Next.js, Tailwind & PostgreSQL — featuring Google Auth, a cart system, rewards program, and curated product catalog.',
    liveUrl: 'https://myzoya.shop',
    tags: ['Professional','E-commerce', 'Web App', 'Botanicals'],
    featured: false,
    comingSoon: false,
  },
  {
    id: 'proj-005',
    title: 'Stackable Academy',
    description:
      'A school management operating system for institutions, teachers, and guardians. Built with Next.js, Tailwind & Go backend — featuring role-based dashboards, academic tracking, and modular institutional workflows.',
    liveUrl: 'https://staqable.app',
    tags: ['Enterprise','Web App', 'Education', 'Management'],
    featured: false,
    comingSoon: true,
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
