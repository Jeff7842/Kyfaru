'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Loader2, Save } from 'lucide-react'
import Drawer from '@/components/admin/shared/Drawer'
import { TextField, TextAreaField, SelectField } from '@/components/admin/shared/Form/Field'
import StackInput from '@/components/admin/shared/StackInput'
import { categoryFor, type StackItem } from '@/lib/admin/constants/tech-catalog'
import { kfToast } from '@/lib/admin/toast'
import type { Project, Client } from '@/lib/admin/db/schema'

interface Props {
  open: boolean
  onClose: () => void
  project?: Project | null
  onSaved?: () => void
}

const STATUS_OPTIONS = [
  { value: 'lead', label: 'Lead' },
  { value: 'proposal_sent', label: 'Proposal sent' },
  { value: 'signed', label: 'Signed' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'review', label: 'Review' },
  { value: 'completed', label: 'Completed' },
  { value: 'on_hold', label: 'On hold' },
  { value: 'cancelled', label: 'Cancelled' },
]

const EMPTY = {
  name: '', clientId: '', status: 'lead', description: '',
  startDate: '', expectedEndDate: '', goLiveDate: '',
  quotedAmount: '', githubRepoUrl: '', notes: '',
}

function toDateInput(d: Date | string | null | undefined): string {
  if (!d) return ''
  return new Date(d).toISOString().slice(0, 10)
}

export default function ProjectFormDrawer({ open, onClose, project, onSaved }: Props) {
  const isEdit = !!project?.id
  const [form, setForm] = useState(EMPTY)
  const [stack, setStack] = useState<StackItem[]>([])
  const [saving, setSaving] = useState(false)

  const { data: clientsData } = useQuery({
    queryKey: ['client-options'],
    queryFn: async () => {
      const res = await fetch('/api/admin/clients?pageSize=100')
      return res.json() as Promise<{ clients: Client[] }>
    },
    enabled: open,
  })
  const clientOptions = (clientsData?.clients ?? []).map((c: Client) => ({ value: c.id, label: c.name }))

  useEffect(() => {
    if (open) {
      setForm(
        project
          ? {
              name: project.name ?? '', clientId: project.clientId ?? '',
              status: project.status ?? 'lead', description: project.description ?? '',
              startDate: toDateInput(project.startDate), expectedEndDate: toDateInput(project.expectedEndDate),
              goLiveDate: toDateInput(project.goLiveDate),
              quotedAmount: project.quotedAmount ?? '', githubRepoUrl: project.githubRepoUrl ?? '',
              notes: project.notes ?? '',
            }
          : EMPTY,
      )
      // Prefer structured stack; fall back to legacy techStack[] mapped to categories.
      const structured = project?.stack as StackItem[] | null | undefined
      setStack(
        structured && Array.isArray(structured) && structured.length
          ? structured
          : (project?.techStack ?? []).map((name) => ({ name, category: categoryFor(name) })),
      )
    }
  }, [open, project])

  function set<K extends keyof typeof EMPTY>(k: K, v: string) {
    setForm((p) => ({ ...p, [k]: v }))
  }

  async function handleSave() {
    if (!form.name.trim() || !form.clientId) {
      kfToast.warning('Name and client are required')
      return
    }
    setSaving(true)
    try {
      const payload = {
        ...form,
        quotedAmount: form.quotedAmount === '' ? null : form.quotedAmount,
        stack,
        techStack: stack.map((s) => s.name), // keep legacy column in sync
      }
      const url = isEdit ? `/api/admin/projects/${project!.id}` : '/api/admin/projects'
      const res = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        kfToast.error(data.error ?? 'Save failed')
        return
      }
      kfToast.success(isEdit ? 'Project updated' : 'Project created')
      onSaved?.()
      onClose()
    } catch {
      kfToast.error('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit project' : 'New project'}
      description={isEdit ? project?.name : 'Create a new client project.'}
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
        <TextField label="Project name" required value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Fechi Organics E-Commerce" />
        <SelectField label="Client" required value={form.clientId} onChange={(v) => set('clientId', v)} options={clientOptions} placeholder="Select a client…" />
        <SelectField label="Status" value={form.status} onChange={(v) => set('status', v)} options={STATUS_OPTIONS} />
        <TextAreaField label="Description" maxLength={1000} value={form.description} onChange={(e) => set('description', e.target.value)} />
        <div className="grid grid-cols-3 gap-3">
          <TextField label="Start" type="date" value={form.startDate} onChange={(e) => set('startDate', e.target.value)} />
          <TextField label="Expected end" type="date" value={form.expectedEndDate} onChange={(e) => set('expectedEndDate', e.target.value)} />
          <TextField label="Go-live" type="date" value={form.goLiveDate} onChange={(e) => set('goLiveDate', e.target.value)} />
        </div>
        <TextField label="Quoted amount (KES)" type="number" value={form.quotedAmount} onChange={(e) => set('quotedAmount', e.target.value)} placeholder="500000" />
        <StackInput label="Tech stack" value={stack} onChange={setStack} />
        <TextField label="GitHub repo URL" value={form.githubRepoUrl} onChange={(e) => set('githubRepoUrl', e.target.value)} placeholder="https://github.com/org/repo" />
        <TextAreaField label="Notes" maxLength={500} value={form.notes} onChange={(e) => set('notes', e.target.value)} />
      </div>
    </Drawer>
  )
}
