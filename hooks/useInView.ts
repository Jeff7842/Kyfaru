'use client'

// ============================================================
// useInView HOOK
// Returns a ref + boolean indicating whether the target element
// is currently within the viewport. Used to trigger scroll-reveal
// animations on sections and cards.
// ============================================================

import { useEffect, useRef, useState } from 'react'

interface UseInViewOptions {
  /** Margin around the viewport before triggering — e.g. '0px 0px -100px 0px' */
  rootMargin?: string
  /** Visibility ratio that triggers — 0 to 1 */
  threshold?: number
  /** Trigger only once on first appearance? Default: true */
  triggerOnce?: boolean
}

/**
 * Hook that observes when a DOM element enters the viewport.
 * Returns a ref to attach + an `inView` boolean.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {}
): { ref: React.RefObject<T | null>; inView: boolean } {
  const { rootMargin = '0px 0px -80px 0px', threshold = 0.15, triggerOnce = true } = options

  // The DOM ref we hand back to the caller
  const ref = useRef<T | null>(null)
  // Visibility state
  const [inView, setInView] = useState(false)

  useEffect(() => {
    try {
      const node = ref.current
      if (!node) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true)
            if (triggerOnce) observer.disconnect()
          } else if (!triggerOnce) {
            setInView(false)
          }
        },
        { rootMargin, threshold }
      )

      observer.observe(node)
      return () => observer.disconnect()
    } catch (error) {
      console.error('[useInView] Observer error:', error)
    }
  }, [rootMargin, threshold, triggerOnce])

  return { ref, inView }
}
