// ============================================================
// KYFARU — GLOBAL TYPE DEFINITIONS
// Every shared TypeScript interface lives here.
// Import from '@/types' anywhere in the project.
// ============================================================

/** One portfolio project entry in the projects array */
export interface Project {
  id: string            // Unique key — e.g. 'proj-001'
  title: string         // Display name of the project
  description: string   // One-sentence highlight of what the project does
  liveUrl: string       // Full URL of the live deployed project
  tags: string[]        // Category tags — e.g. ['Web App', 'E-Commerce']
  featured: boolean     // Show on homepage? true = yes
  comingSoon?: boolean  // If true: badge shown, card dimmed, link disabled
}

/** One service offered by Kyfaru */
export interface Service {
  id: string            // Unique key
  number: string        // Display number — '01', '02', etc.
  title: string         // Service name
  description: string   // Two-sentence description for clients
  icon: string          // Iconify icon string
  highlights: string[]  // 3–4 short feature bullets
}

/** One branch of the Kyfaru ecosystem */
export interface EcosystemBranch {
  id: string            // Unique key
  name: string          // Branch name
  tagline: string       // One-line summary
  description: string   // 2–3 sentence expanded description
  icon: string          // Iconify icon string
  accentClass: string   // Tailwind text color class for the icon and label
  borderClass: string   // Tailwind border color class on hover
  href: string          // Internal link — route or '#'
}

/** One client testimonial */
export interface Testimonial {
  id: string            // Unique key
  quote: string         // The full testimonial quote
  author: string        // Client's full name
  role: string          // Their job title
  company: string       // Their company or organization
}

/** One industry Kyfaru serves */
export interface Industry {
  id: string            // Unique key
  title: string         // Industry name
  icon: string          // Iconify icon string
  description: string   // One-liner shown on the card
}

/** One step in the "How we work" process */
export interface ProcessStep {
  id: string            // Unique key
  number: string        // Display step — '01', '02', etc.
  title: string         // Step name
  description: string   // What happens at this step
  icon: string          // Iconify icon string
}

/** One blog post (used on listing page and [slug] page) */
export interface BlogPost {
  slug: string          // URL-safe identifier — e.g. 'ai-in-kenyan-schools'
  title: string         // Post headline
  excerpt: string       // Short description for the listing card
  publishedAt: string   // ISO date string — e.g. '2025-05-01'
  category: string      // e.g. 'AI & Tech', 'Product Update', 'Guide'
  readTime: string      // e.g. '5 min read'
}

/** One case study (used on listing and [slug] pages) */
export interface CaseStudy {
  slug: string          // URL-safe identifier
  clientName: string    // Name of the client
  title: string         // Case study headline
  industry: string      // Industry tag — must match an Industry.id
  duration: string      // e.g. '6 weeks'
  challenge: string     // What problem the client had
  solution: string      // What Kyfaru built
  results: string[]     // 3–4 measurable outcomes
}
