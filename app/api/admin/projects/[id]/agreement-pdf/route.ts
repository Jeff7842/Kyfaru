import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { projects } from '@/lib/admin/db/schema'
import { eq } from 'drizzle-orm'
import { buildAgreementDocx } from '@/lib/admin/docs/agreement-docx'
import { getOrCreateDocumentCode } from '@/lib/admin/docs/document-code'
import { requireRole, type Role } from '@/lib/admin/permissions'
import { isRequirementsComplete, type ProjectRequirementsDoc } from '@/lib/admin/types/project-requirements'

export const runtime = 'nodejs'

const fmtDate = (d?: Date | null) => (d ? new Date(d).toLocaleDateString('en-GB') : '')
const firstWord = (s: string | null | undefined) => (s ?? '').trim().split(/\s+/)[0] || 'Document'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // Generating/assigning the shared document code is a state-changing, binding-contract
  // action, not a plain read - gate it above the base staff tier.
  requireRole(session.user.role as Role, 'manager')

  const { id } = await params
  const project = await db.query.projects.findFirst({ where: eq(projects.id, id), with: { client: true } })
  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

  // Business-rule gate, not a transient error - the frontend should route the
  // user back to the project details page, not retry or log this as a failure.
  if (!isRequirementsComplete(project.scopeDocument as ProjectRequirementsDoc | null)) {
    return NextResponse.json({ error: 'Complete the project details first' }, { status: 409 })
  }

  const documentCode = await getOrCreateDocumentCode(project.id)

  const buf = await buildAgreementDocx({
    ref: documentCode,
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
