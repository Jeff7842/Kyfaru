// ============================================================
// SMS adapter — Sent.dm (stub fallback). Kenyan numbers (+254).
// ============================================================

import { db } from '../db'
import { communicationLogs } from '../db/schema'

export interface SendSMSParams {
  to: string
  message: string
  projectId?: string
  clientId?: string
  sentById?: string
}

export async function sendSMS(p: SendSMSParams) {
  const apiKey = process.env.SENTDM_API_KEY
  const sender = process.env.SENTDM_SENDER_ID ?? 'KYFARU'

  if (!apiKey) {
    await db.insert(communicationLogs).values({
      channel: 'sms',
      toAddress: p.to,
      body: p.message,
      status: 'stub_sent',
      projectId: p.projectId,
      clientId: p.clientId,
      sentById: p.sentById,
    })
    console.log(`[sms/stub] to=${p.to}`)
    return { ok: true, stub: true }
  }

  try {
    const res = await fetch('https://api.sent.dm/v1/messages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to: p.to, message: p.message, from: sender }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(JSON.stringify(data))

    await db.insert(communicationLogs).values({
      channel: 'sms',
      toAddress: p.to,
      body: p.message,
      status: 'sent',
      externalId: data?.id ?? null,
      projectId: p.projectId,
      clientId: p.clientId,
      sentById: p.sentById,
    })
    return { ok: true }
  } catch (err) {
    await db.insert(communicationLogs).values({
      channel: 'sms',
      toAddress: p.to,
      body: p.message,
      status: 'failed',
      error: String(err),
      projectId: p.projectId,
      clientId: p.clientId,
      sentById: p.sentById,
    })
    return { ok: false, error: String(err) }
  }
}
