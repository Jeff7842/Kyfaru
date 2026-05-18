'use client'

// ============================================================
// ORBITAL SERVICES SECTION
// Eight services orbit a central ring. The ring rotates to snap
// the active service to the 3 o'clock position (12 o'clock on
// mobile). Scroll-hijacks the viewport while the section is in
// view; releases naturally at the edges (index 0 or 7).
//
// Wireframe layout per user reference image. Visual treatment
// per the full sci-fi HUD spec: per-service accents, rotating
// reticle, SVG connector line with traveling pulse, clipped HUD
// info panel with scanlines, terminal blink cursor, status
// badges, etc.
// ============================================================

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'motion/react'
import { Icon } from '@iconify/react'
import { services } from '@/lib/data/services'
import { SERVICE_ACCENT_COLORS, hexToRgba } from './orbital/orbital-utils'
import OrbitalNode from './orbital/OrbitalNode'
import HUDPanel from './orbital/HUDPanel'
import ConnectorLine from './orbital/ConnectorLine'

const COUNT = services.length // 8
const STEP = 360 / COUNT      // 45 deg
const DEBOUNCE_MS = 650

/** Top-level orbital services section. */
export default function OrbitalServicesSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [isInView, setIsInView] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const lastScrollAt = useRef(0)

  // ── Viewport size ──────────────────────────────────────────
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1024)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // ── In-view observer (drives reveal animation) ─────────────
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setIsInView(entry.intersectionRatio > 0.4),
      { threshold: [0, 0.3, 0.5, 0.8, 1] }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // ── Advance helper (clamped to [0, COUNT-1]) ───────────────
  const advance = useCallback((direction: 1 | -1) => {
    setActiveIndex((curr) => {
      const next = curr + direction
      if (next < 0 || next > COUNT - 1) return curr
      return next
    })
  }, [])

  // ── Scroll hijacking — wheel + touch ───────────────────────
  useEffect(() => {
    function shouldHijack() {
      if (!sectionRef.current) return false
      const rect = sectionRef.current.getBoundingClientRect()
      // Wider tolerance (80px) so Lenis smooth-scrolling lands the section
      // squarely in the viewport and the wheel/touch listener engages
      // reliably, even with sub-pixel interpolation.
      return rect.top <= 80 && rect.bottom >= window.innerHeight - 80
    }

    function onWheel(e: WheelEvent) {
      if (!shouldHijack()) return
      const direction: 1 | -1 = e.deltaY > 0 ? 1 : -1
      const willStay =
        (direction === 1 && activeIndex < COUNT - 1) ||
        (direction === -1 && activeIndex > 0)
      if (!willStay) return // release at edges
      e.preventDefault()
      const now = Date.now()
      if (now - lastScrollAt.current < DEBOUNCE_MS) return
      lastScrollAt.current = now
      advance(direction)
    }

    let touchStartY = 0
    function onTouchStart(e: TouchEvent) { touchStartY = e.touches[0].clientY }
    function onTouchMove(e: TouchEvent) {
      if (!shouldHijack()) return
      const dy = touchStartY - e.touches[0].clientY
      if (Math.abs(dy) < 36) return
      const direction: 1 | -1 = dy > 0 ? 1 : -1
      const willStay =
        (direction === 1 && activeIndex < COUNT - 1) ||
        (direction === -1 && activeIndex > 0)
      if (!willStay) return
      e.preventDefault()
      const now = Date.now()
      if (now - lastScrollAt.current < DEBOUNCE_MS) return
      lastScrollAt.current = now
      touchStartY = e.touches[0].clientY
      advance(direction)
    }

    function onKey(e: KeyboardEvent) {
      if (!shouldHijack()) return
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); advance(1) }
      if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  { e.preventDefault(); advance(-1) }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('keydown', onKey)
    }
  }, [activeIndex, advance])

  const accent = SERVICE_ACCENT_COLORS[activeIndex] ?? '#c9a84c'
  const activeService = services[activeIndex]

  // Bring active to 3 o'clock (desktop) / 12 o'clock (mobile)
  const desktopRotation = 90 - activeIndex * STEP
  const mobileRotation = -activeIndex * STEP

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-ky-base scroll-mt-0 snap-start"
      style={{ scrollSnapStop: 'always' }}
      aria-label="Kyfaru services orbital navigator"
    >
      {/* Subtle background tint */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 transition-opacity duration-700 opacity-40"
          style={{ background: `radial-gradient(60% 50% at 35% 50%, ${hexToRgba(accent, 0.06)} 0%, transparent 70%)` }}
        />
      </div>

      {/* Header chip */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="absolute top-8 md:top-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-ky-gold animate-dot-pulse-gold" />
        <span className="text-[11px] font-display tracking-[0.3em] uppercase text-highlight">
          Our Services
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-ky-gold animate-dot-pulse-gold" />
      </motion.div>

      {/* Progress counter (top-right) */}
      <div className="absolute top-8 md:top-10 right-6 md:right-10 z-30 font-display tracking-[0.3em] text-[11px] text-ky-faint flex items-baseline gap-1">
        <span className="text-base md:text-lg" style={{ color: accent }}>
          {String(activeIndex + 1).padStart(2, '0')}
        </span>
        <span>/</span>
        <span>{String(COUNT).padStart(2, '0')}</span>
      </div>

      {isMobile ? (
        <MobileOrbital
          rotation={mobileRotation}
          activeIndex={activeIndex}
          isInView={isInView}
          accent={accent}
          activeService={activeService}
          hoverIndex={hoverIndex}
          onHover={setHoverIndex}
          onSelect={setActiveIndex}
        />
      ) : (
        <DesktopOrbital
          rotation={desktopRotation}
          activeIndex={activeIndex}
          isInView={isInView}
          accent={accent}
          activeService={activeService}
          hoverIndex={hoverIndex}
          onHover={setHoverIndex}
          onSelect={setActiveIndex}
        />
      )}

      {/* Navigator hint — makes the click-to-focus affordance discoverable */}
      <div className="hidden md:flex absolute bottom-8 right-10 z-30 items-center gap-3 px-3 py-2 bg-ky-surface ghost-border ky-rounded-sm">
        <Icon icon="heroicons:cursor-arrow-rays" className="w-3.5 h-3.5 text-ky-gold" />
        <span className="text-[10px] font-display tracking-[0.25em] uppercase text-ky-muted">
          Scroll · Click any node
        </span>
      </div>

      {/* Scroll affordance */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1.5">
        <span className="text-[10px] font-display tracking-[0.3em] text-ky-faint">
          {activeIndex === COUNT - 1 ? 'CONTINUE' : 'SCROLL'}
        </span>
        <motion.span
          aria-hidden="true"
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="block w-px h-7 bg-ky-faint/40"
        />
      </div>
    </section>
  )
}

// ============================================================
// DESKTOP
// ============================================================
function DesktopOrbital({
  rotation,
  activeIndex,
  isInView,
  accent,
  activeService,
  hoverIndex,
  onHover,
  onSelect,
}: {
  rotation: number
  activeIndex: number
  isInView: boolean
  accent: string
  activeService: typeof services[number]
  hoverIndex: number | null
  onHover: (i: number | null) => void
  onSelect: (i: number) => void
}) {
  const RING = 520
  const RADIUS = RING / 2
  const DOT = 60
  const ACTIVE = 180 // ~3x

  // Pixel positions used by the connector SVG
  const ringCenterX = 0.34 // % of viewport
  const stageRef = useRef<HTMLDivElement | null>(null)
  const [stageRect, setStageRect] = useState<{ left: number; top: number; width: number; height: number }>({ left: 0, top: 0, width: 0, height: 0 })

  useEffect(() => {
    function recompute() {
      if (!stageRef.current) return
      const r = stageRef.current.getBoundingClientRect()
      setStageRect({ left: r.left, top: r.top, width: r.width, height: r.height })
    }
    recompute()
    window.addEventListener('resize', recompute)
    window.addEventListener('scroll', recompute, { passive: true })
    return () => {
      window.removeEventListener('resize', recompute)
      window.removeEventListener('scroll', recompute)
    }
  }, [activeIndex])

  // Connector endpoints — start at right edge of active disc, end at left edge of HUD panel
  const start = {
    x: stageRect.width * ringCenterX + RADIUS + ACTIVE / 2 + 4,
    y: stageRect.height / 2,
  }
  const end = {
    x: stageRect.width - 380, // align with HUD left edge (panel width ~360 + right margin)
    y: stageRect.height / 2,
  }

  return (
    <div ref={stageRef} className="relative w-full h-full">
      {/* Ring stage */}
      <motion.div
        initial={{ opacity: 0.55, scale: 0.94 }}
        animate={{ opacity: isInView ? 1 : 0.7, scale: isInView ? 1 : 0.95 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="absolute top-1/2 -translate-y-1/2"
        style={{
          left: `${ringCenterX * 100}%`,
          marginLeft: -RADIUS,
          width: RING,
          height: RING,
        }}
      >
        {/* Subtle ring stroke */}
        <div className="absolute inset-0 rounded-full border border-ky-border/40" />

        {/* Rotating dot ring */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: rotation }}
          transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
          style={{ willChange: 'transform' }}
        >
          {services.map((service, i) => {
            const angleRad = (i * STEP - 90) * (Math.PI / 180)
            const x = RADIUS + RADIUS * Math.cos(angleRad)
            const y = RADIUS + RADIUS * Math.sin(angleRad)
            const isActive = i === activeIndex
            const size = isActive ? ACTIVE : DOT
            const nodeAccent = SERVICE_ACCENT_COLORS[i]

            const isHover = hoverIndex === i && !isActive
            return (
              <motion.button
                key={service.id}
                onClick={() => onSelect(i)}
                onMouseEnter={() => onHover(i)}
                onMouseLeave={() => onHover(null)}
                onFocus={() => onHover(i)}
                onBlur={() => onHover(null)}
                title={service.title}
                aria-label={`Focus ${service.title}`}
                aria-pressed={isActive}
                className="absolute focus:outline-none focus-visible:ring-2 focus-visible:ring-ky-gold rounded-full cursor-pointer"
                animate={{
                  left: x - size / 2,
                  top: y - size / 2,
                  width: size,
                  height: size,
                }}
                whileHover={isActive ? undefined : { scale: 1.15 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 180, damping: 22 }}
                style={{
                  // Counter-rotate so the icon stays upright
                  transform: `rotate(${-rotation}deg)`,
                }}
              >
                <OrbitalNode
                  icon={service.icon}
                  accent={nodeAccent}
                  isActive={isActive}
                  isHover={isHover}
                  serviceName={service.title}
                />
              </motion.button>
            )
          })}
        </motion.div>
      </motion.div>

      {/* Connector line */}
      {stageRect.width > 0 && (
        <ConnectorLine
          start={start}
          end={end}
          accent={accent}
          drawKey={activeService.id}
        />
      )}

      {/* HUD info panel — right side, vertically centered */}
      <div
        className="absolute top-1/2 -translate-y-1/2 right-[5%] z-20 w-[360px]"
      >
        <HUDPanel service={activeService} accent={accent} />
      </div>
    </div>
  )
}

// ============================================================
// MOBILE
// ============================================================
function MobileOrbital({
  rotation,
  activeIndex,
  isInView,
  accent,
  activeService,
  hoverIndex,
  onHover,
  onSelect,
}: {
  rotation: number
  activeIndex: number
  isInView: boolean
  accent: string
  activeService: typeof services[number]
  hoverIndex: number | null
  onHover: (i: number | null) => void
  onSelect: (i: number) => void
}) {
  const RING = 300
  const RADIUS = RING / 2
  const DOT = 44
  const ACTIVE = 92 // 2x

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-4 pt-16">
      {/* Compact HUD panel above the ring */}
      <div className="w-full max-w-sm mb-6 z-20">
        <HUDPanel service={activeService} accent={accent} compact />
      </div>

      {/* Ring */}
      <motion.div
        initial={{ opacity: 0.55, scale: 0.94 }}
        animate={{ opacity: isInView ? 1 : 0.7, scale: isInView ? 1 : 0.95 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="relative"
        style={{ width: RING, height: RING }}
      >
        {/* Subtle ring stroke */}
        <div className="absolute inset-0 rounded-full border border-ky-border/40" />

        {/* Center stage — clean label, no glass card */}
        <motion.div
          key={activeService.id}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="absolute inset-12 rounded-full bg-ky-surface ghost-border flex flex-col items-center justify-center gap-1.5"
        >
          <div className="text-[10px] font-display tracking-[0.25em] uppercase text-ky-faint">
            {String(activeService.number).padStart(2, '0')}
          </div>
          <div className="text-[10px] font-display tracking-[0.25em] uppercase max-w-[140px] text-center text-ky-ivory">
            {activeService.title.split(' ').slice(0, 3).join(' ')}
          </div>
        </motion.div>

        {/* Rotating dot ring */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: rotation }}
          transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
        >
          {services.map((service, i) => {
            const angleRad = (i * STEP - 90) * (Math.PI / 180)
            const x = RADIUS + RADIUS * Math.cos(angleRad)
            const y = RADIUS + RADIUS * Math.sin(angleRad)
            const isActive = i === activeIndex
            const size = isActive ? ACTIVE : DOT
            const nodeAccent = SERVICE_ACCENT_COLORS[i]

            const isHover = hoverIndex === i && !isActive
            return (
              <motion.button
                key={service.id}
                onClick={() => onSelect(i)}
                onMouseEnter={() => onHover(i)}
                onMouseLeave={() => onHover(null)}
                title={service.title}
                aria-label={`Focus ${service.title}`}
                aria-pressed={isActive}
                className="absolute focus:outline-none focus-visible:ring-2 focus-visible:ring-ky-gold rounded-full cursor-pointer"
                animate={{
                  left: x - size / 2,
                  top: y - size / 2,
                  width: size,
                  height: size,
                }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 180, damping: 22 }}
                style={{ transform: `rotate(${-rotation}deg)` }}
              >
                <OrbitalNode
                  icon={service.icon}
                  accent={nodeAccent}
                  isActive={isActive}
                  isHover={isHover}
                  mobile
                />
              </motion.button>
            )
          })}
        </motion.div>
      </motion.div>
    </div>
  )
}
