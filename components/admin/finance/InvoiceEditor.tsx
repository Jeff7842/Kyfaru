'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Loader2, Save, Eye, FileDown, Plus, Trash2 } from 'lucide-react'
import { formatMoney } from '@/lib/admin/utils'
import HeroSection from '@/components/admin/layout/HeroSection'
import { TextAreaField, SelectField } from '@/components/admin/shared/Form/Field'
import { InputNumber } from '@/components/admin/shared/Form/InputNumber'
import DatePicker from '@/components/admin/shared/DatePicker'
import { kfToast } from '@/lib/admin/toast'
import { useConfirmClose } from '@/hooks/useConfirmClose'
import { useRegisterNavigationGuard } from '@/hooks/useNavigationGuard'
import type { Invoice, Project, Client } from '@/lib/admin/db/schema'

type ProjectRow = Project & { client: Client | null }
type InvoiceWithRelations = Invoice & { client: Client | null; project: Project | null }

interface LineItem {
  product: string
  quantity: number
  price: number
}

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'paid', label: 'Paid' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'cancelled', label: 'Cancelled' },
]

const blankItem = (): LineItem => ({ product: '', quantity: 1, price: 0 })

// Pure so it can seed both the useState initializers and the dirty-check
// snapshot from the same field order - initialInvoice arrives synchronously
// as a server-fetched prop (no useQuery involved), so there's no async load
// to guard with a loadedRef/useEffect the way QuoteEditor does.
function toFormState(inv?: InvoiceWithRelations) {
  const li = (inv?.lineItems as LineItem[] | null) ?? []
  return {
    projectId: inv?.projectId ?? '',
    status: inv?.status ?? 'draft',
    dueDate: inv?.dueDate ? new Date(inv.dueDate).toISOString().slice(0, 10) : '',
    vatAmount: inv?.vatAmount ?? '0',
    notes: inv?.notes ?? '',
    items: li.length ? li : [blankItem()],
    itemFont: inv?.itemFont ?? 'mono',
  }
}

interface Props {
  invoiceId?: string
  initialInvoice?: InvoiceWithRelations
}

export default function InvoiceEditor({ invoiceId, initialInvoice }: Props) {
  const isEdit = !!invoiceId
  const router = useRouter()
  const initial = toFormState(initialInvoice)

  const [projectId, setProjectId] = useState(initial.projectId)
  const [status, setStatus] = useState<string>(initial.status)
  const [dueDate, setDueDate] = useState(initial.dueDate)
  const [vatAmount, setVatAmount] = useState(initial.vatAmount)
  const [notes, setNotes] = useState(initial.notes)
  const [items, setItems] = useState<LineItem[]>(initial.items)
  const [itemFont, setItemFont] = useState(initial.itemFont)
  const [saving, setSaving] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [previewing, setPreviewing] = useState(false)
  // Tracks the real invoice id across the create -> edit transition, since
  // `invoiceId` (a prop) stays undefined until this component remounts on
  // the pushed /invoices/[newId] route.
  const idRef = useRef(invoiceId)
  const snapshotRef = useRef(JSON.stringify(initial))

  const { data: projData } = useQuery({
    queryKey: ['project-options'],
    queryFn: async () => {
      const res = await fetch('/api/admin/projects?pageSize=100')
      return res.json() as Promise<{ projects: ProjectRow[] }>
    },
  })
  const projects: ProjectRow[] = projData?.projects ?? []
  const projectOptions = projects.map((p) => ({ value: p.id, label: `${p.name}${p.client ? ` — ${p.client.name}` : ''}` }))
  const selectedProject = projects.find((p) => p.id === projectId)
  // Falls back to the server-fetched invoice's own client while the project
  // list is still loading, so the resolved client shows up without a flash.
  const resolvedClient =
    selectedProject?.client ?? (initialInvoice && projectId === initialInvoice.projectId ? initialInvoice.client : null)
  const resolvedClientId =
    selectedProject?.client?.id ??
    selectedProject?.clientId ??
    (initialInvoice && projectId === initialInvoice.projectId ? initialInvoice.clientId : undefined)

  function buildSnapshot() {
    return JSON.stringify({ projectId, status, dueDate, vatAmount, notes, items, itemFont })
  }

  const isDirty = buildSnapshot() !== snapshotRef.current
  const goBack = () => router.push('/admin/finance')
  const requestClose = useConfirmClose(isDirty, goBack)
  useRegisterNavigationGuard(isDirty)

  useEffect(() => {
    if (!isDirty) return
    function onBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [isDirty])

  const subtotal = items.reduce((sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.price) || 0), 0)
  const amount = subtotal + (Number(vatAmount) || 0)

  function updateItem(i: number, patch: Partial<LineItem>) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)))
  }

  async function save(): Promise<boolean> {
    if (!projectId) {
      kfToast.warning('Select a project')
      return false
    }
    if (!dueDate) {
      kfToast.warning('Due date is required')
      return false
    }
    if (!resolvedClientId) {
      kfToast.error('Selected project has no client')
      return false
    }
    const validItems = items.filter((it) => it.product.trim() && (Number(it.price) || 0) > 0)
    if (validItems.length === 0) {
      kfToast.warning('Add at least one line item with a description and price - the invoice PDF is built entirely from these')
      return false
    }

    setSaving(true)
    try {
      const payload = {
        projectId,
        clientId: resolvedClientId,
        amount,
        vatAmount: Number(vatAmount) || 0,
        status,
        dueDate,
        lineItems: validItems,
        itemFont,
        notes,
        ...(status !== 'draft' ? { issuedAt: new Date().toISOString() } : {}),
        ...(status === 'paid' && !initialInvoice?.paidAt ? { paidAt: new Date().toISOString() } : {}),
      }
      const url = idRef.current ? `/api/admin/invoices/${idRef.current}` : '/api/admin/invoices'
      const res = await fetch(url, {
        method: idRef.current ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        kfToast.error(data.error ?? 'Save failed')
        return false
      }
      snapshotRef.current = buildSnapshot()
      if (!idRef.current) {
        idRef.current = data.invoice.id
        router.push(`/admin/finance/invoices/${data.invoice.id}`)
      }
      return true
    } catch {
      kfToast.error('Something went wrong')
      return false
    } finally {
      setSaving(false)
    }
  }

  async function handleSave() {
    const wasCreate = !idRef.current
    if (await save()) kfToast.success(wasCreate ? 'Invoice created' : 'Invoice saved')
  }

  async function handleExportPdf() {
    setExporting(true)
    try {
      if ((!idRef.current || isDirty) && !(await save())) return
      const res = await fetch(`/api/admin/invoices/${idRef.current}/pdf`)
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        kfToast.error(errData.error ?? 'Export failed')
        return
      }
      const blob = await res.blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `${selectedProject?.name ?? initialInvoice?.project?.name ?? 'Invoice'} Invoice.pdf`
      a.click()
      URL.revokeObjectURL(a.href)
    } finally {
      setExporting(false)
    }
  }

  async function handlePreview() {
    setPreviewing(true)
    try {
      if ((!idRef.current || isDirty) && !(await save())) return
      window.open(`/api/admin/invoices/${idRef.current}/pdf?preview=1`, '_blank')
    } finally {
      setPreviewing(false)
    }
  }

  return (
    <div className="space-y-6 kf-anim-in pb-10">
      <HeroSection
        title={isEdit && initialInvoice ? `Invoice ${initialInvoice.invoiceNumber}` : 'New invoice'}
        subtitle={resolvedClient?.name ?? (isEdit ? undefined : 'Invoice number is generated automatically.')}
        actions={
          <button onClick={requestClose} className="text-xs text-white/80 hover:text-white underline underline-offset-2">
            Back to finance
          </button>
        }
      />

      <div className="sticky top-16 z-20 -mx-4 md:-mx-6 px-4 md:px-6 py-3 bg-[var(--kf-bg)]/95 backdrop-blur border-b border-[var(--kf-border)] flex items-center justify-between gap-3">
        <button onClick={handleSave} disabled={saving || !isDirty} className="h-9 px-4 rounded-lg bg-[var(--kf-green)] hover:bg-[var(--kf-green-dark)] text-white text-sm font-medium flex items-center gap-2 transition disabled:opacity-60">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving…' : 'Save'}
        </button>
        <div className="flex items-center gap-2">
          <button onClick={handlePreview} disabled={previewing} className="h-9 px-4 rounded-lg border border-zinc-200 text-sm text-zinc-700 hover:bg-zinc-50 transition flex items-center gap-2 disabled:opacity-60">
            {previewing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
            Preview
          </button>
          <button onClick={handleExportPdf} disabled={exporting} className="h-9 px-4 rounded-lg border border-zinc-200 text-sm text-zinc-700 hover:bg-zinc-50 transition flex items-center gap-2 disabled:opacity-60">
            {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
            Export PDF
          </button>
        </div>
      </div>

      <div className="kf-card rounded-2xl p-6 max-w-3xl mx-auto space-y-4">
        <SelectField label="Project" required value={projectId} onChange={setProjectId} options={projectOptions} placeholder="Select a project…" />
        {resolvedClient && (
          <p className="text-xs text-[var(--kf-text-muted)] -mt-2">
            Client: <span className="font-medium text-[var(--kf-text)]">{resolvedClient.name}</span>
          </p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SelectField label="Status" value={status} onChange={setStatus} options={STATUS_OPTIONS} />
          <DatePicker label="Due date" required value={dueDate || null} onChange={(v) => setDueDate(v ?? '')} />
        </div>
        <SelectField
          label="Item font"
          value={itemFont}
          onChange={setItemFont}
          options={[
            { value: 'mono', label: 'Roboto Mono (default)' },
            { value: 'serif', label: 'Merriweather (serif)' },
          ]}
        />
      </div>

      <div className="kf-card rounded-2xl p-6 max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[var(--kf-text)]">Line items</h2>
          <button type="button" onClick={() => setItems((p) => [...p, blankItem()])} className="text-xs text-[var(--kf-green)] hover:underline flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Add item
          </button>
        </div>

        <table className="w-full">
          <thead>
            <tr className="text-white text-xs" style={{ backgroundColor: 'var(--kf-green)' }}>
              <th className="text-left font-semibold py-2.5 px-3 rounded-l-md">Description</th>
              <th className="text-right font-semibold py-2.5 px-3 w-28">Qty</th>
              <th className="text-right font-semibold py-2.5 px-3 w-32">Price</th>
              <th className="text-right font-semibold py-2.5 px-3 w-32 rounded-r-md">Total</th>
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i} className="border-b border-[var(--kf-border)] text-sm">
                <td className="py-2.5 px-3">
                  <input value={it.product} onChange={(e) => updateItem(i, { product: e.target.value })} placeholder="Item description" className="w-full bg-transparent border-0 focus:ring-1 focus:ring-[var(--kf-green)] rounded" />
                </td>
                <td className="py-2.5 px-3">
                  <InputNumber variant="compact" min={0} value={it.quantity} onChange={(v) => updateItem(i, { quantity: v })} className="w-24" />
                </td>
                <td className="py-2.5 px-3">
                  <InputNumber variant="compact" min={0} value={it.price} onChange={(v) => updateItem(i, { price: v })} className="w-full" />
                </td>
                <td className="py-2.5 px-3 text-right font-medium">{formatMoney((Number(it.quantity) || 0) * (Number(it.price) || 0))}</td>
                <td>
                  <button type="button" onClick={() => setItems((p) => p.filter((_, idx) => idx !== i))} className="p-1 text-zinc-400 hover:text-red-600 transition" aria-label="Remove item">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-full sm:w-64 space-y-1.5 text-sm">
            <div className="flex justify-between text-[var(--kf-text-muted)]">
              <span>Subtotal</span>
              <span>{formatMoney(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center text-[var(--kf-text-muted)]">
              <span>VAT</span>
              <InputNumber variant="compact" min={0} value={Number(vatAmount) || 0} onChange={(v) => setVatAmount(String(v))} className="w-32 border-b border-zinc-200 text-xs" />
            </div>
            <div className="flex justify-between font-bold text-base pt-1.5 border-t border-[var(--kf-border)] text-[var(--kf-green)]">
              <span>Total</span>
              <span>{formatMoney(amount)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <TextAreaField label="Notes" rows={4} maxLength={500} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
    </div>
  )
}
