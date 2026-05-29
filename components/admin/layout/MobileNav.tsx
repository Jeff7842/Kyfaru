'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUI } from '@/store/admin/ui'
import { useSession } from 'next-auth/react'
import { useLogout } from '@/hooks/useLogout'
import { X, LogOut } from 'lucide-react'
import { useEffect } from 'react'
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Wallet,
  CalendarDays,
  Bell,
  MessageSquare,
  FileBarChart2,
  Settings,
  ShieldCheck,
} from 'lucide-react'
import { ROLE_LABELS, type Role } from '@/lib/admin/permissions'
import { cn, initials } from '@/lib/admin/utils'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/clients', label: 'Clients', icon: Users },
  { href: '/admin/finance', label: 'Finance', icon: Wallet },
  { href: '/admin/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/admin/communications', label: 'Communications', icon: MessageSquare },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  { href: '/admin/reports', label: 'Reports', icon: FileBarChart2 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function MobileNav() {
  const { mobileNavOpen, setMobileNavOpen } = useUI()
  const pathname = usePathname()
  const { data } = useSession()
  const role = ((data?.user as { role?: Role } | undefined)?.role ?? 'viewer') as Role
  const logout = useLogout()

  useEffect(() => {
    setMobileNavOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const nav =
    role === 'super_admin'
      ? [...NAV, { href: '/admin/audit', label: 'Audit Log', icon: ShieldCheck }]
      : NAV

  return (
    <>
      <div
        aria-hidden
        className={cn(
          'md:hidden fixed inset-0 bg-black/40 z-40 transition-opacity',
          mobileNavOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
        onClick={() => setMobileNavOpen(false)}
      />
      <aside
        className={cn(
          'md:hidden fixed inset-y-0 left-0 w-[280px] z-50 flex flex-col text-zinc-200',
          'transition-transform duration-300',
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        style={{ background: 'var(--kf-sb-bg)' }}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/5">
          <span
            className="font-semibold text-white"
            style={{ fontFamily: 'var(--kf-font-display)' }}
          >
            Kyfaru
          </span>
          <button
            onClick={() => setMobileNavOpen(false)}
            className="p-1.5 hover:bg-white/5 rounded-md"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {nav.map((item) => {
            const active =
              item.exact ? pathname === item.href : pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
                  active
                    ? 'kf-sb-active text-white'
                    : 'hover:bg-white/5 text-zinc-300 hover:text-white',
                )}
              >
                <Icon className="w-[18px] h-[18px]" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="border-t border-white/5 p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-700/30 text-emerald-200 flex items-center justify-center text-xs font-semibold">
            {initials(data?.user?.name ?? 'KF')}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">
              {data?.user?.name}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-zinc-400">
              {ROLE_LABELS[role]}
            </div>
          </div>
          <button
            onClick={logout}
            className="p-2 text-zinc-400 hover:text-white"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  )
}
