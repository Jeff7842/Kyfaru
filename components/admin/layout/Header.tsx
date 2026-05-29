'use client'

import Link from 'next/link'
import { Menu } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useLogout } from '@/hooks/useLogout'
import { useUI } from '@/store/admin/ui'
import { initials } from '@/lib/admin/utils'
import NotificationBell from '@/components/admin/notifications/NotificationBell'
import GlobalSearch from '@/components/admin/layout/GlobalSearch'

export default function Header() {
  const { setMobileNavOpen } = useUI()
  const { data } = useSession()
  const user = data?.user
  const logout = useLogout()

  return (
    <header className="sticky top-0 z-30 h-16 px-4 md:px-6 flex items-center gap-3 backdrop-blur bg-[var(--kf-bg)]/85 border-b border-[var(--kf-border)]">
      <button
        className="md:hidden p-2 -ml-2 rounded-md hover:bg-black/5"
        onClick={() => setMobileNavOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      <GlobalSearch />

      <div className="ml-auto flex items-center gap-2">
        <NotificationBell />
        <Link
          href="/admin/settings/profile"
          className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-black/5"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-700/15 text-emerald-700 flex items-center justify-center text-xs font-semibold">
            {initials(user?.name ?? 'KF')}
          </div>
          <span className="text-sm font-medium hidden sm:inline">
            {user?.name ?? 'Account'}
          </span>
        </Link>
        <button
          onClick={logout}
          className="hidden md:inline-flex text-xs text-[var(--kf-text-muted)] hover:text-[var(--kf-text)] px-2 py-1.5"
        >
          Sign out
        </button>
      </div>
    </header>
  )
}
