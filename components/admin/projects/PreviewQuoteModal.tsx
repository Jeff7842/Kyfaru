'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

interface Props {
  open: boolean
  pdfUrl: string | null
  onClose: () => void
}

/** Shows a quote's PDF inline via <iframe> - no download prompt, just a look. */
export default function PreviewQuoteModal({ open, pdfUrl, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && pdfUrl && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-3xl h-[85vh] flex flex-col overflow-hidden"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 shrink-0">
              <h3 className="text-sm font-semibold text-zinc-900">Quote preview</h3>
              <button
                onClick={onClose}
                aria-label="Close"
                className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <iframe src={pdfUrl} className="flex-1 w-full" title="Quote PDF preview" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
