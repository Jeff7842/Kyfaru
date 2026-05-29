// ============================================================
// POST /api/admin/2fa/start
// Issues a fresh OTP for the current session (if 2FA enabled).
// ============================================================

import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { users } from '@/lib/admin/db/schema'
import { generateOTP, storeOTP } from '@/lib/admin/otp'
import { sendEmail } from '@/lib/admin/comms/email'
import { sendSmsTwilio, sendWhatsAppTwilio } from '@/lib/admin/comms/twilio'

export async function POST() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const userId = (session.user as { id: string }).id

  const user = await db.query.users.findFirst({ where: eq(users.id, userId) })
  if (!user) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  if (!user.isTwoFactorEnabled) {
    return NextResponse.json({ required: false })
  }

  const code = generateOTP()
  const channel = user.twoFactorChannel ?? 'email'
  await storeOTP(user.id, code, channel)

  if (channel === 'email') {
    await sendEmail({
      to: user.email,
      subject: 'Your Kyfaru sign-in code',
      html: `<p>Your code is <b style="font-size:24px;letter-spacing:4px">${code}</b>. It expires in 10 minutes.</p>`,
      text: `Your Kyfaru code: ${code} (expires in 10 minutes)`,
    })
  } else if (channel === 'whatsapp' && user.phone) {
    await sendWhatsAppTwilio({ to: user.phone, message: `Kyfaru code: ${code} (10 min)` })
  } else if (channel === 'sms' && user.phone) {
    await sendSmsTwilio({ to: user.phone, message: `Kyfaru code: ${code} (10 min)` })
  }

  return NextResponse.json({ required: true, channel })
}
