'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2, Save, Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import HeroSection from '@/components/admin/layout/HeroSection'
import StatusBadge from '@/components/admin/shared/StatusBadge'
import { TextField, TextAreaField, SelectField } from '@/components/admin/shared/Form/Field'
import VerticalStepper, { type ActivityGroup } from '@/components/admin/projects/VerticalStepper'
import { kfToast } from '@/lib/admin/toast'
import { useConfirmClose } from '@/hooks/useConfirmClose'
import { PAGE_TYPE_OPTIONS } from '@/lib/admin/constants/page-types'
import {
  emptyProjectRequirements,
  type ProjectRequirementsDoc,
  type ProjectMode,
  type PricedItem,
  type PaymentMilestone,
} from '@/lib/admin/types/project-requirements'
import type { Project, Client } from '@/lib/admin/db/schema'

type ProjectWithClient = Project & { client: Client | null }

interface Props {
  projectId: string
  initialProject: ProjectWithClient
}

export default function ProjectDetailsView({ projectId, initialProject }: Props) {
  const router = useRouter()
  const qc = useQueryClient()

  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/projects/${projectId}`)
      const data = await res.json()
      return data.project as ProjectWithClient
    },
    initialData: initialProject,
  })

  const { data: activityGroups } = useQuery({
    queryKey: ['project-activity', projectId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/projects/${projectId}/activity`)
      const data = await res.json()
      return data.groups as ActivityGroup[]
    },
  })

  const [form, setForm] = useState<ProjectRequirementsDoc>(
    () => (initialProject.scopeDocument as ProjectRequirementsDoc | null) ?? emptyProjectRequirements(),
  )
  const snapshotRef = useRef(JSON.stringify(form))
  const [saving, setSaving] = useState(false)

  const isDirty = JSON.stringify(form) !== snapshotRef.current
  const goToList = () => router.push('/admin/projects')
  const requestClose = useConfirmClose(isDirty, goToList)

  useEffect(() => {
    if (!isDirty) return
    function onBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [isDirty])

  function update<K extends keyof ProjectRequirementsDoc>(key: K, value: ProjectRequirementsDoc[K]) {
    setForm((p) => ({ ...p, [key]: value }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scopeDocument: form }),
      })
      const data = await res.json()
      if (!res.ok) {
        kfToast.error(data.error ?? 'Save failed')
        return
      }
      kfToast.success('Project details saved')
      snapshotRef.current = JSON.stringify(form)
      qc.invalidateQueries({ queryKey: ['project', projectId] })
    } catch {
      kfToast.error('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const deemphasizeCustomFields = form.projectMode === 'off_the_shelf'

  return (
    <div className="space-y-6 kf-anim-in pb-10">
      <HeroSection
        title={project.name}
        subtitle={project.client?.name}
        actions={
          <>
            <StatusBadge status={project.status} type="project" />
            <button
              onClick={requestClose}
              className="text-xs text-white/80 hover:text-white underline underline-offset-2"
            >
              Back to projects
            </button>
          </>
        }
      />

      <div className="sticky top-16 z-20 -mx-4 md:-mx-6 px-4 md:px-6 py-3 bg-[var(--kf-bg)]/95 backdrop-blur border-b border-[var(--kf-border)] flex items-center justify-between gap-3">
        <span className="text-xs text-[var(--kf-text-muted)]">
          {isDirty ? 'Unsaved changes' : 'All changes saved'}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={requestClose}
            className="h-9 px-4 rounded-lg border border-zinc-200 text-sm text-zinc-700 hover:bg-zinc-50 transition"
          >
            Cancel
          </button>
          <SaveButton saving={saving} disabled={!isDirty} onClick={handleSave} />
        </div>
      </div>

      <div className="kf-card rounded-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-[var(--kf-text)]">Project type</h3>
          <ModeToggle value={form.projectMode} onChange={(v) => update('projectMode', v)} />
        </div>
        <TextAreaField
          label="Purpose"
          hint="What is this project for? This becomes the Agreement/SOW objective."
          rows={4}
          value={form.purpose}
          onChange={(e) => update('purpose', e.target.value)}
        />
      </div>

      <div className="kf-card rounded-2xl space-y-5">
        <h3 className="text-sm font-semibold text-[var(--kf-text)]">Payments</h3>
        <MilestonesEditor
          values={form.payments.milestones}
          onChange={(milestones) => update('payments', { ...form.payments, milestones })}
        />
        <PricedItemsEditor
          label="Priced items"
          values={form.payments.items}
          onChange={(items) => update('payments', { ...form.payments, items })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div className="kf-card rounded-2xl">
          <TextAreaField
            label="Storage"
            hint="Where project/product data & assets live."
            rows={4}
            value={form.storage}
            onChange={(e) => update('storage', e.target.value)}
          />
        </div>
        <div className="kf-card rounded-2xl space-y-3">
          <h3 className="text-sm font-semibold text-[var(--kf-text)]">Hosting</h3>
          <TextField
            label="Provider"
            value={form.hosting.provider}
            onChange={(e) => update('hosting', { ...form.hosting, provider: e.target.value })}
          />
          <TextField
            label="Cost"
            value={form.hosting.cost}
            onChange={(e) => update('hosting', { ...form.hosting, cost: e.target.value })}
          />
        </div>
        <div className="kf-card rounded-2xl space-y-3">
          <h3 className="text-sm font-semibold text-[var(--kf-text)]">Domain</h3>
          <TextField
            label="Name"
            value={form.domain.name}
            onChange={(e) => update('domain', { ...form.domain, name: e.target.value })}
          />
          <TextField
            label="Cost"
            value={form.domain.cost}
            onChange={(e) => update('domain', { ...form.domain, cost: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="kf-card rounded-2xl">
          <StringListEditor
            label="Communication channels"
            placeholder="e.g. WhatsApp group"
            values={form.communication}
            onChange={(v) => update('communication', v)}
          />
        </div>
        <div className={cn('kf-card rounded-2xl transition', deemphasizeCustomFields && 'opacity-60')}>
          <StringListEditor
            label="Tools"
            placeholder="e.g. Figma"
            values={form.tools}
            onChange={(v) => update('tools', v)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={cn('kf-card rounded-2xl space-y-4 transition', deemphasizeCustomFields && 'opacity-60')}>
          <StringListEditor
            label="Security measures"
            placeholder="e.g. 2FA for admins"
            values={form.security.measures}
            onChange={(v) => update('security', { ...form.security, measures: v })}
          />
          <TextField
            label="Backup schedule"
            value={form.security.backupSchedule}
            onChange={(e) => update('security', { ...form.security, backupSchedule: e.target.value })}
          />
        </div>
        <div className="kf-card rounded-2xl">
          <TextAreaField
            label="Product upload notes"
            rows={5}
            value={form.productUpload}
            onChange={(e) => update('productUpload', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="kf-card rounded-2xl">
          <PricedItemsEditor
            label="Additional charges"
            values={form.additionalCharges}
            onChange={(v) => update('additionalCharges', v)}
          />
        </div>
        <div className="kf-card rounded-2xl">
          <StringListEditor
            label="SEO items"
            placeholder="e.g. Meta descriptions"
            values={form.seoItems}
            onChange={(v) => update('seoItems', v)}
          />
        </div>
      </div>

      <PagesSection pages={form.pages} onChange={(v) => update('pages', v)} />

      <div className="kf-card rounded-2xl">
        <h3 className="text-sm font-semibold text-[var(--kf-text)] mb-4">Activity</h3>
        <VerticalStepper groups={activityGroups ?? []} />
      </div>

      <div className="flex justify-end">
        <SaveButton saving={saving} disabled={!isDirty} onClick={handleSave} size="lg" />
      </div>
    </div>
  )
}

function SaveButton({
  saving,
  disabled,
  onClick,
  size = 'md',
}: {
  saving: boolean
  disabled: boolean
  onClick: () => void
  size?: 'md' | 'lg'
}) {
  return (
    <button
      onClick={onClick}
      disabled={saving || disabled}
      className={cn(
        'rounded-lg bg-[var(--kf-green)] hover:bg-[var(--kf-green-dark)] text-white text-sm font-medium flex items-center gap-2 transition disabled:opacity-60',
        size === 'lg' ? 'h-10 px-5' : 'h-9 px-4',
      )}
    >
      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
      {saving ? 'Saving…' : 'Save'}
    </button>
  )
}

function ModeToggle({ value, onChange }: { value: ProjectMode; onChange: (v: ProjectMode) => void }) {
  return (
    <div className="inline-flex rounded-lg border border-zinc-200 p-0.5 bg-zinc-50">
      {(['off_the_shelf', 'custom'] as const).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          className={cn(
            'px-3 h-8 rounded-md text-xs font-medium transition',
            value === m ? 'bg-white shadow-sm text-[var(--kf-text)]' : 'text-zinc-500 hover:text-zinc-700',
          )}
        >
          {m === 'off_the_shelf' ? 'Off-the-shelf' : 'Custom build'}
        </button>
      ))}
    </div>
  )
}

function StringListEditor({
  label,
  placeholder,
  values,
  onChange,
}: {
  label: string
  placeholder?: string
  values: string[]
  onChange: (v: string[]) => void
}) {
  const [draft, setDraft] = useState('')

  function add() {
    const v = draft.trim()
    if (!v) return
    onChange([...values, v])
    setDraft('')
  }

  function remove(i: number) {
    onChange(values.filter((_, idx) => idx !== i))
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-zinc-700">{label}</label>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              add()
            }
          }}
          placeholder={placeholder}
          className="kf-modal-input"
        />
        <button
          type="button"
          onClick={add}
          aria-label={`Add to ${label}`}
          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-[var(--kf-green)] hover:bg-[var(--kf-green-dark)] text-white transition"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {values.map((v, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 pl-2 pr-1 py-1 rounded-md border border-zinc-200 bg-zinc-50 text-xs text-zinc-700"
            >
              {v}
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label={`Remove ${v}`}
                className="rounded-full p-0.5 hover:bg-black/10 transition"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function PricedItemsEditor({
  label,
  values,
  onChange,
}: {
  label: string
  values: PricedItem[]
  onChange: (v: PricedItem[]) => void
}) {
  function add() {
    onChange([...values, { item: '', price: '' }])
  }

  function update(i: number, patch: Partial<PricedItem>) {
    onChange(values.map((v, idx) => (idx === i ? { ...v, ...patch } : v)))
  }

  function remove(i: number) {
    onChange(values.filter((_, idx) => idx !== i))
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-zinc-700">{label}</label>
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1 text-xs text-[var(--kf-green)] hover:text-[var(--kf-green-dark)] font-medium"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>
      <div className="space-y-2">
        {values.map((v, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={v.item}
              onChange={(e) => update(i, { item: e.target.value })}
              placeholder="Item"
              className="kf-modal-input flex-1"
            />
            <input
              value={v.price}
              onChange={(e) => update(i, { price: e.target.value })}
              placeholder="Price"
              className="kf-modal-input w-28"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Remove item"
              className="p-2 rounded-md text-zinc-400 hover:bg-red-50 hover:text-red-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        {values.length === 0 && <p className="text-xs text-zinc-400">No items yet.</p>}
      </div>
    </div>
  )
}

function MilestonesEditor({
  values,
  onChange,
}: {
  values: PaymentMilestone[]
  onChange: (v: PaymentMilestone[]) => void
}) {
  function add() {
    onChange([...values, { label: '', amount: '' }])
  }

  function update(i: number, patch: Partial<PaymentMilestone>) {
    onChange(values.map((v, idx) => (idx === i ? { ...v, ...patch } : v)))
  }

  function remove(i: number) {
    onChange(values.filter((_, idx) => idx !== i))
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-zinc-700">Payment milestones</label>
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1 text-xs text-[var(--kf-green)] hover:text-[var(--kf-green-dark)] font-medium"
        >
          <Plus className="w-3.5 h-3.5" /> Add milestone
        </button>
      </div>
      <div className="space-y-2">
        {values.map((v, i) => (
          <div key={i} className="flex flex-wrap gap-2">
            <input
              value={v.label}
              onChange={(e) => update(i, { label: e.target.value })}
              placeholder="e.g. Deposit"
              className="kf-modal-input flex-1 min-w-[120px]"
            />
            <input
              value={v.amount}
              onChange={(e) => update(i, { amount: e.target.value })}
              placeholder="Amount"
              className="kf-modal-input w-28"
            />
            <input
              value={v.dueNote ?? ''}
              onChange={(e) => update(i, { dueNote: e.target.value })}
              placeholder="Due note (optional)"
              className="kf-modal-input flex-1 min-w-[140px]"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Remove milestone"
              className="p-2 rounded-md text-zinc-400 hover:bg-red-50 hover:text-red-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        {values.length === 0 && <p className="text-xs text-zinc-400">No milestones yet.</p>}
      </div>
    </div>
  )
}

function PagesSection({
  pages,
  onChange,
}: {
  pages: ProjectRequirementsDoc['pages']
  onChange: (v: ProjectRequirementsDoc['pages']) => void
}) {
  const [selected, setSelected] = useState('')

  function addPage() {
    if (!selected) return
    if (pages.plannedCount > 0 && pages.items.length >= pages.plannedCount) {
      kfToast.warning('Planned page count reached')
      return
    }
    const opt = PAGE_TYPE_OPTIONS.find((o) => o.value === selected)
    onChange({ ...pages, items: [...pages.items, { type: selected, label: opt?.label ?? selected }] })
    setSelected('')
  }

  function updateLabel(i: number, label: string) {
    onChange({ ...pages, items: pages.items.map((it, idx) => (idx === i ? { ...it, label } : it)) })
  }

  function remove(i: number) {
    onChange({ ...pages, items: pages.items.filter((_, idx) => idx !== i) })
  }

  return (
    <div className="kf-card rounded-2xl space-y-4">
      <h3 className="text-sm font-semibold text-[var(--kf-text)]">Pages</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <TextField
          label="Planned page count"
          type="number"
          min={0}
          value={pages.plannedCount}
          onChange={(e) => onChange({ ...pages, plannedCount: Number(e.target.value) || 0 })}
        />
        <SelectField
          label="Add a page"
          value={selected}
          onChange={setSelected}
          options={PAGE_TYPE_OPTIONS}
          placeholder="Select a page type…"
        />
      </div>
      <button
        type="button"
        onClick={addPage}
        disabled={!selected}
        className="inline-flex items-center gap-1.5 text-sm px-3 h-9 rounded-lg bg-[var(--kf-green)] hover:bg-[var(--kf-green-dark)] text-white disabled:opacity-50 transition"
      >
        <Plus className="w-4 h-4" /> Add page
      </button>
      <div className="space-y-2">
        {pages.items.map((it, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 w-16 shrink-0">Page {i + 1}</span>
            <input
              value={it.label}
              onChange={(e) => updateLabel(i, e.target.value)}
              className="kf-modal-input flex-1"
            />
            <span className="text-[10px] uppercase tracking-wide text-zinc-400 shrink-0">{it.type}</span>
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Remove page"
              className="p-2 rounded-md text-zinc-400 hover:bg-red-50 hover:text-red-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        {pages.items.length === 0 && <p className="text-xs text-zinc-400">No pages added yet.</p>}
      </div>
    </div>
  )
}
