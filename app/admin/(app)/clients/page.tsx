import HeroSection from '@/components/admin/layout/HeroSection'
import ClientsTable from '@/components/admin/clients/ClientsTable'

export const metadata = { title: 'Clients — Kyfaru Admin' }
export const dynamic = 'force-dynamic'

export default function ClientsPage() {
  return (
    <div className="space-y-6 kf-anim-in">
      <HeroSection title="Clients" subtitle="All active and inactive client accounts." />
      <ClientsTable />
    </div>
  )
}
