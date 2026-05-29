import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { clients } from '@/lib/admin/db/schema'
import { eq } from 'drizzle-orm'
import { sendEmail } from '@/lib/admin/comms/email'
import { sendSmsTwilio, sendWhatsAppTwilio } from '@/lib/admin/comms/twilio'

export const runtime = 'nodejs'

// One thread per (client, channel) — derive a stable id without a separate table.
function threadId(clientId: string, channel: string) {
  // deterministic-ish: clientId already a uuid; reuse it as the thread key per channel via metadata.
  return clientId // grouped client-side by clientId+channel; store clientId as threadId
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { clientId, channel, message, subject, attachments } = body as {
    clientId: string
    channel: 'email' | 'sms' | 'whatsapp'
    message: string
    subject?: string
    attachments?: { url: string; name: string; type: string; size: number }[]
  }

  if (!clientId || !channel || (!message && !attachments?.length)) {
    return NextResponse.json({ error: 'clientId, channel and message are required' }, { status: 400 })
  }

  const client = await db.query.clients.findFirst({ where: eq(clients.id, clientId) })
  if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 })

  const sentById = session.user.id as string
  const tid = threadId(clientId, channel)
  let result: { ok: boolean; error?: string }

  if (channel === 'email') {
    if (!client.email) return NextResponse.json({ error: 'Client has no email' }, { status: 400 })
    result = await sendEmail({
      to: client.email,
      subject: subject || 'Message from Kyfaru',
      html: `<p>${(message ?? '').replace(/\n/g, '<br>')}</p>`,
      text: message,
      clientId,
      sentById,
    })
  } else if (channel === 'whatsapp') {
    const to = client.whatsappNumber || client.phone
    if (!to) return NextResponse.json({ error: 'Client has no WhatsApp number' }, { status: 400 })
    result = await sendWhatsAppTwilio({ to, message, clientId, sentById, threadId: tid })
  } else {
    if (!client.phone) return NextResponse.json({ error: 'Client has no phone' }, { status: 400 })
    result = await sendSmsTwilio({ to: client.phone, message, clientId, sentById, threadId: tid })
  }

  if (!result.ok) return NextResponse.json({ error: result.error ?? 'Send failed' }, { status: 502 })
  return NextResponse.json({ ok: true })
}
