import { db } from '@/lib/admin/db'
import { auditLogs } from '@/lib/admin/db/schema'
import { desc } from 'drizzle-orm'
import HeroSection from '@/components/admin/layout/HeroSection'
import AuditTable from '@/components/admin/audit/AuditTable'
import { auth } from '@/lib/admin/auth'
import { hasRole, type Role } from '@/lib/admin/permissions'
import { redirect } from 'next/navigation'

export const metadata = { title: 'Audit Log — Kyfaru Admin' }
export const dynamic = 'force-dynamic'

export default async function AuditPage() {
  const session = await auth()
  const role = (session?.user as { role?: string })?.role ?? 'viewer'
  if (!hasRole(role as Role, 'admin')) redirect('/admin/dashboard')

  const logs = await db.query.auditLogs.findMany({
    limit: 100,
    orderBy: [desc(auditLogs.createdAt)],
    with: { user: true },
  })

  return (
    <div className="space-y-6 kf-anim-in">
      <HeroSection
        title="Audit Log"
        subtitle="Full record of all admin actions."
      />
      <AuditTable initialData={logs} />
    </div>
  )
}
