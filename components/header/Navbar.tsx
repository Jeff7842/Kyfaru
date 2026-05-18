'use client'

// ============================================================
// KYFARU NAVBAR
// Complete redesign — Tailwind-only, theme-aware, with elegant
// mega-dropdowns, working Next.js links, scroll-state effects,
// and motion.dev intro animation.
// ============================================================

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Icon } from '@iconify/react'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

// ── Nav model ────────────────────────────────────────────────
type DropdownLink = {
  label: string
  description: string
  href: string
  icon: string
  accent?: string
}

type NavEntry =
  | { kind: 'link'; label: string; href: string }
  | {
      kind: 'dropdown'
      label: string
      href: string
      columns: { title: string; links: DropdownLink[] }[]
      featured?: { title: string; body: string; href: string; icon: string }
    }

const NAV: NavEntry[] = [
  { kind: 'link', label: 'Home', href: '/' },
  { kind: 'link', label: 'About', href: '/about' },
  {
    kind: 'dropdown',
    label: 'Solutions',
    href: '/solutions',
    featured: {
      title: 'Mwamba AI Engine',
      body: 'The intelligence layer powering every Kyfaru product.',
      href: '/solutions#intelligence',
      icon: 'heroicons:cpu-chip',
    },
    columns: [
      {
        title: 'Build',
        links: [
          { label: 'Web Platforms',  description: 'Next.js applications & SaaS', href: '/solutions#web',           icon: 'heroicons:globe-alt',            accent: 'text-ky-gold' },
          { label: 'Mobile Apps',    description: 'iOS + Android, one codebase', href: '/solutions#mobile',        icon: 'heroicons:device-phone-mobile',  accent: 'text-ky-green-hi' },
          { label: 'AI Integration', description: 'Intelligent automation',      href: '/solutions#intelligence', icon: 'heroicons:cpu-chip',             accent: 'text-ky-gold-hi' },
        ],
      },
      {
        title: 'Infrastructure',
        links: [
          { label: 'USSD Gateways',     description: 'Reach any phone, any network', href: '/solutions#infrastructure', icon: 'heroicons:signal',         accent: 'text-ky-gold' },
          { label: 'Backend Systems',   description: 'APIs, databases, cloud',       href: '/solutions#infrastructure', icon: 'heroicons:server-stack',   accent: 'text-ky-green-hi' },
          { label: 'Custom Email',      description: 'Brand & transactional email',  href: '/solutions#infrastructure', icon: 'heroicons:envelope',       accent: 'text-ky-gold-hi' },
        ],
      },
    ],
  },
  { kind: 'link', label: 'Projects', href: '/projects' },
  {
    kind: 'dropdown',
    label: 'Ecosystem',
    href: '/about#ecosystem',
    columns: [
      {
        title: 'The Kyfaru Ecosystem',
        links: [
          { label: 'Mwamba AI',          description: 'African intelligence engine',  href: '/about#ecosystem', icon: 'heroicons:cpu-chip',     accent: 'text-ky-gold' },
          { label: 'Stackable Academy',  description: 'Industry-ready tech skills',   href: '/about#ecosystem', icon: 'heroicons:academic-cap', accent: 'text-ky-green-hi' },
          { label: 'Kiliforge',          description: 'Research & development lab',   href: '/about#ecosystem', icon: 'heroicons:beaker',       accent: 'text-ky-gold-hi' },
          { label: 'Kyfaru Core',        description: 'Engineering studio',           href: '/about#ecosystem', icon: 'heroicons:cube',         accent: 'text-ky-green' },
        ],
      },
    ],
  },
  {
    kind: 'dropdown',
    label: 'Resources',
    href: '/blog',
    columns: [
      {
        title: 'Read',
        links: [
          { label: 'Blog',         description: 'Insights from the build floor', href: '/blog',         icon: 'heroicons:newspaper',     accent: 'text-ky-gold' },
          { label: 'Case Studies', description: 'Real African projects',         href: '/case-studies', icon: 'heroicons:document-text', accent: 'text-ky-green-hi' },
          { label: 'Newsroom',     description: 'Company milestones',            href: '/newsroom',     icon: 'heroicons:megaphone',     accent: 'text-ky-gold-hi' },
        ],
      },
    ],
  },
  { kind: 'link', label: 'Pricing', href: '/pricing' },
]

// ──────────────────────────────────────────────────────────────

/**
 * Renders the site-wide navbar.
 *
 * Behaviour
 *   • Over hero — fully transparent, full-width, original tall height,
 *                  larger uppercase nav links.
 *   • After hero (scrollY > 0.85 × viewportHeight) — transitions to a
 *                  floating glass pill with 15px radius, slight top gap,
 *                  inset from page edges, slightly compressed link size.
 */
export default function Navbar() {
  const [floating, setFloating] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  // Non-home pages have no tall hero, so the navbar should float immediately.
  const isHomePage = pathname === '/'

  // Switch to the floating pill once we're past the hero block.
  useEffect(() => {
    if (!isHomePage) {
      setFloating(true)
      return
    }
    const compute = () => {
      setFloating(window.scrollY > window.innerHeight * 0.85)
    }
    compute()
    window.addEventListener('scroll', compute, { passive: true })
    window.addEventListener('resize', compute)
    return () => {
      window.removeEventListener('scroll', compute)
      window.removeEventListener('resize', compute)
    }
  }, [isHomePage])

  // Close mobile sheet when a link is followed
  useEffect(() => {
    setMobileOpen(false)
    setOpenIndex(null)
  }, [pathname])

  return (
    <motion.header
      initial={{ y: 0, opacity: 1 }}
      animate={{ y: 10, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn(
        'fixed inset-x-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.2,0.7,0.3,1)]',
        floating ? 'top-3 px-3 md:px-5' : 'top-0 px-0'
      )}
    >
      <div
        className={cn(
          'mx-auto flex items-center justify-between gap-6 transition-all duration-500 ease-[cubic-bezier(0.2,0.7,0.3,1)]',
          floating
            ? 'max-w-[1500px] glass-nav ky-nav-float px-4 md:px-6 py-2.5'
            : 'max-w-[1880px] bg-transparent border-b border-transparent px-5 md:px-10 py-6'
        )}
      >
        {/* ── Logo ── */}
        <Link href="/" aria-label="Kyfaru home" className="flex items-center gap-3 shrink-0">
          <Image
            src="/Logos/Kyfaru Logo Filled-05.png"
            alt="Kyfaru"
            width={48}
            height={48}
            priority
            className="h-10 w-10 object-contain block dark:hidden"
          />
          <Image
            src="/Logos/Dark Logos (2)@3x.png"
            alt="Kyfaru"
            width={48}
            height={48}
            priority
            className="h-10 w-10 object-contain hidden dark:block"
          />
          <span
            className={cn(
              'hidden md:inline-block font-sinhala font-semibold tracking-[0.18em] transition-colors',
              floating ? 'text-ky-ivory text-[18px]' : 'text-white text-[20px]'
            )}
          >
            KYFARU
          </span>
        </Link>

        {/* ── Desktop nav ── */}
        <nav
          className="hidden lg:flex items-center gap-1"
          onMouseLeave={() => setOpenIndex(null)}
        >
          {NAV.map((item, i) => {
            const active =
              item.kind === 'link'
                ? pathname === item.href
                : pathname.startsWith(item.href.split('#')[0]) && item.href !== '/'

            // Larger / more open on hero, condensed when floating
            const linkSize = floating
              ? 'text-[13px] px-3.5 tracking-[0.38em]'
              : 'text-[14px] px-4 tracking-[0.2em]'

            if (item.kind === 'link') {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    'relative py-2 font-medium uppercase font-display transition-colors',
                    linkSize,
                    active
                      ? floating
                        ? 'text-ky-ivory/85 hover:text-white'
                        : 'text-white/90  hover:text-[#efbc31]'
                      : floating
                        ? 'text-ky-ivory/85 hover:text-ky-ivory'
                        : 'text-white/90 hover:text-[#efbc31]'
                  )}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-3 right-3 -bottom-0.5 h-px bg-ky-gold dark:bg-ky-gold"
                    />
                  )}
                </Link>
              )
            }

            // Dropdown trigger + panel
            const isOpen = openIndex === i
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenIndex(i)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'relative flex items-center gap-1.5 py-2 font-medium uppercase font-display transition-colors',
                    linkSize,
                    active || isOpen
                      ? 'text-highlight'
                      : floating
                        ? 'text-ky-ivory/85 hover:text-ky-ivory'
                        : 'text-white/90 hover:text-white'
                  )}
                >
                  {item.label}
                  <Icon
                    icon="heroicons:chevron-down"
                    className={cn('w-3 h-3 transition-transform duration-300', isOpen && 'rotate-180')}
                  />
                </Link>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className={cn(
                        'absolute top-full left-1/2 -translate-x-1/2 z-50',
                        item.featured ? 'w-[640px]' : 'w-[420px]'
                      )}
                    >
                      {/* Solid (no transparency) panel — reads cleanly on both
                          the white light canvas and the green-black dark canvas. */}
                      <div className="ky-rounded border border-ky-border bg-ky-surface shadow-2xl shadow-black/30 overflow-hidden">
                        {/* Top sci-fi bar */}
                        <div className="flex items-center justify-between px-5 py-2 border-b border-ky-border/60 bg-ky-raised/40">
                          <span className="text-[10px] font-display tracking-[0.3em] text-ky-gold">
                            [ {item.label.toUpperCase()} ]
                          </span>
                          <span className="text-[10px] font-display tracking-[0.2em] text-ky-faint">
                            SYS.READY
                          </span>
                        </div>

                        <div
                          className={cn(
                            'p-5',
                            item.featured
                              ? 'grid grid-cols-[1fr_220px] gap-5'
                              : 'grid grid-cols-1 gap-5'
                          )}
                        >
                          <div
                            className={cn(
                              'grid gap-5',
                              item.columns.length > 1 ? 'grid-cols-2' : 'grid-cols-1'
                            )}
                          >
                            {item.columns.map((col) => (
                              <div key={col.title} className="flex flex-col gap-2">
                                <div className="text-[10px] font-display tracking-[0.25em] text-ky-faint uppercase px-2">
                                  {col.title}
                                </div>
                                <div className="flex flex-col gap-1">
                                  {col.links.map((l) => (
                                    <Link
                                      key={l.label}
                                      href={l.href}
                                      className="group flex items-start gap-3 p-2.5 rounded-sm hover:bg-ky-raised transition-colors"
                                    >
                                      <div className={cn(
                                        'w-9 h-9 flex items-center justify-center bg-ky-base/60 ghost-border shrink-0 group-hover:bg-ky-base transition-colors',
                                        l.accent
                                      )}>
                                        <Icon icon={l.icon} className="w-4 h-4" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="text-[13px] font-semibold text-ky-ivory font-display tracking-wide group-hover:text-highlight transition-colors">
                                          {l.label}
                                        </div>
                                        <div className="text-[11px] text-ky-muted leading-snug truncate">
                                          {l.description}
                                        </div>
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Featured side panel */}
                          {item.featured && (
                            <Link
                              href={item.featured.href}
                              className="group relative bg-ky-base/70 ghost-border p-4 flex flex-col justify-between overflow-hidden hover:bg-ky-base transition-colors"
                            >
                              {/* gold ambient corner glow */}
                              <span className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-ky-gold/15 blur-3xl pointer-events-none" />
                              <div>
                                <div className="w-9 h-9 flex items-center justify-center text-ky-gold-hi mb-3">
                                  <Icon icon={item.featured.icon} className="w-5 h-5" />
                                </div>
                                <div className="text-[10px] font-display tracking-[0.3em] text-ky-gold mb-1">FEATURED</div>
                                <div className="font-display font-semibold text-ky-ivory text-sm leading-snug mb-2">
                                  {item.featured.title}
                                </div>
                                <p className="text-[11px] text-ky-muted leading-relaxed">
                                  {item.featured.body}
                                </p>
                              </div>
                              <div className="mt-4 flex items-center gap-2 text-[10px] tracking-[0.25em] font-display text-ky-gold">
                                <span>EXPLORE</span>
                                <Icon icon="heroicons:arrow-right" className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                              </div>
                            </Link>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </nav>

        {/* ── Right side: actions ── */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <ThemeSwitch />

          <Link
            href="/quote"
            className={cn(
              'hidden md:inline-flex items-center gap-2 font-semibold font-display uppercase bg-ky-gold-hi text-[#060d07] hover:bg-ky-gold transition-all duration-300',
              floating
                ? 'px-5 py-2.5 text-[12px] tracking-[0.18em] ky-rounded-sm'
                : 'px-6 py-3 text-[13px] tracking-[0.2em] rounded-[6px]'
            )}
          >
            Get a Quote
            <Icon icon="heroicons:arrow-up-right" className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className={cn(
              'lg:hidden w-10 h-10 flex items-center justify-center transition-colors',
              floating ? 'text-ky-ivory hover:text-ky-gold' : 'text-white hover:text-ky-gold-hi'
            )}
            aria-label="Toggle menu"
          >
            <Icon icon={mobileOpen ? 'heroicons:x-mark' : 'heroicons:bars-3'} className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* ── Mobile sheet ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden glass-nav border-t border-ky-border/30 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-1 max-h-[80vh] overflow-y-auto">
              {NAV.map((item) => {
                if (item.kind === 'link') {
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="py-3 text-base font-display tracking-wider uppercase text-ky-ivory border-b border-ky-border/30"
                    >
                      {item.label}
                    </Link>
                  )
                }
                return (
                  <details key={item.label} className="group py-1 border-b border-ky-border/30">
                    <summary className="py-3 flex items-center justify-between text-base font-display tracking-wider uppercase text-ky-ivory cursor-pointer list-none">
                      {item.label}
                      <Icon icon="heroicons:chevron-down" className="w-4 h-4 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="pb-3 flex flex-col gap-1">
                      {item.columns.flatMap((c) => c.links).map((l) => (
                        <Link
                          key={l.label}
                          href={l.href}
                          className="flex items-start gap-3 py-2.5 px-3 bg-ky-base/40 ghost-border"
                        >
                          <Icon icon={l.icon} className={cn('w-4 h-4 mt-0.5', l.accent ?? 'text-ky-gold')} />
                          <div>
                            <div className="text-sm font-display text-ky-ivory">{l.label}</div>
                            <div className="text-[11px] text-ky-muted">{l.description}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </details>
                )
              })}
              <Link
                href="/quote"
                className="mt-4 inline-flex items-center justify-center gap-2 px-5 py-3 text-[12px] font-semibold tracking-[0.18em] font-display uppercase bg-ky-gold-hi text-ky-base"
              >
                Get a Quote
                <Icon icon="heroicons:arrow-up-right" className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

// ── Local: theme switch ─────────────────────────────────────
function ThemeSwitch() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className="relative w-10 h-10 flex items-center justify-center  hover:text-ky-gold transition-colors"
    >
      {mounted && (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? 'moon' : 'sun'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Icon icon={isDark ? 'heroicons:moon' : 'heroicons:sun'} className="w-5 h-5" />
          </motion.span>
        </AnimatePresence>
      )}
    </button>
  )
}
