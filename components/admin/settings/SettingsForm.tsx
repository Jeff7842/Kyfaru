'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import type { User } from '@/lib/admin/db/schema'

export default function SettingsForm({ user }: { user: User | null }) {
  const [name, setName] = useState(user?.name ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [twoFaEnabled, setTwoFaEnabled] = useState(user?.isTwoFactorEnabled ?? false)
  const [channel, setChannel] = useState<'email' | 'sms' | 'whatsapp'>(
    (user?.twoFactorChannel as 'email' | 'sms' | 'whatsapp') ?? 'email',
  )
  const [saving, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const res = await fetch('/api/admin/settings/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, isTwoFactorEnabled: twoFaEnabled, twoFactorChannel: channel }),
      })
      if (res.ok) {
        toast.success('Settings saved')
      } else {
        toast.error('Failed to save settings')
      }
    })
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Profile */}
      <form onSubmit={handleSubmit} className="kf-card rounded-2xl space-y-5">
        <h2 className="font-semibold text-[var(--kf-text)]">Profile</h2>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[var(--kf-text-muted)] uppercase tracking-wide">
            Display Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="kf-input w-full"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[var(--kf-text-muted)] uppercase tracking-wide">
            Email
          </label>
          <input
            value={user?.email ?? ''}
            disabled
            className="kf-input w-full opacity-60 cursor-not-allowed"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[var(--kf-text-muted)] uppercase tracking-wide">
            Phone (for SMS 2FA)
          </label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="kf-input w-full"
            placeholder="+254…"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="kf-btn-primary flex items-center gap-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          Save Profile
        </button>
      </form>

      {/* 2FA */}
      <div className="kf-card rounded-2xl space-y-5">
        <h2 className="font-semibold text-[var(--kf-text)]">Two-Factor Authentication</h2>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setTwoFaEnabled((v) => !v)}
            className={`relative w-11 h-6 rounded-full transition ${
              twoFaEnabled ? 'bg-[var(--kf-green)]' : 'bg-zinc-200'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                twoFaEnabled ? 'translate-x-5' : ''
              }`}
            />
          </button>
          <span className="text-sm text-[var(--kf-text)]">
            {twoFaEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>

        {twoFaEnabled && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--kf-text-muted)] uppercase tracking-wide">
              Verification channel
            </label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value as 'email' | 'whatsapp' | 'sms')}
              className="kf-input w-full"
            >
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
          </div>
        )}

        <button
          onClick={handleSubmit as unknown as React.MouseEventHandler}
          disabled={saving}
          className="kf-btn-primary flex items-center gap-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          Save 2FA Settings
        </button>
      </div>
    </div>
  )
}
