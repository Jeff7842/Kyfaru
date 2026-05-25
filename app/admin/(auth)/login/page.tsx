import { auth } from '@/lib/admin/auth'
import { redirect } from 'next/navigation'
import LoginForm from './LoginForm'
import Image from 'next/image'

export const metadata = { title: 'Sign in — Kyfaru Admin' }

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>
}) {
  const sp = await searchParams
  const session = await auth()
  if (session?.user) redirect('/admin')

  return (
    <div className="min-h-screen w-full flex">
      {/* Left: form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2">
            <div className="relative w-10 h-10">
              <Image
                src="/Logos/Kyfaru Logo Filled-05.png"
                alt="Kyfaru"
                fill
                sizes="40px"
                className="object-contain"
              />
            </div>
            <span
              className="font-semibold text-lg tracking-tight text-zinc-900"
              style={{ fontFamily: 'var(--kf-font-display)' }}
            >
              Kyfaru
            </span>
          </div>

          <h1
            className="text-3xl font-semibold text-zinc-900 tracking-tight"
            style={{ fontFamily: 'var(--kf-font-display)' }}
          >
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500">
            Kyfaru Internal Dashboard — Authorised access only.
          </p>

          <div className="mt-6">
            <LoginForm
              callbackUrl={sp.callbackUrl}
              initialError={sp.error}
              googleEnabled={
                !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET
              }
            />
          </div>

          <p className="mt-8 text-[11px] leading-relaxed text-zinc-400 max-w-xs">
            This is a private system. Unauthorised access is prohibited. All
            activity is logged.
          </p>
        </div>
      </div>

      {/* Right: brand panel */}
      <div className="hidden lg:flex relative w-[55%] overflow-hidden items-center justify-center kf-hero">
        {/* Animated dots */}
        <div className="absolute inset-0" aria-hidden>
          <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle,#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-emerald-500/30 blur-3xl rounded-full animate-pulse" />
          <div
            className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400/15 blur-3xl rounded-full animate-pulse"
            style={{ animationDelay: '1.5s' }}
          />
        </div>

        <div className="relative max-w-md text-center px-8">
          <div className="text-5xl xl:text-6xl font-semibold text-white leading-tight">
            Designing Systems
            <br />
            <span className="text-[var(--kf-yellow)]">Powering Africa&apos;s Future</span>
          </div>
          <p className="mt-6 text-white/70">
            Every project, every client, every deliverable — in one place.
          </p>

          {/* Floating stat cards */}
          <div className="mt-12 grid grid-cols-2 gap-3 text-left">
            <FloatingStat label="Active projects" value="12" trend="+15%" />
            <FloatingStat label="Revenue MTD" value="KES 1.8M" trend="+8%" />
            <FloatingStat label="Pending invoices" value="4" trend="-2" />
            <FloatingStat label="Delivered" value="38" trend="+3" />
          </div>
        </div>
      </div>
    </div>
  )
}

function FloatingStat({
  label,
  value,
  trend,
}: {
  label: string
  value: string
  trend: string
}) {
  return (
    <div className="rounded-xl bg-white/8 backdrop-blur border border-white/10 p-3">
      <div className="text-[10px] uppercase tracking-wider text-white/60">
        {label}
      </div>
      <div className="mt-1 text-xl font-semibold text-white">{value}</div>
      <div className="text-[11px] text-emerald-300/90">{trend}</div>
    </div>
  )
}
