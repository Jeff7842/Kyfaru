import { auth } from '@/lib/admin/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/admin/db'
import { users } from '@/lib/admin/db/schema'
import { hasRole } from '@/lib/admin/permissions'
import { desc, count } from 'drizzle-orm'
import HeroSection from '@/components/admin/layout/HeroSection'
import UsersTable from '@/components/admin/users/UsersTable'
import type { Role } from '@/lib/admin/permissions'

export const metadata = { title: 'Users — Kyfaru Admin' }

const PAGE_SIZE = 20

export default async function UsersPage() {
  const session = await auth()
  if (!session?.user) redirect('/admin/login')
  if (!hasRole(session.user.role as Role, 'admin')) {
    redirect('/admin/dashboard')
  }

  const [rows, [{ value: total }]] = await Promise.all([
    db.query.users.findMany({
      orderBy: [desc(users.createdAt)],
      limit: PAGE_SIZE,
      offset: 0,
      columns: { passwordHash: false, githubAccessToken: false },
    }),
    db.select({ value: count() }).from(users),
  ])

  return (
    <div className="space-y-6">
      <HeroSection
        title="User Management"
        subtitle="Manage team access, roles, and permissions."
      />
      <UsersTable initialUsers={rows} initialTotal={Number(total)} />
    </div>
  )
}
