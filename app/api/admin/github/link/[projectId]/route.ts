import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { projects } from '@/lib/admin/db/schema'
import { requireRole } from '@/lib/admin/permissions'
import { eq } from 'drizzle-orm'
import type { Role } from '@/lib/admin/permissions'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  requireRole(session.user.role as Role, 'admin')

  const { projectId } = await params
  const { repoUrl } = await req.json()

  if (!repoUrl) {
    await db
      .update(projects)
      .set({ githubRepoUrl: null, githubRepoOwner: null, githubRepoName: null, updatedAt: new Date() })
      .where(eq(projects.id, projectId))
    return NextResponse.json({ ok: true })
  }

  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:\/.*)?$/)
  if (!match) {
    return NextResponse.json({ error: 'Invalid GitHub repo URL' }, { status: 400 })
  }
  const [, owner, name] = match

  await db
    .update(projects)
    .set({
      githubRepoUrl: repoUrl,
      githubRepoOwner: owner,
      githubRepoName: name,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, projectId))

  return NextResponse.json({ ok: true, owner, name })
}
