// ============================================================
// Audit logger — call from every server action.
// ============================================================

import { db } from './db'
import { auditLogs } from './db/schema'

export interface AuditPayload {
  userId?: string | null
  action: string
  entityType?: string
  entityId?: string
  before?: unknown
  after?: unknown
  ipAddress?: string
  userAgent?: string
}

export async function logAudit(payload: AuditPayload): Promise<void> {
  try {
    await db.insert(auditLogs).values({
      userId: payload.userId ?? null,
      action: payload.action,
      entityType: payload.entityType,
      entityId: payload.entityId,
      before: payload.before as never,
      after: payload.after as never,
      ipAddress: payload.ipAddress,
      userAgent: payload.userAgent,
    })
  } catch (err) {
    console.error('[audit] failed', err)
  }
}
