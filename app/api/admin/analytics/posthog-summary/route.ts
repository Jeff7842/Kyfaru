import { NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { cachedJson } from '@/lib/admin/cache'

export const dynamic = 'force-dynamic'

interface PosthogSummary {
  configured: boolean
  data?: { date: string; count: number }[]
  total?: number
}

// PostHog Query API ($pageview trend, last 30 days). Longer cache TTL than
// other dashboard routes since PostHog's API is comparatively slow/rate
// limited. Returns { configured: false } instead of throwing whenever the
// PostHog env vars aren't set, so the widget can render a clean empty state.
export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ configured: false }, { status: 401 })

  const apiKey = process.env.POSTHOG_PERSONAL_API_KEY
  const projectId = process.env.POSTHOG_PROJECT_ID
  const host = process.env.POSTHOG_HOST ?? 'https://us.posthog.com'

  if (!apiKey || !projectId) {
    return NextResponse.json({ configured: false } satisfies PosthogSummary)
  }

  const data = await cachedJson('analytics:posthog-summary', 300, async (): Promise<PosthogSummary> => {
    try {
      const res = await fetch(`${host}/api/projects/${projectId}/query/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: {
            kind: 'TrendsQuery',
            series: [{ event: '$pageview', kind: 'EventsNode' }],
            dateRange: { date_from: '-30d' },
            interval: 'day',
          },
        }),
      })
      if (!res.ok) return { configured: true, data: [], total: 0 }

      const json = await res.json()
      const series = json?.results?.[0]
      const labels: string[] = series?.days ?? series?.labels ?? []
      const counts: number[] = series?.data ?? []
      const points = labels.map((date: string, i: number) => ({ date, count: Number(counts[i] ?? 0) }))
      const total = points.reduce((sum, p) => sum + p.count, 0)
      return { configured: true, data: points, total }
    } catch {
      return { configured: true, data: [], total: 0 }
    }
  })

  return NextResponse.json(data)
}
