'use client'

// ============================================================
// PROVIDERS WRAPPER
// Wraps the app with ThemeProvider and QueryClientProvider.
// Add any future global providers here — never in layout.tsx directly.
// ============================================================

import { ThemeProvider } from 'next-themes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import LenisProvider from './LenisProvider'

interface ProvidersProps {
  /** The app's child components to wrap */
  children: React.ReactNode
}

/**
 * App-level providers wrapper.
 * Handles theme (dark/light) and server state (TanStack Query).
 */
export default function Providers({ children }: ProvidersProps) {
  // Each browser session gets its own QueryClient instance
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // Cache data for 5 minutes by default
            retry: 1, // Retry failed requests once only
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {/* ThemeProvider reads/sets the 'class' on <html> for Tailwind dark mode */}
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem={true}
        disableTransitionOnChange
      >
        <LenisProvider>{children}</LenisProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
