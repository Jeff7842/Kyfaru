import { auth } from '@/lib/admin/auth'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/admin/layout/Sidebar'
import Header from '@/components/admin/layout/Header'
import MobileNav from '@/components/admin/layout/MobileNav'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) redirect('/admin/login')
  const u = session.user as { isTwoFactorEnabled?: boolean; isTwoFactorVerified?: boolean }
  if (u.isTwoFactorEnabled && !u.isTwoFactorVerified) {
    redirect('/admin/two-factor')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <MobileNav />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />
        <main className="flex-1 px-4 md:px-6 py-5 space-y-5">{children}</main>
      </div>
    </div>
  )
}
