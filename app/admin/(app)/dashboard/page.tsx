import { auth } from '@/lib/admin/auth'
import HeroSection from '@/components/admin/layout/HeroSection'
import DashboardGrid from '@/components/admin/dashboard/DashboardGrid'

export const metadata = { title: 'Dashboard — Kyfaru Admin' }
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await auth()
  const user = session?.user as { name?: string } | undefined

  return (
    <div className="space-y-6 kf-anim-in">
      <HeroSection
        title={`Good day, ${user?.name?.split(' ')[0] ?? 'there'}`}
        subtitle="Here's what's happening across Kyfaru today. Use Customize to add or reorder sections."
      />
      <DashboardGrid />
    </div>
  )
}
