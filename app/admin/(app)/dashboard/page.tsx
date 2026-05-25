import { Suspense } from 'react'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { desc, eq, gte, sql, and } from 'drizzle-orm'
import {
  projects,
  invoices,
  clients,
  notifications,
  calendarEvents,
} from '@/lib/admin/db/schema'
import HeroSection from '@/components/admin/layout/HeroSection'
import KpiCard from '@/components/admin/dashboard/KpiCard'
import RecentProjects from '@/components/admin/dashboard/RecentProjects'
import RecentInvoices from '@/components/admin/dashboard/RecentInvoices'
import UpcomingEvents from '@/components/admin/dashboard/UpcomingEvents'
import RecentNotifications from '@/components/admin/dashboard/RecentNotifications'
import RevenueChart from '@/components/admin/dashboard/RevenueChart'

export const metadata = { title: 'Dashboard — Kyfaru Admin' }
export const dynamic = 'force-dynamic'

async function getDashboardData() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    activeProjectCount,
    totalClients,
    paidMTD,
    overdueCount,
    recentProjects,
    recentInvoices,
    upcomingEvents,
    recentNotifs,
  ] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(projects)
      .where(eq(projects.status, 'in_progress'))
      .then((r) => r[0]?.count ?? 0),

    db
      .select({ count: sql<number>`count(*)::int` })
      .from(clients)
      .where(eq(clients.isActive, true))
      .then((r) => r[0]?.count ?? 0),

    db
      .select({ sum: sql<string>`coalesce(sum(amount),0)::text` })
      .from(invoices)
      .where(and(eq(invoices.status, 'paid'), gte(invoices.paidAt!, startOfMonth)))
      .then((r) => parseFloat(r[0]?.sum ?? '0')),

    db
      .select({ count: sql<number>`count(*)::int` })
      .from(invoices)
      .where(eq(invoices.status, 'overdue'))
      .then((r) => r[0]?.count ?? 0),

    db.query.projects.findMany({
      limit: 5,
      orderBy: [desc(projects.updatedAt)],
      with: { client: true },
    }),

    db.query.invoices.findMany({
      limit: 5,
      orderBy: [desc(invoices.createdAt)],
      with: { client: true },
    }),

    db.query.calendarEvents.findMany({
      limit: 5,
      where: gte(calendarEvents.startAt, now),
      orderBy: [calendarEvents.startAt],
    }),

    db.query.notifications.findMany({
      limit: 5,
      where: eq(notifications.isRead, false),
      orderBy: [desc(notifications.createdAt)],
    }),
  ])

  return {
    activeProjectCount,
    totalClients,
    paidMTD,
    overdueCount,
    recentProjects,
    recentInvoices,
    upcomingEvents,
    recentNotifs,
  }
}

export default async function DashboardPage() {
  const session = await auth()
  const user = session?.user as { name?: string; role?: string } | undefined
  const data = await getDashboardData()

  return (
    <div className="space-y-6 kf-anim-in">
      <HeroSection
        title={`Good day, ${user?.name?.split(' ')[0] ?? 'there'}`}
        subtitle="Here's what's happening across Kyfaru today."
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          title="Active Projects"
          value={data.activeProjectCount}
          icon="FolderKanban"
          color="green"
        />
        <KpiCard
          title="Total Clients"
          value={data.totalClients}
          icon="Users"
          color="blue"
        />
        <KpiCard
          title="Revenue MTD"
          value={data.paidMTD}
          format="money"
          icon="Wallet"
          color="yellow"
        />
        <KpiCard
          title="Overdue Invoices"
          value={data.overdueCount}
          icon="AlertTriangle"
          color={data.overdueCount > 0 ? 'red' : 'green'}
        />
      </div>

      {/* Charts + recent content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          <Suspense fallback={<div className="kf-card h-56 animate-pulse" />}>
            <RevenueChart />
          </Suspense>
          <RecentProjects projects={data.recentProjects} />
        </div>
        <div className="space-y-5">
          <UpcomingEvents events={data.upcomingEvents} />
          <RecentInvoices invoices={data.recentInvoices} />
          <RecentNotifications notifications={data.recentNotifs} />
        </div>
      </div>
    </div>
  )
}
