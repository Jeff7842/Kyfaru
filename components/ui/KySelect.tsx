'use client'

// ============================================================
// KY SELECT
// Designer-grade custom dropdown built on Radix UI Select.
// Style: ghost-border trigger, glass dropdown panel, accent gold
// top rail, hover row, accent dot on selected, icon support per
// item, motion.dev open/close animation.
// ============================================================

import * as Select from '@radix-ui/react-select'
import { Icon } from '@iconify/react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'

export interface KySelectOption {
  value: string
  label: string
  /** Optional Iconify icon name shown left of the label */
  icon?: string
  /** Optional secondary description shown below the label */
  description?: string
}

interface KySelectProps {
  value: string
  onValueChange: (value: string) => void
  options: KySelectOption[]
  placeholder?: string
  disabled?: boolean
  required?: boolean
  ariaLabel?: string
  className?: string
}

/**
 * Renders the Kyfaru custom dropdown select.
 */
export default function KySelect({
  value,
  onValueChange,
  options,
  placeholder = 'Choose an option…',
  disabled,
  required,
  ariaLabel,
  className,
}: KySelectProps) {
  const selected = options.find((opt) => opt.value === value)

  return (
    <Select.Root value={value || undefined} onValueChange={onValueChange} disabled={disabled} required={required}>
      <Select.Trigger
        aria-label={ariaLabel}
        className={cn(
          'group w-full flex items-center justify-between gap-3',
          'bg-ky-base ghost-border px-4 py-3.5 text-sm text-ky-ivory text-left',
          'focus:outline-none focus:border-ky-gold-dim focus:bg-ky-raised',
          'data-[state=open]:border-ky-gold-dim data-[state=open]:bg-ky-raised',
          'transition-colors',
          className
        )}
      >
        <Select.Value placeholder={<span className="text-ky-faint">{placeholder}</span>}>
          {selected && (
            <span className="inline-flex items-center gap-2.5">
              {selected.icon && <Icon icon={selected.icon} className="w-4 h-4 text-ky-gold" />}
              <span>{selected.label}</span>
            </span>
          )}
        </Select.Value>
        <Select.Icon className="text-ky-muted group-data-[state=open]:text-ky-gold transition-colors">
          <Icon icon="heroicons:chevron-down" className="w-4 h-4 transition-transform group-data-[state=open]:rotate-180" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <AnimatePresence>
          <Select.Content
            asChild
            position="popper"
            sideOffset={8}
            className="z-[60]"
          >
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="relative w-[var(--radix-select-trigger-width)] min-w-[260px] bg-ky-surface ghost-border shadow-2xl shadow-black/40 backdrop-blur-xl overflow-hidden"
            >
              {/* Gold accent rail */}
              <span className="absolute top-0 left-0 right-0 h-px gold-gradient-bg" />

              {/* Top label row */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-ky-border/60">
                <span className="text-[10px] font-display tracking-[0.3em] uppercase text-ky-gold">
                  [ Select ]
                </span>
                <span className="text-[10px] font-display tracking-[0.2em] text-ky-faint">
                  {options.length} options
                </span>
              </div>

              <Select.Viewport className="p-1.5 max-h-[280px] overflow-auto">
                {options.map((opt) => (
                  <Select.Item
                    key={opt.value}
                    value={opt.value}
                    className={cn(
                      'group/item relative flex items-start gap-3 p-2.5 cursor-pointer outline-none',
                      'data-[highlighted]:bg-ky-raised data-[highlighted]:text-ky-ivory',
                      'data-[state=checked]:bg-ky-base',
                      'transition-colors'
                    )}
                  >
                    {/* Selected dot indicator */}
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-ky-gold opacity-0 data-[state=checked]:opacity-100"
                      // Radix puts data-state on Item but not the span; rely on the parent instead
                      style={{ opacity: opt.value === value ? 1 : 0 }}
                    />

                    {opt.icon && (
                      <span className="shrink-0 w-7 h-7 flex items-center justify-center bg-ky-base ghost-border text-ky-gold/80 group-data-[highlighted]/item:text-ky-gold">
                        <Icon icon={opt.icon} className="w-3.5 h-3.5" />
                      </span>
                    )}

                    <div className="flex-1 min-w-0">
                      <Select.ItemText asChild>
                        <span className="block text-sm font-medium text-ky-ivory truncate">
                          {opt.label}
                        </span>
                      </Select.ItemText>
                      {opt.description && (
                        <span className="block text-[11px] text-ky-muted leading-snug truncate">
                          {opt.description}
                        </span>
                      )}
                    </div>

                    <Select.ItemIndicator className="shrink-0 self-center text-ky-gold">
                      <Icon icon="heroicons:check" className="w-4 h-4" />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </motion.div>
          </Select.Content>
        </AnimatePresence>
      </Select.Portal>
    </Select.Root>
  )
}
