'use client'

// ============================================================
// KY LOCATION INPUT
// Free-form text field with live autocomplete suggestions
// coming from OpenStreetMap's Nominatim API. We debounce input
// at 350ms before triggering a search so the public endpoint
// stays under its fair-use threshold.
// ============================================================

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Icon } from '@iconify/react'
import { useLocationSearch, type LocationSuggestion } from '@/lib/hooks/useLocationSearch'
import { cn } from '@/lib/utils'

interface KyLocationInputProps {
  value: string
  onChange: (next: string) => void
  /** Optional callback when the user picks a suggestion */
  onSelect?: (suggestion: LocationSuggestion) => void
  placeholder?: string
  required?: boolean
  ariaLabel?: string
}

export default function KyLocationInput({
  value,
  onChange,
  onSelect,
  placeholder = 'City, Country',
  required,
  ariaLabel = 'Location',
}: KyLocationInputProps) {
  // The debounced query that actually hits the API.
  const [debouncedQuery, setDebouncedQuery] = useState(value)
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Debounce: only update the queried string 350ms after the user stops typing.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(value), 350)
    return () => clearTimeout(t)
  }, [value])

  const { data: suggestions = [], isFetching } = useLocationSearch(debouncedQuery)

  // Close on outside click + Escape
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

  const showPopover =
    open && debouncedQuery.trim().length >= 2

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Icon
          icon="heroicons:map-pin"
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ky-faint pointer-events-none"
        />
        <input
          type="text"
          value={value}
          required={required}
          onChange={(e) => {
            onChange(e.target.value)
            if (!open) setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          aria-label={ariaLabel}
          autoComplete="off"
          className="w-full bg-ky-base ghost-border rounded-md pl-10 pr-10 py-3.5 text-sm text-ky-ivory placeholder:text-ky-faint focus:outline-none focus:border-ky-gold-dim focus:bg-ky-raised transition-colors"
        />
        {isFetching && (
          <Icon
            icon="heroicons:arrow-path"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ky-faint animate-spin"
          />
        )}
      </div>

      <AnimatePresence>
        {showPopover && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            role="listbox"
            className="absolute z-50 left-0 right-0 top-full mt-1 bg-ky-surface ghost-border rounded-md shadow-2xl shadow-black/40 overflow-hidden max-h-72 overflow-y-auto"
          >
            {!isFetching && suggestions.length === 0 && (
              <li className="px-4 py-3 text-xs text-ky-faint">No matches yet</li>
            )}
            {suggestions.map((s, i) => (
              <li key={`${s.lat}-${s.lon}-${i}`}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(s.label)
                    setOpen(false)
                    onSelect?.(s)
                  }}
                  className={cn(
                    'w-full flex items-start gap-3 px-3 py-2.5 text-left text-sm',
                    'hover:bg-ky-raised transition-colors',
                  )}
                >
                  <Icon icon="heroicons:map-pin" className="w-3.5 h-3.5 mt-0.5 text-ky-gold shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-ky-ivory truncate">{s.label}</div>
                    <div className="text-[11px] text-ky-muted truncate">{s.fullAddress}</div>
                  </div>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
