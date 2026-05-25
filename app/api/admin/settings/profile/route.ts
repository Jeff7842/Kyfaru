import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { users } from '@/lib/admin/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1).max(100),
  phone: z.string().optional(),
  isTwoFactorEnabled: z.boolean(),
  twoFactorChannel: z.enum(['email', 'sms', 'whatsapp']),
})

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const userId = (session.user as { id: string }).id

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
  }

  const { name, phone, isTwoFactorEnabled, twoFactorChannel } = parsed.data

  await db
    .update(users)
    .set({
      name,
      phone: phone ?? null,
      isTwoFactorEnabled,
      twoFactorChannel,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))

  return NextResponse.json({ ok: true })
}
