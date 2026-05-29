'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title?: React.ReactNode
  description?: React.ReactNode
  footer?: React.ReactNode
  /** Tailwind width class for the panel, e.g. "max-w-lg" */
  width?: string
  height?: string
  children: React.ReactNode
}

/**
 * Right-side slide-over used for all create/edit forms in the admin.
 * Generalised from the UserSlideOver pattern. Animated with framer-motion.
 */
export default function Drawer({
  open,
  onClose,
  title,
  description,
  footer,
  width = 'max-w-lg',
  height = 'h-full',
  children,
}: DrawerProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.addEventListener('keydown', onKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 min-h-[90vh]">
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            className={cn(
              'absolute right-0 top-0 h-full w-full bg-white shadow-2xl flex flex-col',
              width,height,
            )}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-zinc-100 shrink-0">
              <div>
                {title && <h2 className="text-base font-semibold text-zinc-900">{title}</h2>}
                {description && <p className="text-xs text-zinc-500 mt-0.5">{description}</p>}
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

            {footer && (
              <div className="px-6 py-4 border-t border-zinc-100 flex items-center gap-3 shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
