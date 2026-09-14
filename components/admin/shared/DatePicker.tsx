'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import type { Calendar as CalendarType, DateAny } from 'vanilla-calendar-pro'
import 'vanilla-calendar-pro/styles/index.css'

export interface DateRange {
  from: string | null
  to: string | null
}

interface BaseProps {
  label?: string
  placeholder?: string
  min?: string
  max?: string
  disabled?: boolean
  required?: boolean
  className?: string
}

interface SingleProps extends BaseProps {
  mode?: 'single'
  value: string | null
  onChange: (value: string | null) => void
}

interface RangeProps extends BaseProps {
  mode: 'range'
  value: DateRange
  onChange: (value: DateRange) => void
}

type Props = SingleProps | RangeProps

function serializeValue(props: Props): string {
  return props.mode === 'range' ? `${props.value.from ?? ''}|${props.value.to ?? ''}` : (props.value ?? '')
}

/**
 * Controlled date input backed by vanilla-calendar-pro. Defaults to
 * single-date mode (`value`/`onChange` are `string | null`); pass
 * `mode="range"` to switch both to a `DateRange` ({ from, to }) pair.
 *
 * Preline ships an HSDatepicker wrapper around this same engine, but its
 * compiled bundle throws `ReferenceError: _ is not defined` under Turbopack
 * (an unbundled lodash-global reference in Preline's own build) - so this
 * talks to vanilla-calendar-pro directly. It's genuinely dependency-free,
 * which is exactly why it sidesteps that bug, and it still does all the real
 * work (day-generation, keyboard nav, range selection, accessibility).
 */
export default function DatePicker(props: Props) {
  const { label, placeholder, disabled, required, className } = props
  const inputRef = useRef<HTMLInputElement>(null)
  const calendarRef = useRef<CalendarType | null>(null)
  const detachInputRef = useRef<(() => void) | null>(null)
  const isRange = props.mode === 'range'
  const valueKey = serializeValue(props)
  // Tracks the value WE last emitted via onChange, so the sync effect below can
  // tell "the parent passed a new value" (edit an existing record, form reset)
  // apart from "our own click just round-tripped through parent state" - the
  // calendar already reflects the latter, re-initing on it would fight the user.
  const lastEmittedRef = useRef<string>('')
  // Always current, unlike the closure the mount effect below captured at
  // creation time - the dynamic import it awaits can resolve several renders
  // later (e.g. once a drawer's "load the record" effect has run), so reading
  // stale `props` there could initialize the calendar with an outdated value.
  const latestPropsRef = useRef(props)
  latestPropsRef.current = props

  useEffect(() => {
    let destroyed = false
    import('vanilla-calendar-pro').then(({ Calendar }) => {
      if (destroyed || !inputRef.current) return
      const current = latestPropsRef.current
      const selectedDates = current.mode === 'range'
        ? [current.value.from, current.value.to].filter((d): d is string => !!d)
        : current.value
          ? [current.value]
          : []
      lastEmittedRef.current = serializeValue(current)
      const calendar = new Calendar(inputRef.current, {
        inputMode: true,
        selectionDatesMode: isRange ? 'multiple-ranged' : 'single',
        selectedDates,
        // Otherwise clicking an already-selected day (or the same day twice
        // in range mode) deselects/clears it instead of keeping the value.
        enableDateToggle: false,
        dateMin: (current.min || undefined) as DateAny | undefined,
        dateMax: (current.max || undefined) as DateAny | undefined,
        onClickDate(self) {
          // vanilla-calendar-pro doesn't sync the bound input's visible text on
          // selection by itself in this configuration - set it explicitly.
          const dates = self.context.selectedDates
          if (inputRef.current) inputRef.current.value = dates.join(' - ')
          const latest = latestPropsRef.current
          if (latest.mode === 'range') {
            lastEmittedRef.current = `${dates[0] ?? ''}|${dates[1] ?? ''}`
            latest.onChange({ from: dates[0] ?? null, to: dates[1] ?? null })
          } else {
            lastEmittedRef.current = dates[0] ?? ''
            latest.onChange(dates[0] ?? null)
          }
        },
      })
      detachInputRef.current = calendar.init()
      calendarRef.current = calendar
    })
    return () => {
      destroyed = true
      // destroy() alone doesn't drain the popup's own outside-click/resize/keydown
      // listeners if it's still open when unmounted - hide() first, then destroy().
      // Wrapped in try/catch: a fast unmount (e.g. an SPA navigation away from
      // this page) can beat vanilla-calendar-pro's own cleanup to the DOM node,
      // making its internal removeEventListener calls throw on an already-gone
      // element - nothing to recover from during teardown, so swallow it rather
      // than crash the whole React tree.
      try {
        calendarRef.current?.hide()
        calendarRef.current?.destroy()
      } catch {
        // unmounting anyway
      }
      calendarRef.current = null
      try {
        detachInputRef.current?.()
      } catch {
        // unmounting anyway
      }
      detachInputRef.current = null
    }
    // Only re-create on single/range switch - the sync effect below handles
    // external value changes without tearing down the calendar instance.
  }, [isRange])

  useEffect(() => {
    const calendar = calendarRef.current
    if (!calendar || valueKey === lastEmittedRef.current) return
    const selectedDates = isRange
      ? [(props as RangeProps).value.from, (props as RangeProps).value.to].filter((d): d is string => !!d)
      : (props as SingleProps).value
        ? [(props as SingleProps).value as string]
        : []
    lastEmittedRef.current = valueKey
    calendar.set({ selectedDates }, { dates: true })
    if (inputRef.current) inputRef.current.value = isRange ? selectedDates.join(' - ') : (selectedDates[0] ?? '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueKey])

  const displayValue = isRange
    ? [props.value.from, props.value.to].filter(Boolean).join(' - ')
    : (props.value ?? '')

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-xs font-medium text-zinc-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <input
        ref={inputRef}
        type="text"
        readOnly
        disabled={disabled}
        defaultValue={displayValue}
        placeholder={placeholder ?? 'Select date...'}
        className="kf-modal-input cursor-pointer"
      />
    </div>
  )
}
