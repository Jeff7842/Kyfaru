import { db } from '@/lib/admin/db'
import { communicationLogs } from '@/lib/admin/db/schema'
import { desc } from 'drizzle-orm'
import HeroSection from '@/components/admin/layout/HeroSection'
import CommsLog from '@/components/admin/comms/CommsLog'

export const metadata = { title: 'Communications — Kyfaru Admin' }
export const dynamic = 'force-dynamic'

export default async function CommsPage() {
  const logs = await db
    .select()
    .from(communicationLogs)
    .orderBy(desc(communicationLogs.createdAt))
    .limit(100)

  return (
    <div className="space-y-6 kf-anim-in">
      <HeroSection
        title="Communications"
        subtitle="Email, WhatsApp, and SMS logs with clients."
      />
      <CommsLog initialData={logs} />
    </div>
  )
}
