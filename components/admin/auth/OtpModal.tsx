'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Loader2, X, RefreshCw, ShieldCheck } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { kfToast } from '@/lib/admin/toast'

const RESEND_STEPS = [15, 30, 60, 90, 120, 150]
const MAX_RESENDS = 5

interface OtpModalProps {
  callbackUrl: string
  onClose: () => void
}

export default function OtpModal({ callbackUrl, onClose }: OtpModalProps) {
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendCount, setResendCount] = useState(0)
  const [countdown, setCountdown] = useState(RESEND_STEPS[0])
  const [blocked, setBlocked] = useState(false)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const router = useRouter()
  const { update } = useSession()

  const code = digits.join('')

  const startTimer = useCallback((seconds: number) => {
    if (timerRef.current) clearInterval(timerRef.current)
    setCountdown(seconds)
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  useEffect(() => {
    startTimer(RESEND_STEPS[0])
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [startTimer])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  function handleChange(i: number, val: string) {
    const clean = val.replace(/\D/g, '')
    if (clean.length > 1) {
      const spread = clean.slice(0, 6).split('')
      const next = [...digits]
      spread.forEach((ch, idx) => {
        if (i + idx < 6) next[i + idx] = ch
      })
      setDigits(next)
      const focusIdx = Math.min(i + spread.length, 5)
      inputRefs.current[focusIdx]?.focus()
      return
    }
    const digit = clean.slice(-1)
    const next = [...digits]
    next[i] = digit
    setDigits(next)
    if (digit && i < 5) inputRefs.current[i + 1]?.focus()
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputRefs.current[i - 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault()
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!text) return
    const next = [...digits]
    text.split('').forEach((ch, idx) => { next[idx] = ch })
    setDigits(next)
    const focusIdx = Math.min(text.length, 5)
    inputRefs.current[focusIdx]?.focus()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (code.length < 6 || loading) return
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
        inputRefs.current[0]?.focus()
        return
      }
      await update({ isTwoFactorVerified: true })
      kfToast.success('Identity verified', '2FA')
      router.replace(callbackUrl)
    } catch {
      setError('Something went wrong. Please retry.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    if (resendCount >= MAX_RESENDS) {
      setBlocked(true)
      return
    }
    setResending(true)
    setError(null)
    try {
      await fetch('/api/admin/2fa/start', { method: 'POST', credentials: 'include' })
      const nextCount = resendCount + 1
      setResendCount(nextCount)
      setDigits(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
      if (nextCount >= MAX_RESENDS) {
        setBlocked(true)
      } else {
        startTimer(RESEND_STEPS[nextCount])
        kfToast.info('New code sent')
      }
    } catch {
      kfToast.error('Failed to resend code')
    } finally {
      setResending(false)
    }
  }

  async function handleRestart() {
    await signOut({ redirect: false })
    window.location.replace('/admin/login')
  }

  function handleClose() {
    signOut({ redirect: false }).then(() => onClose())
  }

  const allFilled = code.length === 6

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Two-factor verification"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative z-10 w-full max-w-sm mx-4 bg-white rounded-2xl shadow-2xl p-8">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-[var(--kf-green)]/10 flex items-center justify-center mb-3">
            <ShieldCheck className="w-6 h-6 text-[var(--kf-green)]" />
          </div>
          <h2 className="text-xl font-semibold text-zinc-900">Verify your identity</h2>
          <p className="mt-1.5 text-sm text-zinc-500">
            Enter the 6-digit code sent to your registered channel.
          </p>
        </div>

        {blocked ? (
          <div className="space-y-4 text-center">
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-3 text-sm text-red-700">
              Too many attempts. Please start over to request a new code.
            </div>
            <button
              onClick={handleRestart}
              className="w-full h-11 rounded-lg bg-zinc-900 hover:bg-zinc-700 text-white font-medium flex items-center justify-center gap-2 transition"
            >
              Try again
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex justify-center gap-2">
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={d}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  className="w-11 h-14 text-center text-xl font-semibold rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-900 focus:outline-none focus:border-[var(--kf-green)] focus:ring-2 focus:ring-[var(--kf-green)]/20 transition"
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
              disabled={!allFilled || loading}
              className="w-full h-11 rounded-lg bg-[var(--kf-green)] hover:bg-[var(--kf-green-dark)] text-white font-medium flex items-center justify-center gap-2 transition disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
            </button>

            <div className="flex justify-center">
              {countdown > 0 ? (
                <span className="text-xs text-zinc-400">
                  Resend code in{' '}
                  <span className="font-semibold text-zinc-600 tabular-nums">
                    {countdown}s
                  </span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="flex items-center gap-1.5 text-sm text-[var(--kf-green)] hover:text-[var(--kf-green-dark)] font-medium disabled:opacity-60 transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                  Resend code
                  {resendCount > 0 && (
                    <span className="text-xs text-zinc-400 ml-1">
                      ({MAX_RESENDS - resendCount} left)
                    </span>
                  )}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
