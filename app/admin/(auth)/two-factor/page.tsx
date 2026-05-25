import { auth } from '@/lib/admin/auth'
import { redirect } from 'next/navigation'
import TwoFactorForm from './TwoFactorForm'

export const metadata = { title: 'Two-Factor — Kyfaru Admin' }

export default async function TwoFactorPage() {
  const session = await auth()
  if (!session?.user) redirect('/admin/login')
  const u = session.user as { isTwoFactorEnabled?: boolean; isTwoFactorVerified?: boolean }
  if (!u.isTwoFactorEnabled || u.isTwoFactorVerified) redirect('/admin')

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm">
        <div className="kf-card rounded-2xl">
          <div className="mb-6 text-center">
            <div className="text-3xl mb-2">🔐</div>
            <h1
              className="text-xl font-semibold text-zinc-900"
              style={{ fontFamily: 'var(--kf-font-display)' }}
            >
              Two-Factor Verification
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Enter the 6-digit code we sent to your registered channel.
            </p>
          </div>
          <TwoFactorForm />
        </div>
        <p className="mt-4 text-center text-xs text-zinc-400">
          Having trouble?{' '}
          <a href="mailto:support@kyfaru.com" className="underline">
            Contact admin
          </a>
        </p>
      </div>
    </div>
  )
}
