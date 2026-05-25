'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
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
  ChevronsLeft,
  ChevronsRight,
  LogOut,
} from 'lucide-react'
import { useUI } from '@/store/admin/ui'
import { cn, initials } from '@/lib/admin/utils'
import { ROLE_COLORS, ROLE_LABELS, type Role } from '@/lib/admin/permissions'

type SessUser = {
  name?: string | null
  email?: string | null
  role?: Role
  image?: string | null
} | null

type NavItem = { href: string; label: string; icon: React.ElementType; exact?: boolean }

const NAV: NavItem[] = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/clients', label: 'Clients', icon: Users },
  { href: '/admin/finance', label: 'Finance', icon: Wallet },
  { href: '/admin/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/admin/communications', label: 'Communications', icon: MessageSquare },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  { href: '/admin/reports', label: 'Reports', icon: FileBarChart2 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

const SUPER_ADMIN_NAV: NavItem[] = [
  { href: '/admin/audit', label: 'Audit Log', icon: ShieldCheck },
]

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUI()
  const pathname = usePathname()
  const { data } = useSession()
  const user = (data?.user ?? null) as SessUser
  const role = (user?.role ?? 'viewer') as Role

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/')

  const nav = role === 'super_admin' ? [...NAV, ...SUPER_ADMIN_NAV] : NAV

  return (
    <aside
      className={cn(
        'hidden md:flex h-screen sticky top-0 flex-col text-[var(--kf-sb-text)]',
        'transition-[width] duration-300 ease-out',
        sidebarCollapsed ? 'w-[72px]' : 'w-[260px]',
      )}
      style={{ background: 'var(--kf-sb-bg)' }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-white/5">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-9 h-9 relative shrink-0">
            <Image
              src="/Logos/Kyfaru Logo Filled-05.png"
              alt="Kyfaru"
              fill
              sizes="36px"
              className="object-contain"
            />
          </div>
          {!sidebarCollapsed && (
            <span
              className="font-semibold tracking-tight text-white"
              style={{ fontFamily: 'var(--kf-font-display)' }}
            >
              Kyfaru
            </span>
          )}
        </Link>
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-md hover:bg-white/5 text-zinc-400 hover:text-white"
          aria-label="Toggle sidebar"
        >
          {sidebarCollapsed ? (
            <ChevronsRight className="w-4 h-4" />
          ) : (
            <ChevronsLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {nav.map((item) => {
          const active = isActive(item.href, item.exact)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium relative',
                'transition-colors',
                active
                  ? 'kf-sb-active text-white'
                  : 'text-zinc-300 hover:bg-white/5 hover:text-white',
              )}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon className="w-[18px] h-[18px] shrink-0" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User card */}
      <div className="border-t border-white/5 p-3">
        {user ? (
          <div
            className={cn(
              'flex items-center gap-3',
              sidebarCollapsed && 'justify-center',
            )}
          >
            <div className="w-9 h-9 rounded-full bg-emerald-700/30 text-emerald-200 flex items-center justify-center text-xs font-semibold shrink-0">
              {initials(user.name ?? 'KF')}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">
                  {user.name}
                </div>
                <div
                  className={cn(
                    'inline-block text-[10px] uppercase tracking-wider mt-0.5 px-2 py-0.5 rounded',
                    ROLE_COLORS[role],
                  )}
                >
                  {ROLE_LABELS[role]}
                </div>
              </div>
            )}
            {!sidebarCollapsed && (
              <button
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                className="p-1.5 text-zinc-400 hover:text-white"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : null}
      </div>
    </aside>
  )
}
