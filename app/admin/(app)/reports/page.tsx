import HeroSection from '@/components/admin/layout/HeroSection'
import ReportsHub from '@/components/admin/reports/ReportsHub'

export const metadata = { title: 'Reports — Kyfaru Admin' }

export default function ReportsPage() {
  return (
    <div className="space-y-6 kf-anim-in">
      <HeroSection
        title="Reports"
        subtitle="Generate and download business reports."
      />
      <ReportsHub />
    </div>
  )
}
