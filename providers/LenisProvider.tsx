'use client'

// ============================================================
// LENIS SMOOTH SCROLL PROVIDER
// Bridges Lenis to GSAP ScrollTrigger so the two animation
// systems stay in sync across the entire app.
// ============================================================

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Mounts a single Lenis instance for the document.
 * Should be rendered exactly once inside the root Providers tree.
 */
export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  useEffect(() => {
    // The admin section scrolls its own inner `overflow-y-auto` shell, not
    // window/body - Lenis defaults to smooth-scrolling window, so it swallows
    // every wheel event there without moving anything (native scrollbar-drag
    // still works since that bypasses Lenis entirely, which is the exact
    // "can't scroll except by dragging the scrollbar" symptom this fixes).
    if (isAdmin) return
    try {
      // Register GSAP plugins (registerPlugin is idempotent internally)
      gsap.registerPlugin(ScrollTrigger)

      // Initialize Lenis with a gentle, prestige-feeling ease
      const lenis = new Lenis({
        duration: 1.25,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
      })

      // Bridge Lenis -> ScrollTrigger so scrolling animations stay accurate
      lenis.on('scroll', ScrollTrigger.update)

      // Drive Lenis with GSAP's ticker for one synchronized animation loop
      const tickerCallback = (time: number) => lenis.raf(time * 1000)
      gsap.ticker.add(tickerCallback)
      gsap.ticker.lagSmoothing(0)

      return () => {
        gsap.ticker.remove(tickerCallback)
        lenis.destroy()
      }
    } catch (error) {
      console.error('[LenisProvider] init failed:', error)
    }
    // Re-run on admin/public boundary crossings (client-side nav in or out of
    // /admin) so Lenis inits/tears down correctly without a full page reload.
  }, [isAdmin])

  return <>{children}</>
}
