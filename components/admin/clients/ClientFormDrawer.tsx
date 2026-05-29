'use client'

import { useEffect, useState } from 'react'
import { Loader2, Save } from 'lucide-react'
import Drawer from '@/components/admin/shared/Drawer'
import { TextField, TextAreaField, SelectField } from '@/components/admin/shared/Form/Field'
import KyPhoneInput from '@/components/ui/KyPhoneInput'
import { INDUSTRY_OPTIONS } from '@/lib/admin/constants/industries'
import { useCountriesList, useStates } from '@/lib/hooks/useGeo'
import { kfToast } from '@/lib/admin/toast'
import type { Client } from '@/lib/admin/db/schema'

interface Props {
  open: boolean
  onClose: () => void
  /** When provided, the drawer edits this client; otherwise it creates a new one. */
  client?: Client | null
  onSaved?: () => void
}

const EMPTY = {
  name: '', email: '', contactPerson: '', industry: '',
  phoneCountry: 'KE', phoneNumber: '', whatsappNumber: '',
  country: 'Kenya', county: '', kraPin: '', notes: '',
}

export default function ClientFormDrawer({ open, onClose, client, onSaved }: Props) {
  const isEdit = !!client?.id
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const { data: countries = [] } = useCountriesList()
  const { data: states = [] } = useStates(form.country)

  useEffect(() => {
    if (open) {
      setForm(
        client
          ? {
              name: client.name ?? '', email: client.email ?? '',
              contactPerson: client.contactPerson ?? '', industry: client.industry ?? '',
              phoneCountry: 'KE', phoneNumber: client.phone ?? '',
              whatsappNumber: client.whatsappNumber ?? '',
              country: client.country ?? 'Kenya', county: client.county ?? '',
              kraPin: client.kraPin ?? '', notes: client.notes ?? '',
            }
          : EMPTY,
      )
    }
  }, [open, client])

  function set<K extends keyof typeof EMPTY>(k: K, v: string) {
    setForm((p) => ({ ...p, [k]: v }))
  }

  async function handleSave() {
    if (!form.name.trim() || !form.email.trim()) return kfToast.warning('Name and email are required')
    if (!form.contactPerson.trim()) return kfToast.warning('Contact person is required')
    if (!form.phoneNumber.trim()) return kfToast.warning('Phone is required')
    setSaving(true)
    try {
      const payload = {
        name: form.name, email: form.email, contactPerson: form.contactPerson,
        industry: form.industry, phone: form.phoneNumber, whatsappNumber: form.whatsappNumber,
        country: form.country, county: form.county, kraPin: form.kraPin, notes: form.notes,
      }
      const url = isEdit ? `/api/admin/clients/${client!.id}` : '/api/admin/clients'
      const res = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) return kfToast.error(data.error ?? 'Save failed')
      kfToast.success(isEdit ? 'Client updated' : 'Client created')
      onSaved?.()
      onClose()
    } catch {
      kfToast.error('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const countryOptions = countries.map((c) => ({ value: c, label: c }))
  const countyOptions = states.map((s) => ({ value: s, label: s }))

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit client' : 'New client'}
      description={isEdit ? client?.name : 'Add a new client account.'}
      footer={
        <>
          <button onClick={onClose} className="flex-1 h-10 rounded-lg border border-zinc-200 text-sm text-zinc-700 hover:bg-zinc-50 transition">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} className="flex-1 h-10 rounded-lg bg-[var(--kf-green)] hover:bg-[var(--kf-green-dark)] text-white text-sm font-medium flex items-center justify-center gap-2 transition disabled:opacity-60">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving…' : 'Save'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <TextField label="Client name" required value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Acme Ltd" />
        <TextField label="Email" type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="hello@acme.com" />
        <div className="grid grid-cols-2 gap-3">
          <TextField label="Contact person" required value={form.contactPerson} onChange={(e) => set('contactPerson', e.target.value)} placeholder="Jane Wanjiku" />
          <SelectField label="Industry" value={form.industry} onChange={(v) => set('industry', v)} options={INDUSTRY_OPTIONS} placeholder="Select industry…" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-700">Phone <span className="text-red-500">*</span></label>
          <KyPhoneInput
            countryCode={form.phoneCountry}
            number={form.phoneNumber}
            onCountryChange={(v) => set('phoneCountry', v)}
            onNumberChange={(v) => set('phoneNumber', v)}
          />
        </div>
        <TextField label="WhatsApp number" value={form.whatsappNumber} onChange={(e) => set('whatsappNumber', e.target.value)} placeholder="+254…" />
        <div className="grid grid-cols-2 gap-3">
          <SelectField label="Country" value={form.country} onChange={(v) => { set('country', v); set('county', '') }} options={countryOptions} placeholder="Select country…" />
          <SelectField label="County / State" value={form.county} onChange={(v) => set('county', v)} options={countyOptions} placeholder={states.length ? 'Select…' : 'No states'} />
        </div>
        <TextField label="KRA PIN" value={form.kraPin} onChange={(e) => set('kraPin', e.target.value)} placeholder="A000000000X" />
        <TextAreaField label="Notes" maxLength={300} value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Anything worth remembering…" />
      </div>
    </Drawer>
  )
}
