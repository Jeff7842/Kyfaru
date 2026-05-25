'use client'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { useUI } from '@/store/admin/ui'
import { cn } from '@/lib/admin/utils'

export default function NotificationBell() {
  const { notifPanelOpen, setNotifPanelOpen } = useUI()
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    fetch('/api/admin/notifications/unread-count')
      .then((r) => r.json())
      .then((d) => setUnread(d?.count ?? 0))
      .catch(() => null)
  }, [])

  return (
    <button
      onClick={() => setNotifPanelOpen(!notifPanelOpen)}
      className={cn(
        'relative p-2 rounded-md hover:bg-black/5 transition',
        notifPanelOpen && 'bg-black/5',
      )}
      aria-label="Notifications"
    >
      <Bell className="w-5 h-5 text-zinc-600" />
      {unread > 0 && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
      )}
    </button>
  )
}
