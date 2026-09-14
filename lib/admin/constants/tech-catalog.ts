// Tech-stack catalog + per-category colour families for the StackInput chips.

export type StackCategory =
  | 'frontend'
  | 'backend'
  | 'database'
  | 'storage'
  | 'security'
  | 'devops'
  | 'mobile'
  | 'ai'
  | 'payment'
  | 'communication'
  | 'design'
  | 'monitoring'
  | 'caching'
  | 'project-management'
  | 'testing'
  | 'cms'
  | 'automation'
  | 'other'

export interface StackItem {
  name: string
  category: StackCategory
  custom?: boolean
  note?: string // what this specific tool is used for on this project
  /** Kyfaru's standard one-time integration fee for this tool, in KES - not
   * the vendor's own subscription cost. Feeds the quotation's "Tools &
   * Equipment" line (see QuoteEditor.tsx) as one aggregate figure, never an
   * itemised tool-by-tool breakdown on the client-facing quote. */
  defaultPrice?: number
}

export const CATEGORY_LABEL: Record<StackCategory, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Database',
  storage: 'Storage',
  security: 'Security',
  devops: 'DevOps',
  mobile: 'Mobile',
  ai: 'AI / ML',
  payment: 'Payment',
  communication: 'Communication',
  design: 'Design',
  monitoring: 'Monitoring',
  caching: 'Caching',
  'project-management': 'Project Management',
  testing: 'Testing / QA',
  cms: 'CMS',
  automation: 'Automation',
  other: 'Other',
}

// Each category gets a close-but-distinguishable colour family (bg + border + text).
export const CATEGORY_COLOR: Record<StackCategory, string> = {
  frontend: 'bg-blue-50 border-blue-300 text-blue-700',
  backend: 'bg-emerald-50 border-emerald-300 text-emerald-700',
  database: 'bg-amber-50 border-amber-300 text-amber-700',
  storage: 'bg-orange-50 border-orange-300 text-orange-700',
  security: 'bg-red-50 border-red-300 text-red-700',
  devops: 'bg-violet-50 border-violet-300 text-violet-700',
  mobile: 'bg-cyan-50 border-cyan-300 text-cyan-700',
  ai: 'bg-fuchsia-50 border-fuchsia-300 text-fuchsia-700',
  payment: 'bg-lime-50 border-lime-300 text-lime-700',
  communication: 'bg-sky-50 border-sky-300 text-sky-700',
  design: 'bg-pink-50 border-pink-300 text-pink-700',
  monitoring: 'bg-indigo-50 border-indigo-300 text-indigo-700',
  caching: 'bg-teal-50 border-teal-300 text-teal-700',
  'project-management': 'bg-purple-50 border-purple-300 text-purple-700',
  testing: 'bg-rose-50 border-rose-300 text-rose-700',
  cms: 'bg-yellow-50 border-yellow-300 text-yellow-700',
  automation: 'bg-slate-50 border-slate-300 text-slate-700',
  other: 'bg-zinc-100 border-zinc-300 text-zinc-700',
}

export const TECH_CATALOG: StackItem[] = [
  // frontend
  { name: 'Next.js', category: 'frontend' },
  { name: 'React', category: 'frontend' },
  { name: 'Vue', category: 'frontend' },
  { name: 'Svelte', category: 'frontend' },
  { name: 'Angular', category: 'frontend' },
  { name: 'Tailwind CSS', category: 'frontend' },
  { name: 'TypeScript', category: 'frontend' },
  // backend
  { name: 'Node.js', category: 'backend' },
  { name: 'Express', category: 'backend' },
  { name: 'NestJS', category: 'backend' },
  { name: 'Django', category: 'backend' },
  { name: 'FastAPI', category: 'backend' },
  { name: 'Laravel', category: 'backend' },
  { name: 'Spring Boot', category: 'backend' },
  { name: 'Go', category: 'backend' },
  // database
  { name: 'PostgreSQL', category: 'database' },
  { name: 'MySQL', category: 'database' },
  { name: 'MongoDB', category: 'database' },
  { name: 'Redis', category: 'database' },
  { name: 'SQLite', category: 'database' },
  { name: 'Drizzle ORM', category: 'database' },
  { name: 'Prisma', category: 'database' },
  // storage
  { name: 'AWS S3', category: 'storage', defaultPrice: 6000 },
  { name: 'Cloudinary', category: 'storage', defaultPrice: 5000 },
  { name: 'UploadThing', category: 'storage', defaultPrice: 4000 },
  { name: 'Cloudflare R2', category: 'storage', defaultPrice: 5000 },
  // security
  { name: 'NextAuth', category: 'security' },
  { name: 'Auth0', category: 'security', defaultPrice: 8000 },
  { name: 'Clerk', category: 'security', defaultPrice: 7000 },
  { name: 'JWT', category: 'security' },
  // devops
  { name: 'Docker', category: 'devops', defaultPrice: 6000 },
  { name: 'Vercel', category: 'devops', defaultPrice: 4000 },
  { name: 'GitHub Actions', category: 'devops', defaultPrice: 6000 },
  { name: 'Nginx', category: 'devops', defaultPrice: 5000 },
  { name: 'VPS', category: 'devops', defaultPrice: 8000 },
  // mobile
  { name: 'React Native', category: 'mobile' },
  { name: 'Flutter', category: 'mobile' },
  { name: 'Expo', category: 'mobile', defaultPrice: 5000 },
  // ai
  { name: 'OpenAI', category: 'ai' },
  { name: 'Anthropic Claude', category: 'ai' },
  { name: 'LangChain', category: 'ai' },
  // payment - integration fee, not the gateway's own per-transaction cut
  { name: 'M-Pesa Daraja', category: 'payment', defaultPrice: 15000 },
  { name: 'Stripe', category: 'payment', defaultPrice: 10000 },
  { name: 'PayPal', category: 'payment', defaultPrice: 8000 },
  { name: 'PayHero', category: 'payment', defaultPrice: 10000 },
  { name: 'Flutterwave', category: 'payment', defaultPrice: 10000 },
  // communication
  { name: 'Resend', category: 'communication', defaultPrice: 5000 },
  { name: 'Twilio', category: 'communication', defaultPrice: 8000 },
  { name: 'SendGrid', category: 'communication', defaultPrice: 6000 },
  { name: 'WhatsApp Business API', category: 'communication', defaultPrice: 15000 },
  // design
  { name: 'Figma', category: 'design' },
  { name: 'Adobe XD', category: 'design' },
  { name: 'Canva', category: 'design' },
  // monitoring
  { name: 'Sentry', category: 'monitoring', defaultPrice: 4000 },
  { name: 'PostHog', category: 'monitoring', defaultPrice: 5000 },
  { name: 'LogRocket', category: 'monitoring', defaultPrice: 4000 },
  { name: 'Datadog', category: 'monitoring', defaultPrice: 8000 },
  // caching - Redis itself stays catalogued under `database` above (that's its
  // canonical entry; duplicating it here would flip categoryFor('Redis') to
  // 'caching' via the lookup map and silently re-categorize it on every
  // already-saved project that has Redis stored with category: 'database').
  { name: 'Upstash Redis', category: 'caching', defaultPrice: 5000 },
  { name: 'Memcached', category: 'caching', defaultPrice: 5000 },
  // project-management
  { name: 'Trello', category: 'project-management' },
  { name: 'Asana', category: 'project-management' },
  { name: 'Notion', category: 'project-management' },
  { name: 'Linear', category: 'project-management' },
  { name: 'ClickUp', category: 'project-management' },
  { name: 'Slack', category: 'project-management' },
  // testing
  { name: 'Playwright', category: 'testing' },
  { name: 'Cypress', category: 'testing' },
  { name: 'Vitest', category: 'testing' },
  { name: 'Postman', category: 'testing' },
  // cms
  { name: 'WordPress', category: 'cms', defaultPrice: 10000 },
  { name: 'Sanity', category: 'cms', defaultPrice: 8000 },
  { name: 'Contentful', category: 'cms', defaultPrice: 8000 },
  { name: 'Strapi', category: 'cms', defaultPrice: 10000 },
  // automation
  { name: 'Zapier', category: 'automation', defaultPrice: 6000 },
  { name: 'n8n', category: 'automation', defaultPrice: 8000 },
  { name: 'Make', category: 'automation', defaultPrice: 6000 },
]

const LOOKUP = new Map(TECH_CATALOG.map((t) => [t.name.toLowerCase(), t]))

export function categoryFor(name: string): StackCategory {
  return LOOKUP.get(name.toLowerCase())?.category ?? 'other'
}

// Standard integration fee for a tool, by name - looked up from the catalog
// rather than trusted off a saved StackItem, so a price added/changed here
// later applies to already-selected tools too, not just newly-picked ones.
export function priceFor(item: StackItem): number {
  if (typeof item.defaultPrice === 'number') return item.defaultPrice
  return LOOKUP.get(item.name.toLowerCase())?.defaultPrice ?? 0
}
