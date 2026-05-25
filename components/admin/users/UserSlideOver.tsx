'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Upload, Save, Loader2, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { kfToast } from '@/lib/admin/toast'
import { ROLE_LABELS } from '@/lib/admin/permissions'
import type { Role } from '@/lib/admin/permissions'
import type { User } from '@/lib/admin/db/schema'

const ALL_ROLES = Object.keys(ROLE_LABELS) as Role[]

const ACCESS_TYPES = [
  { value: 'permanent', label: 'Permanent' },
  { value: 'temporary', label: 'Temporary (12 hours)' },
  { value: 'custom', label: 'Custom date range' },
]

interface UserSlideOverProps {
  user: User | null
  open: boolean
  onClose: () => void
  onSaved: (user: User) => void
}

export default function UserSlideOver({ user, open, onClose, onSaved }: UserSlideOverProps) {
  const isNew = user === null
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState<Role>('viewer')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [accessType, setAccessType] = useState('permanent')
  const [accessFrom, setAccessFrom] = useState('')
  const [accessUntil, setAccessUntil] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [isFrozen, setIsFrozen] = useState(false)
  const [password, setPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setName(user?.name ?? '')
      setEmail(user?.email ?? '')
      setPhone(user?.phone ?? '')
      setRole((user?.role as Role) ?? 'viewer')
      setAvatarUrl(user?.avatarUrl ?? user?.image ?? '')
      setAccessType(user?.accessType ?? 'permanent')
      setAccessFrom(user?.accessFrom ? new Date(user.accessFrom).toISOString().slice(0, 10) : '')
      setAccessUntil(user?.accessUntil ? new Date(user.accessUntil).toISOString().slice(0, 10) : '')
      setIsActive(user?.isActive ?? true)
      setIsFrozen(user?.isFrozen ?? false)
      setPassword('')
    }
  }, [open, user])

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/upload/avatar', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) setAvatarUrl(data.url)
      else kfToast.error('Upload failed')
    } catch {
      kfToast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function handleSave() {
    if (!name.trim() || !email.trim()) {
      kfToast.warning('Name and email are required')
      return
    }
    setSaving(true)
    try {
      const body: Record<string, unknown> = {
        name, email, phone, role, avatarUrl, accessType,
        accessFrom: accessType === 'custom' ? accessFrom : null,
        accessUntil:
          accessType === 'temporary'
            ? new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString()
            : accessType === 'custom'
              ? accessUntil
              : null,
        isActive,
        isFrozen,
      }
      if (isNew && password) body.password = password

      const url = isNew ? '/api/admin/users' : `/api/admin/users/${user!.id}`
      const method = isNew ? 'POST' : 'PATCH'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        kfToast.error(data.error ?? 'Save failed')
        return
      }
      kfToast.success(isNew ? 'User created' : 'User updated')
      onSaved(data.user)
      onClose()
    } catch {
      kfToast.error('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          'fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <h2 className="text-base font-semibold text-zinc-900">
            {isNew ? 'Add user' : 'Edit user'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-zinc-100 overflow-hidden border border-zinc-200 flex items-center justify-center">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-semibold text-zinc-400">
                    {name?.[0]?.toUpperCase() ?? '?'}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-[var(--kf-green)] rounded-full flex items-center justify-center text-white hover:bg-[var(--kf-green-dark)] transition"
              >
                {uploading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Upload className="w-3 h-3" />
                )}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-800">{name || 'New user'}</p>
              <p className="text-xs text-zinc-500">{email || '—'}</p>
            </div>
          </div>

          <FieldGroup label="Full name">
            <Input value={name} onChange={setName} placeholder="Jane Doe" />
          </FieldGroup>

          <FieldGroup label="Email">
            <Input type="email" value={email} onChange={setEmail} placeholder="jane@kyfaru.com" />
          </FieldGroup>

          <FieldGroup label="Phone">
            <Input value={phone} onChange={setPhone} placeholder="+254 700 000 000" />
          </FieldGroup>

          {isNew && (
            <FieldGroup label="Temporary password">
              <Input
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="Set initial password"
              />
            </FieldGroup>
          )}

          <FieldGroup label="Role">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full h-10 px-3 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 focus:outline-none focus:border-[var(--kf-green)] focus:ring-2 focus:ring-[var(--kf-green)]/20"
            >
              {ALL_ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r]}
                </option>
              ))}
            </select>
          </FieldGroup>

          <FieldGroup label="Access timeline">
            <select
              value={accessType}
              onChange={(e) => setAccessType(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 focus:outline-none focus:border-[var(--kf-green)] focus:ring-2 focus:ring-[var(--kf-green)]/20"
            >
              {ACCESS_TYPES.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
            {accessType === 'custom' && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> From
                  </label>
                  <input
                    type="date"
                    value={accessFrom}
                    onChange={(e) => setAccessFrom(e.target.value)}
                    className="w-full h-9 px-2 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 focus:outline-none focus:border-[var(--kf-green)]"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Until
                  </label>
                  <input
                    type="date"
                    value={accessUntil}
                    onChange={(e) => setAccessUntil(e.target.value)}
                    className="w-full h-9 px-2 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 focus:outline-none focus:border-[var(--kf-green)]"
                  />
                </div>
              </div>
            )}
          </FieldGroup>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-700">Active account</span>
            <Toggle value={isActive} onChange={setIsActive} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-zinc-700">Frozen</span>
              <p className="text-xs text-zinc-400">Prevents login without deleting the account</p>
            </div>
            <Toggle value={isFrozen} onChange={setIsFrozen} />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-zinc-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-lg border border-zinc-200 text-sm text-zinc-700 hover:bg-zinc-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 h-10 rounded-lg bg-[var(--kf-green)] hover:bg-[var(--kf-green-dark)] text-white text-sm font-medium flex items-center justify-center gap-2 transition disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </aside>
    </>
  )
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-zinc-700 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

function Input({
  type = 'text',
  value,
  onChange,
  placeholder,
}: {
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-10 px-3 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[var(--kf-green)] focus:ring-2 focus:ring-[var(--kf-green)]/20"
    />
  )
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={cn(
        'relative w-10 h-6 rounded-full transition-colors',
        value ? 'bg-[var(--kf-green)]' : 'bg-zinc-200',
      )}
    >
      <span
        className={cn(
          'absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform',
          value ? 'translate-x-5' : 'translate-x-1',
        )}
      />
    </button>
  )
}
