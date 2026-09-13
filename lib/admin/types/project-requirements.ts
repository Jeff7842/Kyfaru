// Shape of the `projects.scopeDocument` jsonb column. Drives the project
// details page (UI), the Agreement/SOW "objective" (replaces the old
// project.description misuse), and the SOW's F/G/H/J/K sections.

import { z } from 'zod'

export type ProjectMode = 'off_the_shelf' | 'custom'

export interface PricedItem {
  item: string
  price: string
}

export interface PaymentMilestone {
  label: string
  amount: string
  dueNote?: string
}

export interface PageItem {
  type: string
  label: string
}

export interface ProjectRequirementsDoc {
  projectMode: ProjectMode
  purpose: string
  payments: { milestones: PaymentMilestone[]; items: PricedItem[] }
  storage: string
  communication: string[]
  tools: string[]
  hosting: { provider: string; cost: string }
  domain: { name: string; cost: string }
  security: { measures: string[]; backupSchedule: string }
  productUpload: string
  additionalCharges: PricedItem[]
  seoItems: string[]
  pages: { plannedCount: number; items: PageItem[] }
}

export function emptyProjectRequirements(): ProjectRequirementsDoc {
  return {
    projectMode: 'custom',
    purpose: '',
    payments: { milestones: [], items: [] },
    storage: '',
    communication: [],
    tools: [],
    hosting: { provider: '', cost: '' },
    domain: { name: '', cost: '' },
    security: { measures: [], backupSchedule: '' },
    productUpload: '',
    additionalCharges: [],
    seoItems: [],
    pages: { plannedCount: 0, items: [] },
  }
}

// Validates a PATCH body's `scopeDocument` before it's persisted - this jsonb
// column is written straight from an unvalidated API body (see
// app/api/admin/projects/[id]/route.ts), and a malformed doc would otherwise
// pass isRequirementsComplete()'s null-check but then throw deep inside
// buildScopeDocx() when the PDF routes actually read its nested fields.
const pricedItemSchema = z.object({ item: z.string(), price: z.string() })
const paymentMilestoneSchema = z.object({ label: z.string(), amount: z.string(), dueNote: z.string().optional() })
const pageItemSchema = z.object({ type: z.string(), label: z.string() })

export const projectRequirementsSchema = z.object({
  projectMode: z.enum(['off_the_shelf', 'custom']),
  purpose: z.string(),
  payments: z.object({ milestones: z.array(paymentMilestoneSchema), items: z.array(pricedItemSchema) }),
  storage: z.string(),
  communication: z.array(z.string()),
  tools: z.array(z.string()),
  hosting: z.object({ provider: z.string(), cost: z.string() }),
  domain: z.object({ name: z.string(), cost: z.string() }),
  security: z.object({ measures: z.array(z.string()), backupSchedule: z.string() }),
  productUpload: z.string(),
  additionalCharges: z.array(pricedItemSchema),
  seoItems: z.array(z.string()),
  pages: z.object({ plannedCount: z.number(), items: z.array(pageItemSchema) }),
}) satisfies z.ZodType<ProjectRequirementsDoc>

// The bar for "enough to generate a real Agreement/SOW" - a stated purpose,
// at least one page planned, at least one priced line (milestone or item),
// and a hosting/domain plan. Below this, the documents would ship with the
// same kind of empty/placeholder content the original bug report was about.
// PATCH validates scopeDocument with projectRequirementsSchema before writing
// it (see app/api/admin/projects/[id]/route.ts), but this also guards against
// any doc reaching here some other way (a direct DB edit, a future call site
// that skips validation) - optional chaining so a partial/malformed doc
// degrades to `false` instead of throwing deep in a PDF-generation route.
export function isRequirementsComplete(doc: ProjectRequirementsDoc | null | undefined): boolean {
  if (!doc) return false
  return (
    !!doc.purpose?.trim() &&
    (doc.pages?.items?.length ?? 0) > 0 &&
    ((doc.payments?.milestones?.length ?? 0) > 0 || (doc.payments?.items?.length ?? 0) > 0) &&
    !!doc.hosting?.provider?.trim() &&
    !!doc.domain?.name?.trim()
  )
}
