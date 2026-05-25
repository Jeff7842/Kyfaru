// ============================================================
// WhatsApp adapter — Meta WhatsApp Business API (stub fallback).
// ============================================================

import { db } from '../db'
import { communicationLogs } from '../db/schema'

export interface SendWhatsAppParams {
  to: string
  message: string
  projectId?: string
  clientId?: string
  sentById?: string
}

export async function sendWhatsApp(p: SendWhatsAppParams) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN
  const phoneId = process.env.WHATSAPP_PHONE_ID
  const phone = p.to.startsWith('+') ? p.to : `+${p.to}`

  if (!token || !phoneId) {
    await db.insert(communicationLogs).values({
      channel: 'whatsapp',
      toAddress: phone,
      body: p.message,
      status: 'stub_sent',
      projectId: p.projectId,
      clientId: p.clientId,
      sentById: p.sentById,
    })
    console.log(`[whatsapp/stub] to=${phone}`)
    return { ok: true, stub: true }
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v18.0/${phoneId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: phone.replace('+', ''),
          type: 'text',
          text: { body: p.message },
        }),
      },
    )
    const data = await res.json()
    if (!res.ok) throw new Error(JSON.stringify(data))

    await db.insert(communicationLogs).values({
      channel: 'whatsapp',
      toAddress: phone,
      body: p.message,
      status: 'sent',
      externalId: data?.messages?.[0]?.id ?? null,
      projectId: p.projectId,
      clientId: p.clientId,
      sentById: p.sentById,
    })
    return { ok: true }
  } catch (err) {
    await db.insert(communicationLogs).values({
      channel: 'whatsapp',
      toAddress: phone,
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
