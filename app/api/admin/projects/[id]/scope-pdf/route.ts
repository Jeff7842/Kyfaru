import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { projects } from '@/lib/admin/db/schema'
import { eq } from 'drizzle-orm'
import { buildScopeDocx } from '@/lib/admin/docs/scope-docx'

export const runtime = 'nodejs'

const fmtDate = (d?: Date | null) => (d ? new Date(d).toLocaleDateString('en-GB') : '')
const firstWord = (s: string | null | undefined) => (s ?? '').trim().split(/\s+/)[0] || 'Document'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const project = await db.query.projects.findFirst({ where: eq(projects.id, id), with: { client: true } })
  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

  const buf = await buildScopeDocx({
    projectTitle: project.name,
    sowRef: `${project.projectCode}-SOW`,
    clientName: project.client?.name,
    agreementRef: project.projectCode,
    issueDate: fmtDate(new Date()),
    startDate: fmtDate(project.startDate),
    goLive: fmtDate(project.goLiveDate),
    objective: project.description ?? undefined,
  })

  return new NextResponse(new Uint8Array(buf), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="[${firstWord(project.name)}] Scope of Work.docx"`,
    },
  })
}
