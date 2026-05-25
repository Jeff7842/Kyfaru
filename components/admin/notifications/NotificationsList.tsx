'use client'

import { useState, useTransition } from 'react'
import { BellRing, CheckCheck } from 'lucide-react'
import { cn } from '@/lib/admin/utils'
import { toast } from 'sonner'
import type { Notification } from '@/lib/admin/db/schema'

export default function NotificationsList({
  initialData,
}: {
  initialData: Notification[]
}) {
  const [items, setItems] = useState(initialData)
  const [pending, startTransition] = useTransition()

  async function markAllRead() {
    startTransition(async () => {
      const res = await fetch('/api/admin/notifications/mark-all-read', {
        method: 'POST',
      })
      if (res.ok) {
        setItems((prev) => prev.map((n) => ({ ...n, isRead: true })))
        toast.success('All notifications marked as read')
      } else {
        toast.error('Failed to mark notifications as read')
      }
    })
  }

  const unread = items.filter((n) => !n.isRead).length

  return (
    <div className="kf-card rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="font-semibold text-[var(--kf-text)]">
            All Notifications
          </span>
          {unread > 0 && (
            <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
              {unread} unread
            </span>
          )}
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            disabled={pending}
            className="text-xs text-[var(--kf-green)] hover:underline flex items-center gap-1"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="py-12 text-center text-[var(--kf-text-muted)] text-sm">
          All caught up!
        </div>
      ) : (
        <div className="divide-y divide-[var(--kf-border)]">
          {items.map((n) => (
            <div
              key={n.id}
              className={cn(
                'flex gap-3 items-start py-3 -mx-6 px-6',
                !n.isRead && 'bg-[var(--kf-green)]/5',
              )}
            >
              <BellRing
                className={cn(
                  'w-4 h-4 mt-0.5 shrink-0',
                  n.isRead ? 'text-zinc-400' : 'text-[var(--kf-green)]',
                )}
              />
              <div className="flex-1 min-w-0">
                <div
                  className={cn(
                    'text-sm',
                    n.isRead ? 'text-[var(--kf-text-muted)]' : 'font-medium text-[var(--kf-text)]',
                  )}
                >
                  {n.title}
                </div>
                <p className="text-xs text-[var(--kf-text-muted)] mt-0.5 line-clamp-2">
                  {n.body}
                </p>
                <p className="text-[11px] text-zinc-400 mt-1">
                  {new Date(n.createdAt).toLocaleString('en-KE')}
                </p>
              </div>
              {!n.isRead && (
                <span className="w-2 h-2 rounded-full bg-[var(--kf-green)] shrink-0 mt-1.5" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
