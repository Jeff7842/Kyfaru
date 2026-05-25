import { db } from '@/lib/admin/db'
import { notifications } from '@/lib/admin/db/schema'
import { desc } from 'drizzle-orm'
import { auth } from '@/lib/admin/auth'
import HeroSection from '@/components/admin/layout/HeroSection'
import NotificationsList from '@/components/admin/notifications/NotificationsList'

export const metadata = { title: 'Notifications — Kyfaru Admin' }
export const dynamic = 'force-dynamic'

export default async function NotificationsPage() {
  const data = await db
    .select()
    .from(notifications)
    .orderBy(desc(notifications.createdAt))
    .limit(50)

  return (
    <div className="space-y-6 kf-anim-in">
      <HeroSection
        title="Notifications"
        subtitle="All system and user notifications."
      />
      <NotificationsList initialData={data} />
    </div>
  )
}
