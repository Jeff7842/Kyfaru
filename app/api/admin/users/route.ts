import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { users, auditLogs } from '@/lib/admin/db/schema'
import { requireRole } from '@/lib/admin/permissions'
import { eq, desc, ilike, or, count } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import type { Role } from '@/lib/admin/permissions'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  requireRole(session.user.role as Role, 'admin')

  const { searchParams } = new URL(req.url)
  const page = Math.max(0, Number(searchParams.get('page') ?? 0))
  const pageSize = Math.min(100, Number(searchParams.get('pageSize') ?? 20))
  const q = searchParams.get('q') ?? ''

  const where = q
    ? or(ilike(users.name, `%${q}%`), ilike(users.email, `%${q}%`))
    : undefined

  const [rows, [{ value: total }]] = await Promise.all([
    db.query.users.findMany({
      where,
      orderBy: [desc(users.createdAt)],
      limit: pageSize,
      offset: page * pageSize,
      columns: {
        passwordHash: false,
        githubAccessToken: false,
      },
    }),
    db.select({ value: count() }).from(users).where(where),
  ])

  return NextResponse.json({ users: rows, total, page, pageSize })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  requireRole(session.user.role as Role, 'admin')

  const body = await req.json()
  const { name, email, role, phone, accessType, accessFrom, accessUntil, password } = body

  if (!name || !email || !role) {
    return NextResponse.json({ error: 'name, email and role are required' }, { status: 400 })
  }

  const existing = await db.query.users.findFirst({ where: eq(users.email, email) })
  if (existing) return NextResponse.json({ error: 'Email already in use' }, { status: 409 })

  const passwordHash = password ? await bcrypt.hash(password, 12) : null

  const [user] = await db
    .insert(users)
    .values({
      name,
      email,
      role,
      phone: phone ?? null,
      passwordHash,
      accessType: accessType ?? 'permanent',
      accessFrom: accessFrom ? new Date(accessFrom) : null,
      accessUntil: accessUntil ? new Date(accessUntil) : null,
      isActive: true,
      isFrozen: false,
      isTwoFactorEnabled: false,
    })
    .returning({ id: users.id, email: users.email, name: users.name })

  await db.insert(auditLogs).values({
    userId: session.user.id as string,
    action: 'user.create',
    entityType: 'user',
    entityId: user.id,
    after: { name, email, role },
  })

  return NextResponse.json({ user }, { status: 201 })
}
