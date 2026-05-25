import { db } from '@/lib/admin/db'
import { clients } from '@/lib/admin/db/schema'
import { desc } from 'drizzle-orm'
import Link from 'next/link'
import HeroSection from '@/components/admin/layout/HeroSection'
import ClientsTable from '@/components/admin/clients/ClientsTable'

export const metadata = { title: 'Clients — Kyfaru Admin' }
export const dynamic = 'force-dynamic'

export default async function ClientsPage() {
  const data = await db
    .select()
    .from(clients)
    .orderBy(desc(clients.createdAt))

  return (
    <div className="space-y-6 kf-anim-in">
      <HeroSection
        title="Clients"
        subtitle="All active and inactive client accounts."
        actions={
          <Link href="/admin/clients/new" className="kf-btn-primary">
            New Client
          </Link>
        }
      />
      <ClientsTable initialData={data} />
    </div>
  )
}
