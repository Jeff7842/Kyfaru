import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { projects, clients, auditLogs } from '@/lib/admin/db/schema'
import { requireRole } from '@/lib/admin/permissions'
import { and, count, desc, eq, ilike, or } from 'drizzle-orm'
import type { Role } from '@/lib/admin/permissions'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const page = Math.max(0, Number(searchParams.get('page') ?? 0))
  const pageSize = Math.min(100, Number(searchParams.get('pageSize') ?? 20))
  const q = (searchParams.get('q') ?? '').trim()

  const where = q
    ? or(
        ilike(projects.name, `%${q}%`),
        ilike(projects.projectCode, `%${q}%`),
        ilike(clients.name, `%${q}%`),
      )
    : undefined

  const [rows, totalRes] = await Promise.all([
    db
      .select({ project: projects, client: clients })
      .from(projects)
      .leftJoin(clients, eq(projects.clientId, clients.id))
      .where(where)
      .orderBy(desc(projects.createdAt))
      .limit(pageSize)
      .offset(page * pageSize),
    db
      .select({ value: count() })
      .from(projects)
      .leftJoin(clients, eq(projects.clientId, clients.id))
      .where(where),
  ])

  const projectsOut = rows.map((r) => ({ ...r.project, client: r.client }))
  return NextResponse.json({ projects: projectsOut, total: totalRes[0]?.value ?? 0, page, pageSize })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  requireRole(session.user.role as Role, 'manager')

  const body = await req.json()
  if (!body.name || !body.clientId) {
    return NextResponse.json({ error: 'Name and client are required' }, { status: 400 })
  }

  const projectCode = body.projectCode?.trim() || `KY-P-${Date.now().toString(36).toUpperCase()}`

  const [project] = await db
    .insert(projects)
    .values({
      projectCode,
      name: body.name,
      description: body.description ?? null,
      clientId: body.clientId,
      status: body.status ?? 'lead',
      startDate: body.startDate ? new Date(body.startDate) : null,
      expectedEndDate: body.expectedEndDate ? new Date(body.expectedEndDate) : null,
      goLiveDate: body.goLiveDate ? new Date(body.goLiveDate) : null,
      quotedAmount: body.quotedAmount != null && body.quotedAmount !== '' ? String(body.quotedAmount) : null,
      currency: body.currency ?? 'KES',
      techStack: Array.isArray(body.techStack) ? body.techStack : null,
      stack: Array.isArray(body.stack) ? body.stack : null,
      tags: Array.isArray(body.tags) ? body.tags : null,
      coverImageUrl: body.coverImageUrl ?? null,
      githubRepoUrl: body.githubRepoUrl ?? null,
      notes: body.notes ?? null,
      progress: body.progress ?? 0,
      createdById: session.user.id as string,
    })
    .returning()

  await db.insert(auditLogs).values({
    userId: session.user.id as string,
    action: 'project.create',
    entityType: 'project',
    entityId: project.id,
    after: { name: project.name, projectCode },
  })

  return NextResponse.json({ project }, { status: 201 })
}
