'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { FieldShell } from './Field'

interface InputNumberProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  required?: boolean
  /** 'card' (default) is the full bordered control; 'compact' fits table cells and inline fields. */
  variant?: 'card' | 'compact'
  label?: React.ReactNode
  error?: string
  hint?: string
  className?: string
  'aria-label'?: string
}

/**
 * Preline HSInputNumber stepper. Preline mutates the input's DOM value directly
 * on increment/decrement clicks (no native input/change event), so a plain
 * React onChange on the <input> would miss button clicks. Instead we render
 * the input uncontrolled (defaultValue) and sync React state from Preline's own
 * `change.hs.inputNumber` event, which fires for typing and button clicks alike.
 */
export function InputNumber({
  value,
  onChange,
  min,
  max,
  step,
  disabled,
  required,
  variant = 'card',
  label,
  error,
  hint,
  className,
  'aria-label': ariaLabel,
}: InputNumberProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  })

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const handleChange = (e: Event) => {
      const next = (e as CustomEvent<{ payload?: { inputValue: number } }>).detail?.payload?.inputValue
      if (typeof next === 'number' && !Number.isNaN(next)) onChangeRef.current(next)
    }
    wrapper.addEventListener('change.hs.inputNumber', handleChange)
    return () => wrapper.removeEventListener('change.hs.inputNumber', handleChange)
  }, [])

  // min/max/step are read by Preline from this JSON attribute, not from the input's own attributes.
  const config = JSON.stringify({ min: min ?? 0, max: max ?? null, step: step ?? 1 })

  const input = (
    <input
      type="number"
      aria-roledescription="Number field"
      aria-label={ariaLabel}
      defaultValue={value}
      disabled={disabled}
      required={required}
      style={{ MozAppearance: 'textfield' }}
      className={cn(
        'w-full min-w-0 p-0 bg-transparent border-0 focus:ring-0',
        '[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
        variant === 'card'
          ? 'text-gray-800 dark:text-neutral-200 placeholder:text-gray-500 dark:placeholder:text-neutral-400'
          : 'text-[var(--kf-text)] placeholder:text-zinc-400',
      )}
      data-hs-input-number-input
    />
  )

  const decrementButton = (small: boolean) => (
    <button
      type="button"
      disabled={disabled}
      aria-label="Decrease"
      className={
        small
          ? 'w-5 h-5 inline-flex shrink-0 justify-center items-center text-zinc-400 hover:text-[var(--kf-green)] disabled:opacity-40 disabled:pointer-events-none'
          : 'size-10 inline-flex justify-center items-center gap-x-2 text-sm font-medium last:rounded-e-lg bg-white dark:bg-neutral-800 text-gray-800 dark:text-white shadow-2xs hover:bg-gray-50 dark:hover:bg-neutral-700 focus:outline-hidden focus:bg-gray-50 dark:focus:bg-neutral-700 disabled:opacity-50 disabled:pointer-events-none'
      }
      data-hs-input-number-decrement
    >
      <svg
        className={small ? 'shrink-0 size-2.5' : 'shrink-0 size-3.5'}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14" />
      </svg>
    </button>
  )

  const incrementButton = (small: boolean) => (
    <button
      type="button"
      disabled={disabled}
      aria-label="Increase"
      className={
        small
          ? 'w-5 h-5 inline-flex shrink-0 justify-center items-center text-zinc-400 hover:text-[var(--kf-green)] disabled:opacity-40 disabled:pointer-events-none'
          : 'size-10 inline-flex justify-center items-center gap-x-2 text-sm font-medium last:rounded-e-lg bg-white dark:bg-neutral-800 text-gray-800 dark:text-white shadow-2xs hover:bg-gray-50 dark:hover:bg-neutral-700 focus:outline-hidden focus:bg-gray-50 dark:focus:bg-neutral-700 disabled:opacity-50 disabled:pointer-events-none'
      }
      data-hs-input-number-increment
    >
      <svg
        className={small ? 'shrink-0 size-2.5' : 'shrink-0 size-3.5'}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14" />
        <path d="M12 5v14" />
      </svg>
    </button>
  )

  const control =
    variant === 'compact' ? (
      <div ref={wrapperRef} data-hs-input-number={config} className={cn('flex items-center gap-x-1', className)}>
        {input}
        <div className="print:hidden flex items-center gap-x-0.5 shrink-0">
          {decrementButton(true)}
          {incrementButton(true)}
        </div>
      </div>
    ) : (
      <div
        ref={wrapperRef}
        data-hs-input-number={config}
        className={cn(
          'bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg',
          className,
        )}
      >
        <div className="w-full flex justify-between items-center gap-x-1">
          <div className="grow py-2 px-3">{input}</div>
          <div className="flex items-center -gap-y-px divide-x divide-gray-200 dark:divide-neutral-700 border-s border-gray-200 dark:border-neutral-700">
            {decrementButton(false)}
            {incrementButton(false)}
          </div>
        </div>
      </div>
    )

  if (label) {
    return (
      <FieldShell label={label} error={error} hint={hint} required={required}>
        {control}
      </FieldShell>
    )
  }

  return control
}
