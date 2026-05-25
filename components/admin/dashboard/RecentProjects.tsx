import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/admin/utils'
import StatusBadge from '@/components/admin/shared/StatusBadge'
import type { Project, Client } from '@/lib/admin/db/schema'

type Row = Project & { client: Client | null }

export default function RecentProjects({ projects }: { projects: Row[] }) {
  return (
    <div className="kf-card rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-[var(--kf-text)]">Recent Projects</h2>
        <Link
          href="/admin/projects"
          className="text-xs text-[var(--kf-green)] hover:underline flex items-center gap-1"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      {projects.length === 0 ? (
        <p className="text-sm text-[var(--kf-text-muted)]">No projects yet.</p>
      ) : (
        <div className="divide-y divide-[var(--kf-border)]">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/admin/projects/${p.id}`}
              className="flex items-center gap-3 py-3 hover:bg-zinc-50 -mx-6 px-6 transition"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{p.name}</div>
                <div className="text-xs text-[var(--kf-text-muted)] truncate">
                  {p.client?.name} · {formatDate(p.expectedEndDate)}
                </div>
              </div>
              <StatusBadge status={p.status} type="project" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
