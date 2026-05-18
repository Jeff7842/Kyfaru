'use client'

// ============================================================
// KY PHONE INPUT
// Country-aware phone input: a flag + dial-code trigger sits to
// the left of the number field. Click the trigger to open a
// searchable list of countries (powered by restcountries.com).
// Selecting a country swaps the dial code prefix in real time.
// ============================================================

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Icon } from '@iconify/react'
import { useCountries, type Country } from '@/lib/hooks/useCountries'
import { cn } from '@/lib/utils'

interface KyPhoneInputProps {
  /** Selected ISO alpha-2 country code, e.g. "KE" */
  countryCode: string
  /** Bare phone number (no dial code prefix) */
  number: string
  onCountryChange: (code: string) => void
  onNumberChange: (next: string) => void
  placeholder?: string
  required?: boolean
  ariaLabel?: string
}

export default function KyPhoneInput({
  countryCode,
  number,
  onCountryChange,
  onNumberChange,
  placeholder = '712 345 678',
  required,
  ariaLabel = 'Phone number',
}: KyPhoneInputProps) {
  const { data: countries = [], isLoading } = useCountries()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement | null>(null)
  const searchRef = useRef<HTMLInputElement | null>(null)

  // Resolve currently-selected country (fall back to first/Kenya-like default).
  const selected = useMemo<Country | undefined>(() => {
    if (!countries.length) return undefined
    return countries.find((c) => c.code === countryCode) ?? countries.find((c) => c.code === 'KE') ?? countries[0]
  }, [countries, countryCode])

  // If the parent never seeded a code, push the default up once data lands.
  useEffect(() => {
    if (!countryCode && selected) onCountryChange(selected.code)
  }, [countryCode, selected, onCountryChange])

  // Filtered list for the popover.
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return countries
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dial.includes(q) ||
        c.code.toLowerCase().includes(q),
    )
  }, [countries, search])

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent) {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Auto-focus the search field when the popover opens.
  useEffect(() => {
    if (open) requestAnimationFrame(() => searchRef.current?.focus())
  }, [open])

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex w-full bg-ky-base ghost-border rounded-md focus-within:border-ky-gold-dim focus-within:bg-ky-raised transition-colors">
        {/* Country trigger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label="Select country dial code"
          className="flex items-center gap-2 px-3 py-3.5 border-r border-ky-border/60 hover:bg-ky-raised transition-colors rounded-l-md"
        >
          {selected ? (
            <>
              <span className="text-lg leading-none">{selected.flag}</span>
              <span className="text-sm font-medium text-ky-ivory">{selected.dial}</span>
            </>
          ) : (
            <span className="text-xs text-ky-faint">{isLoading ? 'Loading…' : '+—'}</span>
          )}
          <Icon
            icon="heroicons:chevron-down"
            className={cn('w-3.5 h-3.5 text-ky-muted transition-transform', open && 'rotate-180')}
          />
        </button>

        {/* Number field */}
        <input
          type="tel"
          inputMode="tel"
          required={required}
          aria-label={ariaLabel}
          value={number}
          onChange={(e) => onNumberChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="tel-national"
          className="flex-1 bg-transparent px-4 py-3.5 text-sm text-ky-ivory placeholder:text-ky-faint focus:outline-none rounded-r-md"
        />
      </div>

      {/* Country popover */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            role="listbox"
            className="absolute z-50 left-0 top-full mt-1 w-full min-w-[300px] bg-ky-surface ghost-border rounded-md shadow-2xl shadow-black/40 overflow-hidden"
          >
            {/* Search row */}
            <div className="relative border-b border-ky-border/60 bg-ky-raised/40">
              <Icon
                icon="heroicons:magnifying-glass"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ky-faint"
              />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country or dial code…"
                className="w-full pl-9 pr-3 py-2.5 bg-transparent text-sm text-ky-ivory placeholder:text-ky-faint focus:outline-none"
              />
            </div>

            {/* Result list */}
            <ul className="max-h-64 overflow-y-auto py-1">
              {isLoading && (
                <li className="px-4 py-3 text-xs text-ky-faint">Loading countries…</li>
              )}
              {!isLoading && filtered.length === 0 && (
                <li className="px-4 py-3 text-xs text-ky-faint">No matches</li>
              )}
              {filtered.map((c) => {
                const isActive = c.code === selected?.code
                return (
                  <li key={c.code}>
                    <button
                      type="button"
                      onClick={() => {
                        onCountryChange(c.code)
                        setOpen(false)
                        setSearch('')
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2 text-left text-sm transition-colors',
                        'hover:bg-ky-raised',
                        isActive && 'bg-ky-base',
                      )}
                    >
                      <span className="text-base leading-none w-6">{c.flag}</span>
                      <span className="flex-1 min-w-0 truncate text-ky-ivory">{c.name}</span>
                      <span className="text-xs text-ky-muted">{c.dial}</span>
                      {isActive && (
                        <Icon icon="heroicons:check" className="w-3.5 h-3.5 text-ky-gold" />
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
