// ============================================================
// Email adapter — Resend (stub mode if RESEND_API_KEY missing).
// ============================================================

import { db } from '../db'
import { communicationLogs } from '../db/schema'

export interface SendEmailParams {
  to: string
  subject: string
  html: string
  text?: string
  projectId?: string
  clientId?: string
  sentById?: string
}

export async function sendEmail(p: SendEmailParams) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL ?? 'Kyfaru <hello@kyfaru.com>'

  // STUB MODE — no key → log & succeed
  if (!apiKey) {
    await db.insert(communicationLogs).values({
      channel: 'email',
      toAddress: p.to,
      subject: p.subject,
      body: p.text ?? p.html,
      status: 'stub_sent',
      projectId: p.projectId,
      clientId: p.clientId,
      sentById: p.sentById,
    })
    console.log(`[email/stub] to=${p.to} subject="${p.subject}"`)
    return { ok: true, stub: true }
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [p.to],
        subject: p.subject,
        html: p.html,
        text: p.text,
      }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.message ?? 'Resend error')

    await db.insert(communicationLogs).values({
      channel: 'email',
      toAddress: p.to,
      subject: p.subject,
      body: p.text ?? p.html,
      status: 'sent',
      externalId: data?.id ?? null,
      projectId: p.projectId,
      clientId: p.clientId,
      sentById: p.sentById,
    })
    return { ok: true, id: data?.id }
  } catch (err) {
    await db.insert(communicationLogs).values({
      channel: 'email',
      toAddress: p.to,
      subject: p.subject,
      body: p.text ?? p.html,
      status: 'failed',
      error: String(err),
      projectId: p.projectId,
      clientId: p.clientId,
      sentById: p.sentById,
    })
    return { ok: false, error: String(err) }
  }
}
