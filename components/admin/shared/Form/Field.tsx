'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface FieldShellProps {
  label?: React.ReactNode
  error?: string
  required?: boolean
  hint?: string
  className?: string
  children: React.ReactNode
}

/** Label + error wrapper shared by all form fields. */
export function FieldShell({ label, error, required, hint, className, children }: FieldShellProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-xs font-medium text-zinc-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-[11px] text-zinc-400">{hint}</p>}
      {error && <p className="text-[11px] text-red-600">{error}</p>}
    </div>
  )
}

/** Small "current / limit" character counter shown under text fields. */
function CharCounter({ value, max }: { value: unknown; max?: number }) {
  if (!max) return null
  const len = typeof value === 'string' ? value.length : 0
  return (
    <span className={cn('text-[11px] ml-auto tabular-nums', len >= max ? 'text-red-500' : 'text-zinc-400')}>
      {len}/{max}
    </span>
  )
}

type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: React.ReactNode
  error?: string
  hint?: string
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, hint, required, className, maxLength, value, ...rest }, ref) => (
    <FieldShell label={label} error={error} hint={hint} required={required}>
      <input
        ref={ref}
        required={required}
        maxLength={maxLength}
        value={value}
        className={cn('kf-modal-input', className)}
        {...rest}
      />
      {maxLength ? (
        <div className="flex">
          <CharCounter value={value} max={maxLength} />
        </div>
      ) : null}
    </FieldShell>
  ),
)
TextField.displayName = 'TextField'

type TextAreaFieldProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: React.ReactNode
  error?: string
  hint?: string
}

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  ({ label, error, hint, required, className, rows = 3, maxLength, value, ...rest }, ref) => (
    <FieldShell label={label} error={error} hint={hint} required={required}>
      <textarea
        ref={ref}
        rows={rows}
        required={required}
        maxLength={maxLength}
        value={value}
        className={cn('kf-modal-input resize-none', className)}
        {...rest}
      />
      {maxLength ? (
        <div className="flex">
          <CharCounter value={value} max={maxLength} />
        </div>
      ) : null}
    </FieldShell>
  ),
)
TextAreaField.displayName = 'TextAreaField'

interface SelectFieldProps {
  label?: React.ReactNode
  error?: string
  hint?: string
  required?: boolean
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
}

/** Native select wrapped in the shared field shell. */
export function SelectField({
  label,
  error,
  hint,
  required,
  value,
  onChange,
  options,
  placeholder,
}: SelectFieldProps) {
  return (
    <FieldShell label={label} error={error} hint={hint} required={required}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="kf-modal-input"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}
