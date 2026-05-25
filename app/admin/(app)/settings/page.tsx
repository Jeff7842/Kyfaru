import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { users } from '@/lib/admin/db/schema'
import { eq } from 'drizzle-orm'
import HeroSection from '@/components/admin/layout/HeroSection'
import SettingsForm from '@/components/admin/settings/SettingsForm'

export const metadata = { title: 'Settings — Kyfaru Admin' }
export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const session = await auth()
  const userId = (session?.user as { id?: string })?.id

  const user = userId
    ? await db.query.users.findFirst({ where: eq(users.id, userId) })
    : null

  return (
    <div className="space-y-6 kf-anim-in">
      <HeroSection
        title="Settings"
        subtitle="Manage your account, 2FA, and notification preferences."
      />
      <SettingsForm user={user ?? null} />
    </div>
  )
}
