'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Copy, Loader2 } from 'lucide-react'
import { kfToast } from '@/lib/admin/toast'

interface Props {
  open: boolean
  quoteNumber: string
  onClose: () => void
  onConfirm: (reason: string) => Promise<void> | void
}

/** Delete-confirmation modal for a quote: a reason (for the audit trail) plus
 * typing the quote's own code back to confirm - deliberately its own
 * component rather than an extension of the generic ConfirmDialog, since
 * neither the reason textarea nor the copy-to-clipboard code display belong
 * on every other confirm dialog in this app. */
export default function DeleteQuoteModal({ open, quoteNumber, onClose, onConfirm }: Props) {
  const [reason, setReason] = useState('')
  const [typed, setTyped] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (open) {
      setReason('')
      setTyped('')
      setBusy(false)
    }
  }, [open])

  const canDelete = typed === quoteNumber

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(quoteNumber)
      kfToast.success('Copied')
    } catch {
      kfToast.error('Could not copy')
    }
  }

  async function handleDelete() {
    if (!canDelete) return
    setBusy(true)
    try {
      await onConfirm(reason)
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
            onClick={busy ? undefined : onClose}
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
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-zinc-900">Delete quote?</h3>
                <p className="text-sm text-zinc-500 mt-1">This can&apos;t be undone.</p>

                <label className="block text-xs font-medium text-zinc-700 mt-4 mb-1.5">Reason (optional)</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={2}
                  placeholder="Why is this quote being deleted?"
                  className="kf-modal-input resize-none"
                />

                <div className="mt-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="font-mono text-xs font-semibold text-zinc-700">{quoteNumber}</span>
                    <button
                      type="button"
                      onClick={copyCode}
                      aria-label="Copy quote code"
                      className="p-1 rounded hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-xs text-zinc-500 mb-1.5">Type the code above to confirm</p>
                  <input
                    autoFocus
                    value={typed}
                    onChange={(e) => setTyped(e.target.value)}
                    className="kf-modal-input font-mono"
                    placeholder={quoteNumber}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={onClose}
                disabled={busy}
                className="flex-1 h-10 rounded-lg border border-zinc-200 text-sm text-zinc-700 hover:bg-zinc-50 transition disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={busy || !canDelete}
                className="flex-1 h-10 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {busy && <Loader2 className="w-4 h-4 animate-spin" />}
                Delete quote
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
