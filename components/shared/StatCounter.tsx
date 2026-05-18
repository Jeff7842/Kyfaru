'use client'

// ============================================================
// STAT COUNTER
// GSAP-driven odometer counter. Animates from 0 to `value`
// when the element enters the viewport. Preserves trailing
// characters (e.g. "+" or "%") and respects the user's
// reduced-motion preference.
// ============================================================

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface StatCounterProps {
  /** The string value to display when fully counted (e.g. "50+", "10", "30") */
  value: string
  /** Duration of the count-up animation in seconds */
  duration?: number
  /** Optional CSS class for the wrapper */
  className?: string
}

/**
 * Animates a numeric stat from 0 to the parsed value, then appends suffix.
 */
export default function StatCounter({ value, duration = 1.8, className }: StatCounterProps) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const [text, setText] = useState('0')

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // Parse the leading integer and trailing suffix from value (e.g. "50+" -> 50, "+")
    const match = value.match(/^(\d+)(.*)$/)
    if (!match) {
      setText(value)
      return
    }
    const target = parseInt(match[1], 10)
    const suffix = match[2] ?? ''

    // Honour prefers-reduced-motion
    if (typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setText(`${target}${suffix}`)
      return
    }

    gsap.registerPlugin(ScrollTrigger)

    const counter = { v: 0 }
    const tween = gsap.to(counter, {
      v: target,
      duration,
      ease: 'power2.out',
      onUpdate: () => setText(`${Math.round(counter.v)}${counter.v >= target ? suffix : ''}`),
      onComplete: () => setText(`${target}${suffix}`),
      scrollTrigger: {
        trigger: node,
        start: 'top 85%',
        once: true,
      },
    })

    return () => {
      tween.kill()
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === node) st.kill()
      })
    }
  }, [value, duration])

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  )
}
