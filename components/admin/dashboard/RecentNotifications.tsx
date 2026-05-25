import { BellRing } from 'lucide-react'
import type { Notification } from '@/lib/admin/db/schema'

export default function RecentNotifications({
  notifications,
}: {
  notifications: Notification[]
}) {
  return (
    <div className="kf-card rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-[var(--kf-text)]">Notifications</h2>
      </div>
      {notifications.length === 0 ? (
        <p className="text-sm text-[var(--kf-text-muted)]">All caught up!</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div key={n.id} className="flex items-start gap-3">
              <BellRing className="w-4 h-4 mt-0.5 text-[var(--kf-green)] shrink-0" />
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{n.title}</div>
                {n.body && (
                  <div className="text-xs text-[var(--kf-text-muted)] line-clamp-2">
                    {n.body}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
