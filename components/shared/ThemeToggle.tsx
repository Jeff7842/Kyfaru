'use client'

// ThemeToggle — switches between dark and light mode using next-themes.

import { useTheme } from 'next-themes'
import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // Standard next-themes mount pattern to prevent hydration mismatch
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  function handleToggle() {
    try {
      setTheme(theme === 'dark' ? 'light' : 'dark')
    } catch (error) {
      console.error('[ThemeToggle] Could not toggle theme:', error)
    }
  }

  return (
    <button
      onClick={handleToggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="w-9 h-9 rounded-full border border-ky-border bg-ky-surface text-ky-muted flex items-center justify-center transition-all duration-200 hover:text-ky-gold hover:border-ky-gold-dim"
    >
      <Icon
        icon={theme === 'dark' ? 'heroicons:sun' : 'heroicons:moon'}
        className="w-4 h-4"
      />
    </button>
  )
}
