'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import type { HSStaticMethods as HSStaticMethodsType } from 'preline'

/**
 * Preline's components auto-init on DOMContentLoaded, which never fires again
 * on client-side App Router navigation - re-run it on every route change so
 * newly-mounted data-hs-* markup (drawers, selects, dropdowns) gets wired up.
 *
 * Note: HSDatepicker is unusable here (throws under Turbopack) - dates use
 * components/admin/shared/DatePicker.tsx instead. Every other plugin is fine.
 */
export default function PrelineScript() {
  const pathname = usePathname()

  useEffect(() => {
    import('preline').then(({ HSStaticMethods }) => {
      HSStaticMethods.autoInit()
    })
  }, [pathname])

  useEffect(() => {
    // Route changes don't cover content mounted by local state - a drawer or
    // modal opening, a tab switching - since the pathname never changes for
    // those. Watch the DOM directly and re-init (debounced) whenever anything
    // new appears, so data-hs-* markup inside a drawer still gets wired up.
    let hsStatic: typeof HSStaticMethodsType | null = null
    let timeout: ReturnType<typeof setTimeout> | null = null
    import('preline').then(({ HSStaticMethods }) => {
      hsStatic = HSStaticMethods
    })

    const observer = new MutationObserver(() => {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => hsStatic?.autoInit(), 50)
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      if (timeout) clearTimeout(timeout)
    }
  }, [])

  return null
}
