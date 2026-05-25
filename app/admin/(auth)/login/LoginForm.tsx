'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import OtpModal from '@/components/admin/auth/OtpModal'
import { kfToast } from '@/lib/admin/toast'

export default function LoginForm({
  callbackUrl,
  initialError,
  googleEnabled,
}: {
  callbackUrl?: string
  initialError?: string
  googleEnabled: boolean
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(initialError ?? null)
  const [showOtp, setShowOtp] = useState(false)

  const target = callbackUrl ?? searchParams.get('callbackUrl') ?? '/admin/dashboard'

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      if (res?.error) {
        setError('Invalid email or password.')
        return
      }
      const sendRes = await fetch('/api/admin/2fa/start', {
        method: 'POST',
        credentials: 'include',
      })
      const sendJson = await sendRes.json().catch(() => null)
      if (sendJson?.required) {
        setShowOtp(true)
      } else {
        kfToast.success('Signed in successfully')
        router.replace(target)
      }
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {showOtp && (
        <OtpModal
          callbackUrl={target}
          onClose={() => setShowOtp(false)}
        />
      )}
    <form onSubmit={onSubmit} className="space-y-4">
      {googleEnabled && (
        <button
          type="button"
          onClick={() => signIn('google', { callbackUrl: target })}
          className="w-full h-11 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 font-medium flex items-center justify-center gap-2 transition"
        >
          <GoogleG /> Sign in with Google
        </button>
      )}
      {googleEnabled && (
        <div className="flex items-center gap-3 text-xs text-zinc-400 my-2">
          <div className="h-px bg-zinc-200 flex-1" />
          or continue with email
          <div className="h-px bg-zinc-200 flex-1" />
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-zinc-700 mb-1.5">
          Email
        </label>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@kyfaru.com"
          className="w-full h-11 px-3 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[var(--kf-green)] focus:ring-2 focus:ring-[var(--kf-green)]/20"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-700 mb-1.5">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full h-11 px-3 pr-10 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[var(--kf-green)] focus:ring-2 focus:ring-[var(--kf-green)]/20"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-zinc-700"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 rounded-lg bg-[var(--kf-green)] hover:bg-[var(--kf-green-dark)] text-white font-medium flex items-center justify-center gap-2 transition disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          'Sign in'
        )}
      </button>

      <a
        href="mailto:support@kyfaru.com?subject=Password%20reset"
        className="block text-center text-xs text-zinc-500 hover:text-zinc-800"
      >
        Forgot password? Contact your administrator.
      </a>
    </form>
    </>
  )
}

function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.17-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.83.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.95v2.32A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.96H.95A9 9 0 0 0 0 9c0 1.45.35 2.83.95 4.04l3.02-2.32z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A8.95 8.95 0 0 0 9 0 9 9 0 0 0 .95 4.96l3.02 2.32C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  )
}
