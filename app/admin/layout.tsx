import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import AdminProviders from '@/components/admin/AdminProviders'

export const metadata: Metadata = {
  title: 'Kyfaru Admin',
  description: 'Kyfaru internal admin dashboard — authorised access only.',
  robots: { index: false, follow: false },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-root min-h-screen w-full">
      <AdminProviders>
        {children}
        <Toaster richColors closeButton position="top-right" />
      </AdminProviders>
    </div>
  )
}
