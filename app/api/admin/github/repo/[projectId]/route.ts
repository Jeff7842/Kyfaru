import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { projects, users } from '@/lib/admin/db/schema'
import { eq } from 'drizzle-orm'

async function ghFetch(path: string, token: string) {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    next: { revalidate: 60 },
  })
  if (!res.ok) return null
  return res.json()
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { projectId } = await params

  const project = await db.query.projects.findFirst({ where: eq(projects.id, projectId) })
  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

  if (!project.githubRepoOwner || !project.githubRepoName) {
    return NextResponse.json({ linked: false })
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id as string),
    columns: { githubAccessToken: true },
  })

  if (!user?.githubAccessToken) {
    return NextResponse.json({ error: 'GitHub not connected. Connect in Settings.' }, { status: 401 })
  }

  const token = user.githubAccessToken
  const owner = project.githubRepoOwner
  const repo = project.githubRepoName

  const [commits, prs, issues, runs] = await Promise.all([
    ghFetch(`/repos/${owner}/${repo}/commits?per_page=10`, token),
    ghFetch(`/repos/${owner}/${repo}/pulls?state=open&per_page=5`, token),
    ghFetch(`/repos/${owner}/${repo}/issues?state=open&per_page=5`, token),
    ghFetch(`/repos/${owner}/${repo}/actions/runs?per_page=3`, token),
  ])

  return NextResponse.json({
    linked: true,
    owner,
    repo,
    commits: (commits ?? []).map((c: Record<string, unknown>) => ({
      sha: (c.sha as string).slice(0, 7),
      message: ((c.commit as Record<string, unknown>).message as string).split('\n')[0],
      author: ((c.commit as Record<string, Record<string, string>>).author).name,
      date: ((c.commit as Record<string, Record<string, string>>).author).date,
      url: c.html_url,
    })),
    openPRs: prs?.length ?? 0,
    openIssues: issues?.length ?? 0,
    lastRun: runs?.workflow_runs?.[0]
      ? {
          name: runs.workflow_runs[0].name,
          status: runs.workflow_runs[0].status,
          conclusion: runs.workflow_runs[0].conclusion,
          url: runs.workflow_runs[0].html_url,
          updatedAt: runs.workflow_runs[0].updated_at,
        }
      : null,
  })
}
