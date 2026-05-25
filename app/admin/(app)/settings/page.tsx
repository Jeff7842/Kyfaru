import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { users } from '@/lib/admin/db/schema'
import { eq } from 'drizzle-orm'
import HeroSection from '@/components/admin/layout/HeroSection'
import SettingsForm from '@/components/admin/settings/SettingsForm'
import GitHubConnectCard from '@/components/admin/github/GitHubConnectCard'

export const metadata = { title: 'Settings — Kyfaru Admin' }
export const dynamic = 'force-dynamic'

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ github?: string }> }) {
  const session = await auth()
  const userId = (session?.user as { id?: string })?.id
  const sp = await searchParams

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
      <GitHubConnectCard
        githubLogin={user?.githubLogin ?? null}
        githubStatus={sp.github ?? null}
      />
    </div>
  )
}
