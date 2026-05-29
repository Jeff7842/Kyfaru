import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/admin/db'
import { clients, communicationLogs } from '@/lib/admin/db/schema'
import { eq } from 'drizzle-orm'

export const runtime = 'nodejs'

// Inbound email webhook (Resend inbound / forwarding). Configure the inbound
// route in Resend to POST here. Signature verification should be added before
// production use.
export async function POST(req: NextRequest) {
  let payload: Record<string, unknown>
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  // Resend inbound shape may vary; accept common fields defensively.
  const data = (payload.data ?? payload) as Record<string, unknown>
  const from = String((data.from as string) ?? '')
  const subject = String((data.subject as string) ?? '')
  const text = String((data.text as string) ?? (data.html as string) ?? '')
  const fromEmail = from.match(/<([^>]+)>/)?.[1] ?? from

  const client = await db.query.clients.findFirst({ where: eq(clients.email, fromEmail) })

  await db.insert(communicationLogs).values({
    channel: 'email',
    direction: 'inbound',
    toAddress: 'kyfaru',
    fromAddress: fromEmail,
    subject,
    body: text,
    status: 'received',
    clientId: client?.id ?? null,
    threadId: client?.id ?? null,
  })

  return NextResponse.json({ ok: true })
}
