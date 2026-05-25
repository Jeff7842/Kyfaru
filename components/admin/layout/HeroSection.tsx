'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/admin/utils'

interface BreadcrumbItem {
  label: string
  href?: string
}

export default function HeroSection({
  title,
  subtitle,
  breadcrumbs,
  actions,
  className,
}: {
  title: string
  subtitle?: React.ReactNode
  breadcrumbs?: BreadcrumbItem[]
  actions?: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'kf-hero relative overflow-hidden rounded-2xl px-6 md:px-8 py-6 md:py-8',
        'flex flex-col md:flex-row md:items-center md:justify-between gap-4',
        className,
      )}
    >
      {/* Subtle pattern overlay */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 10%, #fff 0, transparent 40%), radial-gradient(circle at 80% 60%, #fff 0, transparent 35%)',
        }}
      />
      <div className="relative">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="text-[11px] uppercase tracking-wider text-white/70 mb-2 flex items-center gap-1.5">
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {b.href ? (
                  <Link className="hover:text-white" href={b.href}>
                    {b.label}
                  </Link>
                ) : (
                  <span>{b.label}</span>
                )}
                {i < breadcrumbs.length - 1 && <span>/</span>}
              </span>
            ))}
          </nav>
        )}
        <h1
          className="text-2xl md:text-3xl font-semibold text-white tracking-tight"
          style={{ fontFamily: 'var(--kf-font-display)' }}
        >
          {title}
        </h1>
        {subtitle && (
          <div className="mt-1 text-sm text-white/70">{subtitle}</div>
        )}
      </div>

      {actions && (
        <div className="relative flex items-center gap-2 flex-wrap">{actions}</div>
      )}
    </motion.div>
  )
}
