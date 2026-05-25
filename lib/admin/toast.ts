'use client'

import type { ToasterRef } from '@/components/admin/toast/KfToaster'
import { createRef } from 'react'

export const toasterRef = createRef<ToasterRef>()

type Variant = 'default' | 'success' | 'error' | 'warning'

interface ShowOptions {
  title?: string
  message: string
  variant?: Variant
  duration?: number
  actions?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'outline' | 'ghost'
  }
  onDismiss?: () => void
}

function show(opts: ShowOptions) {
  toasterRef.current?.show(opts)
}

export const kfToast = {
  show,
  success: (message: string, title?: string) => show({ message, title, variant: 'success' }),
  error: (message: string, title?: string) => show({ message, title, variant: 'error' }),
  warning: (message: string, title?: string) => show({ message, title, variant: 'warning' }),
  info: (message: string, title?: string) => show({ message, title, variant: 'default' }),
}
