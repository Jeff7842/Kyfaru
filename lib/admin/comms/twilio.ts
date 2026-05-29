// ============================================================
// Twilio adapter — SMS + WhatsApp (stub fallback).
// Uses the REST API directly (no SDK) to mirror existing adapters.
// ============================================================

import { db } from '../db'
import { communicationLogs } from '../db/schema'

interface SendParams {
  to: string
  message: string
  projectId?: string
  clientId?: string
  sentById?: string
  threadId?: string
}

const SID = () => process.env.TWILIO_ACCOUNT_SID
const TOKEN = () => process.env.TWILIO_AUTH_TOKEN

async function twilioSend(
  channel: 'sms' | 'whatsapp',
  from: string | undefined,
  p: SendParams,
) {
  const sid = SID()
  const token = TOKEN()

  // normalize destination
  const dest = channel === 'whatsapp' ? `whatsapp:${normalize(p.to)}` : normalize(p.to)

  if (!sid || !token || !from) {
    await db.insert(communicationLogs).values({
      channel, toAddress: p.to, fromAddress: from ?? null, body: p.message,
      status: 'stub_sent', projectId: p.projectId, clientId: p.clientId,
      sentById: p.sentById, threadId: p.threadId,
    })
    console.log(`[twilio/${channel}/stub] to=${p.to}`)
    return { ok: true, stub: true }
  }

  try {
    const body = new URLSearchParams({ To: dest, From: from, Body: p.message })
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.message ?? 'Twilio error')

    await db.insert(communicationLogs).values({
      channel, toAddress: p.to, fromAddress: from, body: p.message,
      status: 'sent', externalId: data?.sid ?? null, projectId: p.projectId,
      clientId: p.clientId, sentById: p.sentById, threadId: p.threadId,
    })
    return { ok: true, id: data?.sid }
  } catch (err) {
    await db.insert(communicationLogs).values({
      channel, toAddress: p.to, fromAddress: from, body: p.message,
      status: 'failed', error: String(err), projectId: p.projectId,
      clientId: p.clientId, sentById: p.sentById, threadId: p.threadId,
    })
    return { ok: false, error: String(err) }
  }
}

function normalize(n: string) {
  const t = n.trim()
  return t.startsWith('+') ? t : `+${t.replace(/^0/, '254')}`
}

export const sendSmsTwilio = (p: SendParams) => twilioSend('sms', process.env.TWILIO_SMS_FROM, p)
export const sendWhatsAppTwilio = (p: SendParams) =>
  twilioSend('whatsapp', process.env.TWILIO_WHATSAPP_FROM, p)
