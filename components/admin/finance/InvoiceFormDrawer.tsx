'use client'

import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Loader2, Save, Plus, Trash2 } from 'lucide-react'
import Drawer from '@/components/admin/shared/Drawer'
import { TextField, TextAreaField, SelectField } from '@/components/admin/shared/Form/Field'
import { kfToast } from '@/lib/admin/toast'
import type { Invoice, Project, Client } from '@/lib/admin/db/schema'

type ProjectRow = Project & { client: Client | null }
interface LineItem {
  product: string
  quantity: number
  price: number
}

interface Props {
  open: boolean
  onClose: () => void
  invoice?: Invoice | null
  onSaved?: () => void
}

const STATUS = [
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'paid', label: 'Paid' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'cancelled', label: 'Cancelled' },
]

const blankItem = (): LineItem => ({ product: '', quantity: 1, price: 0 })

export default function InvoiceFormDrawer({ open, onClose, invoice, onSaved }: Props) {
  const isEdit = !!invoice?.id
  const [projectId, setProjectId] = useState('')
  const [status, setStatus] = useState('draft')
  const [dueDate, setDueDate] = useState('')
  const [vatAmount, setVatAmount] = useState('0')
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState<LineItem[]>([blankItem()])
  const [saving, setSaving] = useState(false)

  const { data: projData } = useQuery({
    queryKey: ['project-options'],
    queryFn: async () => {
      const res = await fetch('/api/admin/projects?pageSize=100')
      return res.json() as Promise<{ projects: ProjectRow[] }>
    },
    enabled: open,
  })
  const projects: ProjectRow[] = projData?.projects ?? []
  const projectOptions = projects.map((p) => ({ value: p.id, label: `${p.name}${p.client ? ` — ${p.client.name}` : ''}` }))
  const selectedProject = projects.find((p) => p.id === projectId)

  useEffect(() => {
    if (open) {
      setProjectId(invoice?.projectId ?? '')
      setStatus(invoice?.status ?? 'draft')
      setDueDate(invoice?.dueDate ? new Date(invoice.dueDate).toISOString().slice(0, 10) : '')
      setVatAmount(invoice?.vatAmount ?? '0')
      setNotes(invoice?.notes ?? '')
      const li = (invoice?.lineItems as LineItem[] | undefined) ?? null
      setItems(li && li.length ? li : [blankItem()])
    }
  }, [open, invoice])

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.price) || 0), 0),
    [items],
  )
  const amount = subtotal + (Number(vatAmount) || 0)

  function updateItem(i: number, patch: Partial<LineItem>) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)))
  }

  async function handleSave() {
    if (!projectId) return kfToast.warning('Select a project')
    if (!dueDate) return kfToast.warning('Due date is required')
    const clientId = selectedProject?.client?.id ?? selectedProject?.clientId
    if (!clientId) return kfToast.error('Selected project has no client')

    setSaving(true)
    try {
      const payload = {
        projectId,
        clientId,
        amount,
        vatAmount: Number(vatAmount) || 0,
        status,
        dueDate,
        lineItems: items.filter((it) => it.product.trim()),
        notes,
        ...(status !== 'draft' ? { issuedAt: new Date().toISOString() } : {}),
      }
      const url = isEdit ? `/api/admin/invoices/${invoice!.id}` : '/api/admin/invoices'
      const res = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) return kfToast.error(data.error ?? 'Save failed')
      kfToast.success(isEdit ? 'Invoice updated' : 'Invoice created')
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
      width="max-w-2xl"
      title={isEdit ? `Edit ${invoice?.invoiceNumber}` : 'New invoice'}
      description={isEdit ? undefined : 'Invoice number is generated automatically.'}
      footer={
        <>
          <button onClick={onClose} className="flex-1 h-10 rounded-lg border border-zinc-200 text-sm text-zinc-700 hover:bg-zinc-50 transition">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 h-10 rounded-lg bg-[var(--kf-green)] hover:bg-[var(--kf-green-dark)] text-white text-sm font-medium flex items-center justify-center gap-2 transition disabled:opacity-60">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving…' : 'Save'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <SelectField label="Project" required value={projectId} onChange={setProjectId} options={projectOptions} placeholder="Select a project…" />
        <div className="grid grid-cols-2 gap-3">
          <SelectField label="Status" value={status} onChange={setStatus} options={STATUS} />
          <TextField label="Due date" type="date" required value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-zinc-700">Line items</label>
            <button type="button" onClick={() => setItems((p) => [...p, blankItem()])} className="text-xs text-[var(--kf-green)] hover:underline flex items-center gap-1">
              <Plus className="w-3 h-3" /> Add item
            </button>
          </div>
          <div className="space-y-2">
            {items.map((it, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input value={it.product} onChange={(e) => updateItem(i, { product: e.target.value })} placeholder="Description" className="kf-modal-input flex-1" />
                <input type="number" value={it.quantity} onChange={(e) => updateItem(i, { quantity: Number(e.target.value) })} placeholder="Qty" className="kf-modal-input w-16" />
                <input type="number" value={it.price} onChange={(e) => updateItem(i, { price: Number(e.target.value) })} placeholder="Price" className="kf-modal-input w-28" />
                <button type="button" onClick={() => setItems((p) => p.filter((_, idx) => idx !== i))} className="p-1.5 text-zinc-400 hover:text-red-600 transition" aria-label="Remove item">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <TextField label="VAT amount (KES)" type="number" value={vatAmount} onChange={(e) => setVatAmount(e.target.value)} />
          <div className="flex flex-col justify-end">
            <div className="text-xs text-zinc-500">Total</div>
            <div className="text-lg font-semibold text-[var(--kf-green)]">
              {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(amount)}
            </div>
          </div>
        </div>

        <TextAreaField label="Notes" maxLength={500} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
    </Drawer>
  )
}
