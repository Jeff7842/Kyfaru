import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { projects } from '@/lib/admin/db/schema'
import { eq } from 'drizzle-orm'
import { buildScopeDocx } from '@/lib/admin/docs/scope-docx'
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

  const reqs = project.scopeDocument as ProjectRequirementsDoc | null
  // Business-rule gate, not a transient error - the frontend should route the
  // user back to the project details page, not retry or log this as a failure.
  if (!isRequirementsComplete(reqs)) {
    return NextResponse.json({ error: 'Complete the project details first' }, { status: 409 })
  }

  const documentCode = await getOrCreateDocumentCode(project.id)

  const buf = await buildScopeDocx({
    projectTitle: project.name,
    sowRef: documentCode,
    clientName: project.client?.name,
    agreementRef: documentCode,
    issueDate: fmtDate(new Date()),
    startDate: fmtDate(project.startDate),
    goLive: fmtDate(project.goLiveDate),
    objective: reqs!.purpose,
    hostingProvider: reqs!.hosting.provider,
    domainName: reqs!.domain.name,
    hostingCost: reqs!.hosting.cost,
    domainCost: reqs!.domain.cost,
    securityMeasures: reqs!.security.measures,
    backupSchedule: reqs!.security.backupSchedule,
    productUploadNotes: reqs!.productUpload,
    additionalCharges: reqs!.additionalCharges,
    seoItems: reqs!.seoItems,
  })

  return new NextResponse(new Uint8Array(buf), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="[${firstWord(project.name)}] Scope of Work.docx"`,
    },
  })
}
