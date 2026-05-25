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
import Link from 'next/link'
import { cn } from '@/lib/utils'

export interface LegalSection {
  /** Slug used as #anchor */
  id: string
  /** Heading shown in TOC and as section title */
  title: string
  /** Section body — paragraphs, lists, etc. */
  content: ReactNode
}

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface LegalPageLayoutProps {
  sections: LegalSection[]
  /** Last-updated label — e.g. "May 2026" */
  lastUpdated?: string
  /** Version string — e.g. "1.0" */
  version?: string
  /** Breadcrumb trail shown above content */
  breadcrumb?: BreadcrumbItem[]
  /** Show footer CTA bar with contact + download PDF */
  showFooterCta?: boolean
}

/**
 * Renders a legal document with a sticky scroll-spy sidebar.
 */
export default function LegalPageLayout({
  sections,
  lastUpdated,
  version,
  breadcrumb,
  showFooterCta = false,
}: LegalPageLayoutProps) {
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

        {/* ── Breadcrumb ── */}
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="flex items-center gap-2 mb-8 text-sm text-ky-faint font-inter" aria-label="Breadcrumb">
            {breadcrumb.map((crumb, i) => (
              <span key={crumb.label} className="flex items-center gap-2">
                {i > 0 && <Icon icon="heroicons:chevron-right" className="w-3.5 h-3.5 text-ky-faint shrink-0" />}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-ky-ivory transition-colors">{crumb.label}</Link>
                ) : (
                  <span className="text-ky-ivory">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

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

              {(lastUpdated || version) && (
                <div className="mt-6 pt-4 border-t border-ky-border flex flex-col gap-3">
                  {lastUpdated && (
                    <div>
                      <div className="text-[10px] font-display tracking-[0.25em] uppercase text-ky-faint mb-1">
                        Last Updated
                      </div>
                      <div className="text-sm text-ky-ivory font-display">{lastUpdated}</div>
                    </div>
                  )}
                  {version && (
                    <div>
                      <div className="text-[10px] font-display tracking-[0.25em] uppercase text-ky-faint mb-1">
                        Version
                      </div>
                      <div className="text-sm text-ky-ivory font-display">{version}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Download PDF */}
              <div className="mt-4 pt-4 border-t border-ky-border flex flex-col gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-3 py-2 ky-rounded-sm text-sm text-ky-muted hover:text-ky-ivory hover:bg-ky-raised transition-colors w-full"
                >
                  <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4 shrink-0" />
                  <span className="font-display">Download PDF</span>
                </button>
                <a
                  href="mailto:legal@kyfaru.com?subject=Request%20for%20Printed%20Copy%20of%20Terms"
                  className="flex items-center gap-2 px-3 py-2 ky-rounded-sm text-sm text-ky-muted hover:text-ky-ivory hover:bg-ky-raised transition-colors"
                >
                  <Icon icon="heroicons:envelope" className="w-4 h-4 shrink-0" />
                  <span className="font-display">Request Print Copy</span>
                </a>
              </div>
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
                  <h2 className="text-2xl md:text-3xl font-display font-semibold text-ky-ivory tracking-tight mb-5 border-l-4 border-ky-green-hi pl-4">
                    {s.title}
                  </h2>
                  <div className="text-ky-muted leading-relaxed font-inter text-base flex flex-col gap-4">
                    {s.content}
                  </div>
                </section>
              ))}
            </article>

            {/* ── Footer CTA ── */}
            {showFooterCta && (
              <div className="mt-16 pt-10 border-t border-ky-border">
                <div className="bg-ky-surface border border-ky-border ky-rounded p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <p className="text-sm text-ky-faint font-display tracking-[0.2em] uppercase mb-1">Legal Support</p>
                    <p className="text-lg font-display font-semibold text-ky-ivory">Still have questions about our terms?</p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-ky-green-hi text-white text-sm font-display ky-rounded-sm hover:bg-ky-green-mid transition-colors"
                    >
                      <Icon icon="heroicons:chat-bubble-left-ellipsis" className="w-4 h-4" />
                      Contact Us
                    </Link>
                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-2 px-5 py-2.5 border border-ky-border text-ky-muted text-sm font-display ky-rounded-sm hover:text-ky-ivory hover:border-ky-border-hi transition-colors"
                    >
                      <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
                      Download PDF
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
