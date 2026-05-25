import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { users, auditLogs } from '@/lib/admin/db/schema'
import { requireRole } from '@/lib/admin/permissions'
import { eq } from 'drizzle-orm'
import type { Role } from '@/lib/admin/permissions'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  requireRole(session.user.role as Role, 'admin')

  const { id } = await params
  const body = await req.json()

  const existing = await db.query.users.findFirst({ where: eq(users.id, id) })
  if (!existing) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const {
    name,
    email,
    phone,
    role,
    avatarUrl,
    accessType,
    accessFrom,
    accessUntil,
    isActive,
    isFrozen,
    isTwoFactorEnabled,
  } = body

  const updates: Partial<typeof users.$inferInsert> = {}
  if (name !== undefined) updates.name = name
  if (email !== undefined) updates.email = email
  if (phone !== undefined) updates.phone = phone
  if (role !== undefined) updates.role = role
  if (avatarUrl !== undefined) updates.avatarUrl = avatarUrl
  if (accessType !== undefined) updates.accessType = accessType
  if (accessFrom !== undefined) updates.accessFrom = accessFrom ? new Date(accessFrom) : null
  if (accessUntil !== undefined) updates.accessUntil = accessUntil ? new Date(accessUntil) : null
  if (isActive !== undefined) updates.isActive = isActive
  if (isFrozen !== undefined) updates.isFrozen = isFrozen
  if (isTwoFactorEnabled !== undefined) updates.isTwoFactorEnabled = isTwoFactorEnabled
  updates.updatedAt = new Date()

  const [updated] = await db
    .update(users)
    .set(updates)
    .where(eq(users.id, id))
    .returning({ id: users.id, email: users.email, name: users.name, role: users.role })

  await db.insert(auditLogs).values({
    userId: session.user.id as string,
    action: 'user.update',
    entityType: 'user',
    entityId: id,
    before: { name: existing.name, email: existing.email, role: existing.role, isActive: existing.isActive, isFrozen: existing.isFrozen },
    after: updates,
  })

  return NextResponse.json({ user: updated })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  requireRole(session.user.role as Role, 'super_admin')

  const { id } = await params

  if (id === session.user.id) {
    return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 })
  }

  const existing = await db.query.users.findFirst({ where: eq(users.id, id) })
  if (!existing) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  await db.update(users).set({ isActive: false, updatedAt: new Date() }).where(eq(users.id, id))

  await db.insert(auditLogs).values({
    userId: session.user.id as string,
    action: 'user.delete',
    entityType: 'user',
    entityId: id,
    before: { name: existing.name, email: existing.email },
  })

  return NextResponse.json({ ok: true })
}
