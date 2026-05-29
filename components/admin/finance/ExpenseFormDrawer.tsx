'use client'

import { useEffect, useState } from 'react'
import { Loader2, Save } from 'lucide-react'
import Drawer from '@/components/admin/shared/Drawer'
import { TextField, TextAreaField } from '@/components/admin/shared/Form/Field'
import { kfToast } from '@/lib/admin/toast'
import type { Expense } from '@/lib/admin/db/schema'

interface Props {
  open: boolean
  onClose: () => void
  expense?: Expense | null
  onSaved?: () => void
}

const EMPTY = { category: '', description: '', amount: '', paidAt: '', notes: '' }

export default function ExpenseFormDrawer({ open, onClose, expense, onSaved }: Props) {
  const isEdit = !!expense?.id
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setForm(
        expense
          ? {
              category: expense.category ?? '', description: expense.description ?? '',
              amount: expense.amount ?? '', paidAt: expense.paidAt ? new Date(expense.paidAt).toISOString().slice(0, 10) : '',
              notes: expense.notes ?? '',
            }
          : EMPTY,
      )
    }
  }, [open, expense])

  const set = (k: keyof typeof EMPTY, v: string) => setForm((p) => ({ ...p, [k]: v }))

  async function handleSave() {
    if (!form.category.trim() || !form.description.trim() || form.amount === '') {
      return kfToast.warning('Category, description and amount are required')
    }
    setSaving(true)
    try {
      const url = isEdit ? `/api/admin/expenses/${expense!.id}` : '/api/admin/expenses'
      const res = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) return kfToast.error(data.error ?? 'Save failed')
      kfToast.success(isEdit ? 'Expense updated' : 'Expense created')
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
      title={isEdit ? 'Edit expense' : 'New expense'}
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
        <TextField label="Category" required value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="Hosting, Tools, Subcontractor…" />
        <TextField label="Description" required value={form.description} onChange={(e) => set('description', e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <TextField label="Amount (KES)" type="number" required value={form.amount} onChange={(e) => set('amount', e.target.value)} />
          <TextField label="Paid date" type="date" value={form.paidAt} onChange={(e) => set('paidAt', e.target.value)} />
        </div>
        <TextAreaField label="Notes" maxLength={300} value={form.notes} onChange={(e) => set('notes', e.target.value)} />
      </div>
    </Drawer>
  )
}
