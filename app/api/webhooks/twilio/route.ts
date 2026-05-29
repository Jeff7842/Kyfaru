import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/admin/db'
import { clients, communicationLogs } from '@/lib/admin/db/schema'
import { eq, or } from 'drizzle-orm'

export const runtime = 'nodejs'

// Inbound Twilio webhook for SMS + WhatsApp. Configure this URL in the Twilio
// console (Messaging → a number → "A message comes in"). Signature validation
// (X-Twilio-Signature) should be added before production use.
export async function POST(req: NextRequest) {
  const form = await req.formData()
  const fromRaw = String(form.get('From') ?? '')
  const body = String(form.get('Body') ?? '')
  const isWhatsApp = fromRaw.startsWith('whatsapp:')
  const from = fromRaw.replace('whatsapp:', '')

  // best-effort client match by phone / whatsapp number
  const client = await db.query.clients.findFirst({
    where: or(eq(clients.phone, from), eq(clients.whatsappNumber, from)),
  })

  await db.insert(communicationLogs).values({
    channel: isWhatsApp ? 'whatsapp' : 'sms',
    direction: 'inbound',
    toAddress: 'kyfaru',
    fromAddress: from,
    body,
    status: 'received',
    clientId: client?.id ?? null,
    threadId: client?.id ?? null,
    externalId: String(form.get('MessageSid') ?? ''),
  })

  // Twilio expects TwiML (empty response = no auto-reply)
  return new NextResponse('<Response></Response>', {
    headers: { 'Content-Type': 'text/xml' },
  })
}
