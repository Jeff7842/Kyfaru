// ============================================================
// OTP — generate / store / verify 6-digit codes.
// Hashed with bcrypt. 10-minute expiry. Single-use.
// ============================================================

import bcrypt from 'bcryptjs'
import { and, eq, gt } from 'drizzle-orm'
import { db } from './db'
import { otpCodes } from './db/schema'

export function generateOTP(): string {
  return Math.floor(100_000 + Math.random() * 900_000).toString()
}

export async function storeOTP(
  userId: string,
  code: string,
  channel: 'email' | 'sms' | 'whatsapp',
): Promise<void> {
  const hashed = await bcrypt.hash(code, 10)
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
  await db.delete(otpCodes).where(eq(otpCodes.userId, userId))
  await db.insert(otpCodes).values({ userId, code: hashed, channel, expiresAt })
}

export async function verifyOTP(
  userId: string,
  input: string,
): Promise<boolean> {
  const record = await db.query.otpCodes.findFirst({
    where: and(eq(otpCodes.userId, userId), gt(otpCodes.expiresAt, new Date())),
  })
  if (!record || record.usedAt) return false

  const ok = await bcrypt.compare(input, record.code)
  if (!ok) return false

  await db
    .update(otpCodes)
    .set({ usedAt: new Date() })
    .where(eq(otpCodes.id, record.id))
  return true
}
