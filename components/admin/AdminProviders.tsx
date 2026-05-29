'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { useState } from 'react'
import KfToaster from '@/components/admin/toast/KfToaster'
import { toasterRef } from '@/lib/admin/toast'
import { ConfirmProvider } from '@/hooks/useConfirm'

export default function AdminProviders({
  children,
}: {
  children: React.ReactNode
}) {
  const [qc] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            refetchOnWindowFocus: true,
            retry: 1,
          },
        },
      }),
  )
  return (
    <SessionProvider>
      <QueryClientProvider client={qc}>
        <ConfirmProvider>{children}</ConfirmProvider>
        <KfToaster ref={toasterRef} defaultPosition="bottom-right" />
      </QueryClientProvider>
    </SessionProvider>
  )
}
