'use client'

import { useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Loader2, RefreshCw } from 'lucide-react'
import { kfToast as toast } from '@/lib/admin/toast'

export default function TwoFactorForm() {
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const refs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()
  const { update } = useSession()

  const code = digits.join('')

  function handleChange(i: number, val: string) {
    const digit = val.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[i] = digit
    setDigits(next)
    if (digit && i < 5) refs.current[i + 1]?.focus()
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus()
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (code.length < 6) return
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/admin/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setError('Invalid or expired code. Please try again.')
        setDigits(['', '', '', '', '', ''])
        refs.current[0]?.focus()
        return
      }
      await update({ isTwoFactorVerified: true })
      router.replace('/admin')
    } catch {
      setError('Something went wrong. Please retry.')
    } finally {
      setLoading(false)
    }
  }

  async function resendCode() {
    setResending(true)
    try {
      await fetch('/api/admin/2fa/start', { method: 'POST' })
      toast.success('New code sent')
      setDigits(['', '', '', '', '', ''])
      refs.current[0]?.focus()
    } catch {
      toast.error('Failed to resend code')
    } finally {
      setResending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-center gap-2">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-11 h-14 text-center text-xl font-semibold rounded-lg border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:border-[var(--kf-green)] focus:ring-2 focus:ring-[var(--kf-green)]/20 transition"
          />
        ))}
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700 text-center">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || code.length < 6}
        className="w-full h-11 rounded-lg bg-[var(--kf-green)] hover:bg-[var(--kf-green-dark)] text-white font-medium flex items-center justify-center gap-2 transition disabled:opacity-60"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
      </button>

      <button
        type="button"
        onClick={resendCode}
        disabled={resending}
        className="w-full flex items-center justify-center gap-2 text-sm text-zinc-500 hover:text-zinc-800"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
        Resend code
      </button>
    </form>
  )
}
