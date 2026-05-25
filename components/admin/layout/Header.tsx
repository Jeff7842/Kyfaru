'use client'

import Link from 'next/link'
import { Menu, Search } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { useUI } from '@/store/admin/ui'
import { initials } from '@/lib/admin/utils'
import NotificationBell from '@/components/admin/notifications/NotificationBell'

export default function Header() {
  const { setMobileNavOpen } = useUI()
  const { data } = useSession()
  const user = data?.user

  return (
    <header className="sticky top-0 z-30 h-16 px-4 md:px-6 flex items-center gap-3 backdrop-blur bg-[var(--kf-bg)]/85 border-b border-[var(--kf-border)]">
      <button
        className="md:hidden p-2 -ml-2 rounded-md hover:bg-black/5"
        onClick={() => setMobileNavOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1 max-w-md relative hidden sm:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--kf-text-faint)]" />
        <input
          type="search"
          placeholder="Search projects, clients, invoices…"
          className="w-full h-9 pl-9 pr-3 rounded-lg bg-[var(--kf-bg-card)] border border-[var(--kf-border)] text-sm placeholder:text-[var(--kf-text-faint)] focus:outline-none focus:border-[var(--kf-green)]"
        />
      </div>

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
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="hidden md:inline-flex text-xs text-[var(--kf-text-muted)] hover:text-[var(--kf-text)] px-2 py-1.5"
        >
          Sign out
        </button>
      </div>
    </header>
  )
}
