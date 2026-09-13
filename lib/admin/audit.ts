// ============================================================
// Audit logger — call from every server action.
// ============================================================

import { db } from './db'
import { auditLogs } from './db/schema'

export interface AuditPayload {
  userId?: string | null
  /** Format: "entity.verb", e.g. "project.create" - drives the default icon/title below. */
  action: string
  entityType?: string
  entityId?: string
  before?: unknown
  after?: unknown
  ipAddress?: string
  userAgent?: string
  /** Lucide icon key for the activity stepper. Defaults from the action's verb when omitted. */
  icon?: string
  /** Human-readable summary, e.g. "Invoice INV-0004 marked as paid". Defaults from `action` when omitted. */
  title?: string
}

// action is "entity.verb", e.g. "project.create" -> icon 'plus', title "Project created".
const VERB_ICON: Record<string, string> = {
  create: 'plus',
  update: 'pencil',
  delete: 'trash-2',
  paid: 'credit-card',
}

function defaultTitle(action: string): string {
  const [entity, verb] = action.split('.')
  if (!entity || !verb) return action
  return `${entity[0].toUpperCase()}${entity.slice(1)} ${verb === 'create' ? 'created' : verb === 'update' ? 'updated' : verb === 'delete' ? 'deleted' : verb}`
}

export async function logAudit(payload: AuditPayload): Promise<void> {
  try {
    const verb = payload.action.split('.')[1] ?? ''
    await db.insert(auditLogs).values({
      userId: payload.userId ?? null,
      action: payload.action,
      entityType: payload.entityType,
      entityId: payload.entityId,
      before: payload.before as never,
      after: payload.after as never,
      ipAddress: payload.ipAddress,
      userAgent: payload.userAgent,
      icon: payload.icon ?? VERB_ICON[verb] ?? 'circle',
      title: payload.title ?? defaultTitle(payload.action),
    })
  } catch (err) {
    console.error('[audit] failed', err)
  }
}
