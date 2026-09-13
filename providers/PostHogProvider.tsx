'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import posthog from 'posthog-js'

let initialized = false

// Public-site analytics only - skipped under /admin (which has its own
// authenticated dashboard analytics) and silently no-ops when
// NEXT_PUBLIC_POSTHOG_KEY isn't set (not provisioned in this environment yet).
export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY

  useEffect(() => {
    if (!key || pathname?.startsWith('/admin')) return
    if (!initialized) {
      posthog.init(key, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com',
        capture_pageview: false,
      })
      initialized = true
    }
    posthog.capture('$pageview')
  }, [pathname, key])

  return <>{children}</>
}
