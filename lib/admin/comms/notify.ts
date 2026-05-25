// ============================================================
// In-app notification helper.
// ============================================================

import { db } from '../db'
import { notifications } from '../db/schema'
import type { Notification } from '../db/schema'

export type NotificationType = Notification['type']

export interface CreateNotificationParams {
  userId?: string | null // null = broadcast (all users will see it)
  type: NotificationType
  title: string
  body: string
  projectId?: string
  clientId?: string
  invoiceId?: string
  actionUrl?: string
}

export async function createNotification(p: CreateNotificationParams) {
  await db.insert(notifications).values({
    userId: p.userId ?? null,
    type: p.type,
    title: p.title,
    body: p.body,
    projectId: p.projectId,
    clientId: p.clientId,
    invoiceId: p.invoiceId,
    actionUrl: p.actionUrl,
  })
}
