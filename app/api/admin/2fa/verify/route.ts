// POST /api/admin/2fa/verify  — verifies the submitted OTP and upgrades the session.

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { verifyOTP } from '@/lib/admin/otp'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const userId = (session.user as { id: string }).id

  const body = await req.json().catch(() => null)
  const code = String(body?.code ?? '').trim()
  if (!code || code.length !== 6) {
    return NextResponse.json({ error: 'invalid_code' }, { status: 400 })
  }

  const ok = await verifyOTP(userId, code)
  if (!ok) {
    return NextResponse.json({ error: 'invalid_or_expired' }, { status: 422 })
  }

  // Trigger a JWT session update so isTwoFactorVerified=true.
  // Client calls update() after this succeeds.
  return NextResponse.json({ ok: true })
}
