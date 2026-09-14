'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'

type DirtyChecker = () => boolean

interface GuardApi {
  register: (fn: DirtyChecker) => () => void
  isDirty: () => boolean
}

const NavigationGuardContext = createContext<GuardApi | null>(null)

/**
 * Tracks whether ANY currently-mounted page has unsaved changes, so sitewide
 * nav (Sidebar/MobileNav) can prompt before navigating away - a page's own
 * Cancel/Back button going through useConfirmClose only guards its own exit
 * paths, not a sidebar click straight to another route.
 */
export function NavigationGuardProvider({ children }: { children: React.ReactNode }) {
  const checkers = useRef<Set<DirtyChecker>>(new Set())

  // A stable object (created once via lazy useState init, never re-created)
  // rather than a ref accessed mid-render - the API itself never changes,
  // only what's inside `checkers`, which these closures read at call time.
  const [api] = useState<GuardApi>(() => ({
    register: (fn) => {
      checkers.current.add(fn)
      return () => checkers.current.delete(fn)
    },
    isDirty: () => {
      for (const fn of checkers.current) if (fn()) return true
      return false
    },
  }))

  return <NavigationGuardContext.Provider value={api}>{children}</NavigationGuardContext.Provider>
}

/** Call from any page with unsaved-changes state to register it with the guard. */
export function useRegisterNavigationGuard(isDirty: boolean) {
  const ctx = useContext(NavigationGuardContext)
  useEffect(() => {
    if (!ctx) return
    return ctx.register(() => isDirty)
  }, [ctx, isDirty])
}

/** Returns a function that reports whether any registered page is currently dirty. */
export function useIsAnyPageDirty(): () => boolean {
  const ctx = useContext(NavigationGuardContext)
  if (!ctx) throw new Error('useIsAnyPageDirty must be used within NavigationGuardProvider')
  return ctx.isDirty
}
