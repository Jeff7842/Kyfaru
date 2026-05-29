import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { projects } from '@/lib/admin/db/schema'
import { eq } from 'drizzle-orm'
import { buildAgreementDocx } from '@/lib/admin/docs/agreement-docx'

export const runtime = 'nodejs'

const fmtDate = (d?: Date | null) => (d ? new Date(d).toLocaleDateString('en-GB') : '')
const firstWord = (s: string | null | undefined) => (s ?? '').trim().split(/\s+/)[0] || 'Document'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const project = await db.query.projects.findFirst({ where: eq(projects.id, id), with: { client: true } })
  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

  const buf = await buildAgreementDocx({
    ref: project.projectCode,
    clientName: project.client?.contactPerson ?? project.client?.name,
    clientBiz: project.client?.name,
    clientPhone: project.client?.phone ?? undefined,
    clientEmail: project.client?.email,
    projectTitle: project.name,
    projectType: (project.tags ?? [])[0],
    startDate: fmtDate(project.startDate),
    goLive: fmtDate(project.goLiveDate),
  })

  return new NextResponse(new Uint8Array(buf), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="[${firstWord(project.name)}] Agreement.docx"`,
    },
  })
}
