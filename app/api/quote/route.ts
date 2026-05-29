import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/admin/db'
import { notifications } from '@/lib/admin/db/schema'
import { sendEmail } from '@/lib/admin/comms/email'
import { quoteAckEmail, contactNotifyEmail } from '@/lib/admin/comms/templates'

export const runtime = 'nodejs'

const COMPANY_INBOX = process.env.COMPANY_INBOX_EMAIL ?? 'hello@kyfaru.com'

export async function POST(req: NextRequest) {
  let body: Record<string, string>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { name = '', email = '', company = '', phone = '', location = '', service = '', budget = '', message = '' } = body
  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Name, email and project details are required' }, { status: 400 })
  }

  const ack = quoteAckEmail(name)
  await sendEmail({ to: email, subject: ack.subject, html: ack.html })

  const notify = contactNotifyEmail({ name, email, company, phone, location, service, budget, message })
  await sendEmail({ to: COMPANY_INBOX, subject: notify.subject, html: notify.html })

  await db.insert(notifications).values({
    userId: null,
    type: 'system',
    title: 'New quote request',
    body: `${name} (${email})${service ? ` · ${service}` : ''}${budget ? ` · ${budget}` : ''}`,
    actionUrl: '/admin/communications',
  })

  return NextResponse.json({ ok: true })
}
