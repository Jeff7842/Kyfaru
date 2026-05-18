'use client'

// ============================================================
// RADIAL VALUES ORBITAL
// Renders Kyfaru's core principles as orbiting nodes that
// auto-rotate around a central hub. Click any node to expand
// its detail card. Adapted to Kyfaru's design system (Iconify
// icons, ky tokens, ghost-border, ky-rounded).
// ============================================================

import { useState, useEffect, useRef } from 'react'
import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'

interface ValueNode {
  id: number
  title: string
  category: string
  icon: string
  description: string
  /** IDs of nodes that should pulse when this one is active */
  relatedIds: number[]
  status: 'active' | 'in-progress' | 'planned'
  /** 0–100 — visualised as a horizontal energy bar */
  energy: number
}

const VALUES: ValueNode[] = [
  {
    id: 1,
    title: 'Built to Last',
    category: 'Engineering',
    icon: 'heroicons:shield-check',
    description:
      'We build systems that hold up under pressure — secure, stable, and ready to grow with your business.',
    relatedIds: [2, 4],
    status: 'active',
    energy: 96,
  },
  {
    id: 2,
    title: 'Radical Transparency',
    category: 'Collaboration',
    icon: 'heroicons:eye',
    description:
      'No surprises. Clear timelines, honest pricing, and weekly updates so you always know what is happening.',
    relatedIds: [1, 3],
    status: 'active',
    energy: 92,
  },
  {
    id: 3,
    title: 'African Context',
    category: 'Design Thinking',
    icon: 'heroicons:map',
    description:
      'We design for African realities — patchy internet, varied devices, M-Pesa, USSD, local languages and local needs.',
    relatedIds: [2, 4],
    status: 'active',
    energy: 100,
  },
  {
    id: 4,
    title: 'Long-Term Partnership',
    category: 'Relationships',
    icon: 'heroicons:rocket-launch',
    description:
      'We are not contractors. We are partners. 30 days of free post-launch support is just the start.',
    relatedIds: [1, 3],
    status: 'active',
    energy: 88,
  },
  {
    id: 5,
    title: 'Craft Over Speed',
    category: 'Engineering',
    icon: 'heroicons:sparkles',
    description:
      'We ship fast — but never at the cost of quality. Every line of code is reviewed; every screen is hand-tuned.',
    relatedIds: [1, 6],
    status: 'active',
    energy: 90,
  },
  {
    id: 6,
    title: 'Open Knowledge',
    category: 'Community',
    icon: 'heroicons:book-open',
    description:
      'We document everything we build, contribute to open source, and lift the engineers around us as we grow.',
    relatedIds: [2, 5],
    status: 'in-progress',
    energy: 78,
  },
]

export default function RadialValuesOrbital() {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({})
  const [rotationAngle, setRotationAngle] = useState(0)
  const [autoRotate, setAutoRotate] = useState(true)
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({})
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const orbitRef = useRef<HTMLDivElement>(null)

  // Auto-rotate the orbit while no node is expanded
  useEffect(() => {
    if (!autoRotate) return
    const id = setInterval(() => {
      setRotationAngle((p) => Number(((p + 0.3) % 360).toFixed(3)))
    }, 50)
    return () => clearInterval(id)
  }, [autoRotate])

  function handleContainerClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({})
      setActiveNodeId(null)
      setPulseEffect({})
      setAutoRotate(true)
    }
  }

  function toggleItem(id: number) {
    setExpandedItems((prev) => {
      const next = { ...prev }
      Object.keys(next).forEach((k) => {
        if (parseInt(k) !== id) next[parseInt(k)] = false
      })
      next[id] = !prev[id]

      if (!prev[id]) {
        setActiveNodeId(id)
        setAutoRotate(false)

        const related = VALUES.find((v) => v.id === id)?.relatedIds ?? []
        const pulses: Record<number, boolean> = {}
        related.forEach((rid) => (pulses[rid] = true))
        setPulseEffect(pulses)

        // Centre the active node at the top of the ring (270°)
        const idx = VALUES.findIndex((v) => v.id === id)
        const target = (idx / VALUES.length) * 360
        setRotationAngle(270 - target)
      } else {
        setActiveNodeId(null)
        setAutoRotate(true)
        setPulseEffect({})
      }

      return next
    })
  }

  function calcPosition(index: number, total: number, radius: number) {
    const angle = ((index / total) * 360 + rotationAngle) % 360
    const rad = (angle * Math.PI) / 180
    const x = radius * Math.cos(rad)
    const y = radius * Math.sin(rad)
    const z = Math.round(100 + 50 * Math.cos(rad))
    const opacity = Math.max(0.5, Math.min(1, 0.5 + 0.5 * ((1 + Math.sin(rad)) / 2)))
    return { x, y, z, opacity }
  }

  function isRelatedToActive(itemId: number): boolean {
    if (!activeNodeId) return false
    return VALUES.find((v) => v.id === activeNodeId)?.relatedIds.includes(itemId) ?? false
  }

  return (
    <section className="bg-ky-base py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section heading */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-ky-gold" />
            <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-ky-gold font-display">
              Our Values
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-ky-gold" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-ky-ivory tracking-tight font-display">
            The principles behind every project.
          </h2>
          <p className="mt-4 text-ky-muted text-sm md:text-base">
            Click any orbit to dive deeper. The pulse-linked nodes show shared values.
          </p>
        </div>

        {/* Orbital canvas — transparent, inherits section background */}
        <div
          ref={containerRef}
          onClick={handleContainerClick}
          className="relative w-full h-[600px] md:h-[700px] overflow-hidden flex items-center justify-center"
        >
          {/* Hint pill — bottom-right */}
          <div className="absolute bottom-5 right-5 z-30 hidden md:flex items-center gap-2 px-3 py-2 bg-ky-surface ghost-border ky-rounded-sm">
            <Icon icon="heroicons:cursor-arrow-rays" className="w-3.5 h-3.5 text-ky-gold" />
            <span className="text-[10px] font-display tracking-[0.25em] uppercase text-ky-muted">
              Click any node
            </span>
          </div>

          {/* Orbit ring */}
          <div
            ref={orbitRef}
            className="absolute inset-0 flex items-center justify-center"
            style={{ perspective: '1200px' }}
          >
            {/* Center hub */}
            <div className="absolute w-20 h-20 rounded-full flex items-center justify-center z-10 pointer-events-none">
              {/* Pulsing concentric rings */}
              <span className="absolute inset-0 rounded-full border border-ky-gold/20 animate-ping opacity-70" />
              <span
                className="absolute -inset-4 rounded-full border border-ky-gold/10 animate-ping opacity-50"
                style={{ animationDelay: '0.5s' }}
              />
              <span
                className="absolute -inset-8 rounded-full border border-ky-gold/5 animate-ping opacity-30"
                style={{ animationDelay: '1s' }}
              />
              {/* Solid gold core */}
              <span className="relative w-14 h-14 rounded-full bg-ky-gold/15 ghost-border flex items-center justify-center">
                <span className="w-6 h-6 rounded-full bg-ky-gold" />
              </span>
            </div>

            {/* Orbit guide circle */}
            <div className="absolute w-[400px] h-[400px] md:w-[480px] md:h-[480px] rounded-full border border-dashed border-ky-border/60" />

            {/* Nodes */}
            {VALUES.map((item, index) => {
              const radius = typeof window !== 'undefined' && window.innerWidth >= 768 ? 240 : 200
              const pos = calcPosition(index, VALUES.length, radius)
              const isExpanded = !!expandedItems[item.id]
              const isRelated = isRelatedToActive(item.id)
              const isPulsing = !!pulseEffect[item.id]

              return (
                <div
                  key={item.id}
                  className="absolute transition-all duration-700 ease-out cursor-pointer"
                  style={{
                    transform: `translate(${pos.x}px, ${pos.y}px)`,
                    zIndex: isExpanded ? 200 : pos.z,
                    opacity: isExpanded ? 1 : pos.opacity,
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleItem(item.id)
                  }}
                >
                  {/* Glow halo */}
                  <div
                    className={cn(
                      'absolute rounded-full pointer-events-none',
                      isPulsing && 'animate-pulse'
                    )}
                    style={{
                      width: `${item.energy * 0.5 + 50}px`,
                      height: `${item.energy * 0.5 + 50}px`,
                      left: `-${(item.energy * 0.5 + 50 - 48) / 2}px`,
                      top: `-${(item.energy * 0.5 + 50 - 48) / 2}px`,
                      background:
                        'radial-gradient(circle, rgba(239,188,49,0.25) 0%, rgba(239,188,49,0) 70%)',
                    }}
                  />

                  {/* Node disc */}
                  <div
                    className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300',
                      'border-2',
                      isExpanded
                        ? 'bg-ky-gold text-[#060d07] border-ky-gold scale-125 shadow-lg shadow-ky-gold/40'
                        : isRelated
                        ? 'bg-ky-gold-hi/20 text-ky-gold border-ky-gold animate-pulse'
                        : 'bg-ky-surface text-ky-gold border-ky-border'
                    )}
                  >
                    <Icon icon={item.icon} className="w-5 h-5" />
                  </div>

                  {/* Node label */}
                  <div
                    className={cn(
                      'absolute top-14 left-1/2 -translate-x-1/2 whitespace-nowrap',
                      'text-[10px] md:text-[11px] font-display font-medium tracking-[0.2em] uppercase',
                      'transition-all duration-300',
                      isExpanded ? 'text-ky-gold scale-110' : 'text-ky-muted'
                    )}
                  >
                    {item.title}
                  </div>

                  {/* Expanded detail card */}
                  {isExpanded && (
                    <div className="absolute top-24 left-1/2 -translate-x-1/2 w-72 bg-ky-surface ghost-border ky-rounded shadow-2xl shadow-black/40 z-50">
                      {/* Connector line up to node */}
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-ky-gold/60" />

                      <div className="p-5">
                        {/* Status + category */}
                        <div className="flex justify-between items-center mb-3">
                          <span
                            className={cn(
                              'px-2 py-0.5 ky-rounded-sm text-[9px] font-display tracking-[0.25em] uppercase border',
                              item.status === 'active'
                                ? 'border-ky-gold text-ky-gold bg-ky-gold/10'
                                : item.status === 'in-progress'
                                ? 'border-ky-green-hi text-ky-green-hi bg-ky-green-hi/10'
                                : 'border-ky-border text-ky-faint bg-ky-raised'
                            )}
                          >
                            {item.status === 'active'
                              ? 'Active'
                              : item.status === 'in-progress'
                              ? 'In Progress'
                              : 'Planned'}
                          </span>
                          <span className="text-[10px] font-display tracking-[0.2em] text-ky-faint">
                            {item.category}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="font-display font-semibold text-ky-ivory text-base tracking-tight mb-2">
                          {item.title}
                        </h4>

                        {/* Body */}
                        <p className="text-xs text-ky-muted leading-relaxed mb-4">
                          {item.description}
                        </p>

                        {/* Energy bar */}
                        <div className="pt-3 border-t border-ky-border">
                          <div className="flex justify-between items-center text-[10px] mb-1.5">
                            <span className="flex items-center gap-1 text-ky-muted">
                              <Icon icon="heroicons:bolt" className="w-3 h-3" />
                              Conviction
                            </span>
                            <span className="font-display text-ky-gold">{item.energy}%</span>
                          </div>
                          <div className="w-full h-1 bg-ky-raised rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-ky-gold-hi to-ky-gold"
                              style={{ width: `${item.energy}%` }}
                            />
                          </div>
                        </div>

                        {/* Related nodes */}
                        {item.relatedIds.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-ky-border">
                            <div className="flex items-center gap-1 mb-2">
                              <Icon icon="heroicons:link" className="w-3 h-3 text-ky-faint" />
                              <h5 className="text-[9px] font-display tracking-[0.25em] uppercase text-ky-faint">
                                Linked Principles
                              </h5>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {item.relatedIds.map((rid) => {
                                const related = VALUES.find((v) => v.id === rid)
                                if (!related) return null
                                return (
                                  <button
                                    key={rid}
                                    type="button"
                                    className="inline-flex items-center gap-1 px-2 py-1 ky-rounded-sm text-[10px] font-display border border-ky-border bg-ky-raised text-ky-muted hover:text-ky-ivory hover:border-ky-gold-dim transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleItem(rid)
                                    }}
                                  >
                                    {related.title}
                                    <Icon
                                      icon="heroicons:arrow-right"
                                      className="w-2.5 h-2.5"
                                    />
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
