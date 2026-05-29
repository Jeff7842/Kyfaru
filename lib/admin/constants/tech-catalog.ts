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
  | 'other'

export interface StackItem {
  name: string
  category: StackCategory
  custom?: boolean
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
  { name: 'AWS S3', category: 'storage' },
  { name: 'Cloudinary', category: 'storage' },
  { name: 'UploadThing', category: 'storage' },
  { name: 'Cloudflare R2', category: 'storage' },
  // security
  { name: 'NextAuth', category: 'security' },
  { name: 'Auth0', category: 'security' },
  { name: 'Clerk', category: 'security' },
  { name: 'JWT', category: 'security' },
  // devops
  { name: 'Docker', category: 'devops' },
  { name: 'Vercel', category: 'devops' },
  { name: 'GitHub Actions', category: 'devops' },
  { name: 'Nginx', category: 'devops' },
  { name: 'VPS', category: 'devops' },
  // mobile
  { name: 'React Native', category: 'mobile' },
  { name: 'Flutter', category: 'mobile' },
  { name: 'Expo', category: 'mobile' },
  // ai
  { name: 'OpenAI', category: 'ai' },
  { name: 'Anthropic Claude', category: 'ai' },
  { name: 'LangChain', category: 'ai' },
  // payments / integrations (other)
  { name: 'M-Pesa Daraja', category: 'other' },
  { name: 'Stripe', category: 'other' },
  { name: 'Resend', category: 'other' },
  { name: 'Twilio', category: 'other' },
]

const LOOKUP = new Map(TECH_CATALOG.map((t) => [t.name.toLowerCase(), t]))

export function categoryFor(name: string): StackCategory {
  return LOOKUP.get(name.toLowerCase())?.category ?? 'other'
}
