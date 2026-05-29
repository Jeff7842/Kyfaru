'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ConfirmVariant = 'danger' | 'warning' | 'default'

export interface ConfirmOptions {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: ConfirmVariant
  /** When set, the user must type this exact string to enable the confirm button. */
  requireTyping?: string
}

interface ConfirmDialogProps extends ConfirmOptions {
  open: boolean
  onConfirm: () => void | Promise<void>
  onCancel: () => void
}

const confirmBtn: Record<ConfirmVariant, string> = {
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  warning: 'bg-amber-500 hover:bg-amber-600 text-white',
  default: 'bg-[var(--kf-green)] hover:bg-[var(--kf-green-dark)] text-white',
}

const iconColor: Record<ConfirmVariant, string> = {
  danger: 'text-red-600 bg-red-100',
  warning: 'text-amber-600 bg-amber-100',
  default: 'text-[var(--kf-green)] bg-[var(--kf-green)]/10',
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  requireTyping,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [typed, setTyped] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (open) {
      setTyped('')
      setBusy(false)
    }
  }, [open])

  const typingOk = !requireTyping || typed === requireTyping

  async function handleConfirm() {
    if (!typingOk) return
    setBusy(true)
    try {
      await onConfirm()
    } finally {
      setBusy(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={busy ? undefined : onCancel}
          />
          <motion.div
            className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            role="alertdialog"
            aria-modal="true"
          >
            <div className="flex gap-4">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                  iconColor[variant],
                )}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
                {description && <p className="text-sm text-zinc-500 mt-1">{description}</p>}

                {requireTyping && (
                  <div className="mt-3">
                    <p className="text-xs text-zinc-500 mb-1.5">
                      Type <span className="font-mono font-semibold text-zinc-700">{requireTyping}</span> to confirm
                    </p>
                    <input
                      autoFocus
                      value={typed}
                      onChange={(e) => setTyped(e.target.value)}
                      className="kf-modal-input"
                      placeholder={requireTyping}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={onCancel}
                disabled={busy}
                className="flex-1 h-10 rounded-lg border border-zinc-200 text-sm text-zinc-700 hover:bg-zinc-50 transition disabled:opacity-60"
              >
                {cancelLabel}
              </button>
              <button
                onClick={handleConfirm}
                disabled={busy || !typingOk}
                className={cn(
                  'flex-1 h-10 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed',
                  confirmBtn[variant],
                )}
              >
                {busy && <Loader2 className="w-4 h-4 animate-spin" />}
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
