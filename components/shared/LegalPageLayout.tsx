'use client'

// ============================================================
// LEGAL PAGE LAYOUT
// Reusable layout for Terms / Privacy pages.
// Two-column layout:
//   • left: sticky table of contents with scroll-spy highlighting
//   • right: section content
// ============================================================

import { ReactNode, useEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'

export interface LegalSection {
  /** Slug used as #anchor */
  id: string
  /** Heading shown in TOC and as section title */
  title: string
  /** Section body — paragraphs, lists, etc. */
  content: ReactNode
}

interface LegalPageLayoutProps {
  sections: LegalSection[]
  /** Last-updated label — e.g. "May 2026" */
  lastUpdated?: string
}

/**
 * Renders a legal document with a sticky scroll-spy sidebar.
 */
export default function LegalPageLayout({ sections, lastUpdated }: LegalPageLayoutProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '')
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  // Scroll-spy: observe each section, set the topmost visible one as active.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Sort by topmost visible (smallest y in viewport)
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) {
          setActiveId(visible[0].target.id)
        }
      },
      {
        // Trigger when section top enters the upper half of viewport
        rootMargin: '-20% 0px -60% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    )

    sections.forEach((s) => {
      const el = sectionRefs.current[s.id]
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sections])

  function handleNavClick(e: React.MouseEvent, id: string) {
    e.preventDefault()
    const el = sectionRefs.current[id]
    if (el) {
      const offset = 100 // header height + breathing room
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
      setActiveId(id)
    }
  }

  return (
    <section className="bg-ky-base py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-[260px_1fr] gap-12 lg:gap-16">
          {/* ── Sticky TOC sidebar ── */}
          <aside className="lg:sticky lg:top-28 self-start">
            <div className="bg-ky-surface ghost-border ky-rounded p-6">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-ky-border">
                <Icon icon="heroicons:list-bullet" className="w-4 h-4 text-ky-gold" />
                <span className="text-[10px] font-display tracking-[0.25em] uppercase text-ky-gold">
                  Contents
                </span>
              </div>
              <nav>
                <ol className="flex flex-col gap-1">
                  {sections.map((s, i) => {
                    const isActive = activeId === s.id
                    return (
                      <li key={s.id}>
                        <a
                          href={`#${s.id}`}
                          onClick={(e) => handleNavClick(e, s.id)}
                          className={cn(
                            'group flex items-start gap-3 px-3 py-2 ky-rounded-sm text-sm transition-colors',
                            isActive
                              ? 'bg-ky-gold/10 text-ky-gold'
                              : 'text-ky-muted hover:text-ky-ivory hover:bg-ky-raised'
                          )}
                        >
                          <span
                            className={cn(
                              'text-[10px] font-display tracking-wider mt-0.5 shrink-0',
                              isActive ? 'text-ky-gold' : 'text-ky-faint'
                            )}
                          >
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span
                            className={cn(
                              'font-display leading-snug',
                              isActive && 'font-semibold'
                            )}
                          >
                            {s.title}
                          </span>
                        </a>
                      </li>
                    )
                  })}
                </ol>
              </nav>

              {lastUpdated && (
                <div className="mt-6 pt-4 border-t border-ky-border">
                  <div className="text-[10px] font-display tracking-[0.25em] uppercase text-ky-faint mb-1">
                    Last Updated
                  </div>
                  <div className="text-sm text-ky-ivory font-display">{lastUpdated}</div>
                </div>
              )}
            </div>
          </aside>

          {/* ── Content column ── */}
          <div className="min-w-0">
            <article className="prose-legal flex flex-col gap-14">
              {sections.map((s, i) => (
                <section
                  key={s.id}
                  id={s.id}
                  ref={(el) => {
                    sectionRefs.current[s.id] = el
                  }}
                  className="scroll-mt-28"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-[10px] font-display tracking-[0.3em] text-ky-gold">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="h-px flex-1 bg-ky-border" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-display font-semibold text-ky-ivory tracking-tight mb-5">
                    {s.title}
                  </h2>
                  <div className="text-ky-muted leading-relaxed font-inter text-base flex flex-col gap-4">
                    {s.content}
                  </div>
                </section>
              ))}
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
