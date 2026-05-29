import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/admin/db'
import { notifications } from '@/lib/admin/db/schema'
import { sendEmail } from '@/lib/admin/comms/email'
import { contactAckEmail, contactNotifyEmail } from '@/lib/admin/comms/templates'

export const runtime = 'nodejs'

const COMPANY_INBOX = process.env.COMPANY_INBOX_EMAIL ?? 'hello@kyfaru.com'

export async function POST(req: NextRequest) {
  let body: Record<string, string>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { firstName = '', lastName = '', email = '', topic = '', message = '' } = body
  if (!firstName || !email || !message) {
    return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 })
  }
  const fullName = `${firstName} ${lastName}`.trim()

  // 1. Acknowledge the submitter.
  const ack = contactAckEmail(firstName)
  await sendEmail({ to: email, subject: ack.subject, html: ack.html })

  // 2. Notify the company inbox.
  const notify = contactNotifyEmail({ name: fullName, email, topic, message })
  await sendEmail({ to: COMPANY_INBOX, subject: notify.subject, html: notify.html })

  // 3. In-app admin notification.
  await db.insert(notifications).values({
    userId: null,
    type: 'system',
    title: 'New contact enquiry',
    body: `${fullName} (${email})${topic ? ` · ${topic}` : ''}`,
    actionUrl: '/admin/communications',
  })

  return NextResponse.json({ ok: true })
}
