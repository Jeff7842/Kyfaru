'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2, Save, Printer, FileDown, Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatMoney } from '@/lib/admin/utils'
import HeroSection from '@/components/admin/layout/HeroSection'
import { TextAreaField } from '@/components/admin/shared/Form/Field'
import DatePicker from '@/components/admin/shared/DatePicker'
import { kfToast } from '@/lib/admin/toast'
import { useConfirmClose } from '@/hooks/useConfirmClose'
import { priceFor, type StackItem } from '@/lib/admin/constants/tech-catalog'
import type { ProjectRequirementsDoc } from '@/lib/admin/types/project-requirements'
import type { Quote, Project, Client } from '@/lib/admin/db/schema'

type ProjectWithClient = Project & { client: Client | null }

interface LineItem {
  description: string
  quantity: number
  unitPrice: number
}

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'declined', label: 'Declined' },
  { value: 'expired', label: 'Expired' },
]

const blankItem = (): LineItem => ({ description: '', quantity: 1, unitPrice: 0 })

interface Props {
  projectId: string
  initialProject: ProjectWithClient
}

export default function QuoteEditor({ projectId, initialProject }: Props) {
  const router = useRouter()
  const qc = useQueryClient()

  const { data } = useQuery({
    queryKey: ['project-quote', projectId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/projects/${projectId}/quote`)
      return res.json() as Promise<{ quote: Quote; project: ProjectWithClient }>
    },
  })
  const quote = data?.quote
  const project = data?.project ?? initialProject

  const [items, setItems] = useState<LineItem[]>([blankItem()])
  const [taxRate, setTaxRate] = useState('0')
  const [dueDate, setDueDate] = useState<string | null>(null)
  const [terms, setTerms] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState('draft')
  // System rows - computed, not hand-typed, each on by default and togglable per quote.
  const [includeToolsRow, setIncludeToolsRow] = useState(true)
  const [depositEnabled, setDepositEnabled] = useState(true)
  const [depositPercent, setDepositPercent] = useState('50')
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(true)
  const [maintenanceFee, setMaintenanceFee] = useState('0')
  const [saving, setSaving] = useState(false)
  const [exporting, setExporting] = useState(false)
  const snapshotRef = useRef('')
  const loadedRef = useRef(false)

  useEffect(() => {
    if (!quote || loadedRef.current) return
    loadedRef.current = true
    const li = (quote.lineItems as LineItem[] | null) ?? []
    const nextItems = li.length ? li : [blankItem()]
    const nextDue = quote.dueDate ? new Date(quote.dueDate).toISOString().slice(0, 10) : null
    const next = {
      items: nextItems, taxRate: quote.taxRate ?? '0', dueDate: nextDue,
      terms: quote.termsAndConditions ?? '', notes: quote.notes ?? '', status: quote.status,
      includeToolsRow: quote.includeToolsRow, depositEnabled: quote.depositEnabled,
      depositPercent: quote.depositPercent ?? '50', maintenanceEnabled: quote.maintenanceEnabled,
      maintenanceFee: quote.maintenanceFee ?? '0',
    }
    setItems(next.items)
    setTaxRate(next.taxRate)
    setDueDate(next.dueDate)
    setTerms(next.terms)
    setNotes(next.notes)
    setStatus(next.status)
    setIncludeToolsRow(next.includeToolsRow)
    setDepositEnabled(next.depositEnabled)
    setDepositPercent(next.depositPercent)
    setMaintenanceEnabled(next.maintenanceEnabled)
    setMaintenanceFee(next.maintenanceFee)
    snapshotRef.current = JSON.stringify(next)
  }, [quote])

  const isDirty = JSON.stringify({
    items, taxRate, dueDate, terms, notes, status,
    includeToolsRow, depositEnabled, depositPercent, maintenanceEnabled, maintenanceFee,
  }) !== snapshotRef.current
  const goBack = () => router.push('/admin/projects')
  const requestClose = useConfirmClose(isDirty, goBack)

  // Standard integration fees for the project's selected tools (from the
  // project details page's "Tools" picker) - shown to the client as one
  // generic "Tools & Equipment" figure, never itemised by tool name, so the
  // quote never reveals which specific vendors/tools Kyfaru uses internally.
  const projectTools = ((project.scopeDocument as ProjectRequirementsDoc | null)?.tools ?? []) as StackItem[]
  const pricedTools = projectTools.filter((t) => priceFor(t) > 0)
  const toolsTotal = includeToolsRow ? pricedTools.reduce((s, t) => s + priceFor(t), 0) : 0

  const itemsSubtotal = items.reduce((s, it) => s + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0), 0)
  const subtotal = itemsSubtotal + toolsTotal
  const tax = subtotal * (Number(taxRate) / 100 || 0)
  const total = subtotal + tax
  const depositAmount = total * (Number(depositPercent) / 100 || 0)
  const balanceAmount = total - depositAmount

  function updateItem(i: number, patch: Partial<LineItem>) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)))
  }

  async function save(): Promise<boolean> {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/quote`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lineItems: items.filter((it) => it.description.trim()),
          taxRate,
          dueDate,
          termsAndConditions: terms,
          notes,
          status,
          includeToolsRow,
          depositEnabled,
          depositPercent,
          maintenanceEnabled,
          maintenanceFee,
        }),
      })
      const resData = await res.json()
      if (!res.ok) {
        kfToast.error(resData.error ?? 'Save failed')
        return false
      }
      snapshotRef.current = JSON.stringify({
        items, taxRate, dueDate, terms, notes, status,
        includeToolsRow, depositEnabled, depositPercent, maintenanceEnabled, maintenanceFee,
      })
      qc.invalidateQueries({ queryKey: ['project-quote', projectId] })
      return true
    } catch {
      kfToast.error('Something went wrong')
      return false
    } finally {
      setSaving(false)
    }
  }

  async function handleSave() {
    if (await save()) kfToast.success('Quote saved')
  }

  async function handleExportPdf() {
    setExporting(true)
    try {
      if (isDirty && !(await save())) return
      const res = await fetch(`/api/admin/projects/${projectId}/quote/pdf`)
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        kfToast.error(errData.error ?? 'Export failed')
        return
      }
      const blob = await res.blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `${project.name} Quote.pdf`
      a.click()
      URL.revokeObjectURL(a.href)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-6 kf-anim-in pb-10 print:space-y-0 print:pb-0">
      <div className="print:hidden">
        <HeroSection
          title={quote ? `Quote ${quote.quoteNumber}` : 'Quote'}
          subtitle={project.client?.name}
          actions={
            <button onClick={requestClose} className="text-xs text-white/80 hover:text-white underline underline-offset-2">
              Back to projects
            </button>
          }
        />
      </div>

      <div className="sticky top-16 z-20 -mx-4 md:-mx-6 px-4 md:px-6 py-3 bg-[var(--kf-bg)]/95 backdrop-blur border-b border-[var(--kf-border)] flex items-center justify-between gap-3 print:hidden">
        <button onClick={handleSave} disabled={saving || !isDirty} className="h-9 px-4 rounded-lg bg-[var(--kf-green)] hover:bg-[var(--kf-green-dark)] text-white text-sm font-medium flex items-center gap-2 transition disabled:opacity-60">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving…' : 'Save'}
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => window.print()} className="h-9 px-4 rounded-lg border border-zinc-200 text-sm text-zinc-700 hover:bg-zinc-50 transition flex items-center gap-2">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button onClick={handleExportPdf} disabled={exporting} className="h-9 px-4 rounded-lg border border-zinc-200 text-sm text-zinc-700 hover:bg-zinc-50 transition flex items-center gap-2 disabled:opacity-60">
            {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
            Export PDF
          </button>
        </div>
      </div>

      {/* The document itself - styled to look like the real quote both on screen and printed */}
      <div className="kf-card rounded-2xl print:rounded-none print:border-none print:shadow-none print:p-0 p-6 md:p-10 max-w-3xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl font-bold text-[var(--kf-green)]">Kyfaru</h1>
            <p className="text-[10px] tracking-widest uppercase text-black">Tech with horns</p>
            <p className="text-xs text-black mt-2">info@kyfaru.com · +254 705 256 443</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-[var(--kf-text)]">QUOTATION</h2>
            {quote && <p className="text-sm text-black mt-1">{quote.quoteNumber}</p>}
          </div>
        </div>

        <div className="h-0.5 bg-[var(--kf-green)] mb-8" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-black mb-1">Bill to</p>
            <p className="text-sm font-semibold text-black">{project.client?.name ?? '—'}</p>
            <p className="text-xs text-black">{project.name}</p>
            {project.client?.address && <p className="text-xs text-black">{project.client.address}</p>}
          </div>
          <div className="sm:text-right space-y-1.5">
            <MetaRow label="Quote date" value={quote ? new Date(quote.quoteDate).toLocaleDateString('en-GB') : '—'} />
            <div className="flex sm:justify-end items-center gap-2">
              <span className="text-xs font-medium text-black">Valid until</span>
              <span className="print:inline hidden text-sm text-black">{dueDate ? new Date(dueDate).toLocaleDateString('en-GB') : '—'}</span>
              <span className="print:hidden">
                <DatePicker value={dueDate} onChange={setDueDate} className="!gap-0" />
              </span>
            </div>
            <div className="flex sm:justify-end items-center gap-2 print:hidden">
              <span className="text-xs font-medium text-black">Status</span>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="text-xs border border-zinc-200 rounded-md px-2 py-1 bg-white">
                {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        <table className="w-full mb-6">
          <thead>
            <tr className="bg-[var(--kf-green)] text-white text-xs">
              <th className="text-left font-semibold py-2 px-3 w-16 rounded-l-md">QTY</th>
              <th className="text-left font-semibold py-2 px-3">Description</th>
              <th className="text-right font-semibold py-2 px-3 w-32">Unit price</th>
              <th className="text-right font-semibold py-2 px-3 w-32 rounded-r-md">Amount</th>
              <th className="w-8 print:hidden" />
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i} className="border-b border-[var(--kf-border)] text-sm">
                <td className="py-2 px-3">
                  <input type="number" min={0} value={it.quantity} onChange={(e) => updateItem(i, { quantity: Number(e.target.value) })} className="w-full bg-transparent print:border-none border-0 focus:ring-1 focus:ring-[var(--kf-green)] rounded" />
                </td>
                <td className="py-2 px-3">
                  <input value={it.description} onChange={(e) => updateItem(i, { description: e.target.value })} placeholder="Item description" className="w-full bg-transparent print:border-none border-0 focus:ring-1 focus:ring-[var(--kf-green)] rounded" />
                </td>
                <td className="py-2 px-3">
                  <input type="number" min={0} value={it.unitPrice} onChange={(e) => updateItem(i, { unitPrice: Number(e.target.value) })} className="w-full text-right bg-transparent print:border-none border-0 focus:ring-1 focus:ring-[var(--kf-green)] rounded" />
                </td>
                <td className="py-2 px-3 text-right font-medium">{formatMoney((Number(it.quantity) || 0) * (Number(it.unitPrice) || 0))}</td>
                <td className="print:hidden">
                  <button type="button" onClick={() => setItems((p) => p.filter((_, idx) => idx !== i))} className="p-1 text-zinc-400 hover:text-red-600 transition" aria-label="Remove item">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
            {toolsTotal > 0 && (
              <tr className="border-b border-[var(--kf-border)] text-sm">
                <td className="py-2 px-3">1</td>
                <td className="py-2 px-3" title={`Admin only - ask if you want the breakdown:\n${pricedTools.map((t) => `${t.name} (${formatMoney(priceFor(t))})`).join('\n')}`}>
                  Tools &amp; Equipment
                </td>
                <td className="py-2 px-3 text-right">{formatMoney(toolsTotal)}</td>
                <td className="py-2 px-3 text-right font-medium">{formatMoney(toolsTotal)}</td>
                <td className="print:hidden" />
              </tr>
            )}
          </tbody>
        </table>

        <div className="print:hidden flex items-center justify-between mb-6">
          <button type="button" onClick={() => setItems((p) => [...p, blankItem()])} className="text-xs text-[var(--kf-green)] hover:underline flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Add line item
          </button>
          {pricedTools.length > 0 && (
            <label className="flex items-center gap-2 text-xs text-zinc-600">
              Include Tools &amp; Equipment ({formatMoney(pricedTools.reduce((s, t) => s + priceFor(t), 0))})
              <Toggle checked={includeToolsRow} onChange={setIncludeToolsRow} />
            </label>
          )}
        </div>

        <div className="flex justify-end mb-8">
          <div className="w-full sm:w-64 space-y-1.5 text-sm">
            <div className="flex justify-between text-black">
              <span>Subtotal</span>
              <span>{formatMoney(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center text-black">
              <span className="flex items-center gap-1.5">
                Tax
                <input type="number" min={0} max={100} value={taxRate} onChange={(e) => setTaxRate(e.target.value)} className="print:hidden w-12 bg-transparent border-0 border-b border-zinc-200 text-xs text-center" />
                <span className="print:inline hidden">({taxRate}</span>%<span className="print:inline hidden">)</span>
              </span>
              <span>{formatMoney(tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-base text-[var(--kf-green)] pt-1.5 border-t border-[var(--kf-border)]">
              <span>Total</span>
              <span>{formatMoney(total)}</span>
            </div>
          </div>
        </div>

        {/* Payment schedule - system-computed rows, not part of the subtotal
            above (they're a breakdown of when the Total is paid, not extra cost) */}
        <div className="mb-8 border border-[var(--kf-border)] rounded-xl p-4 space-y-3">
          <p className="text-[10px] uppercase tracking-wide text-black font-semibold">Payment schedule</p>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-black">
              Deposit to begin work
              <span className="print:hidden inline-flex items-center gap-1">
                (<input type="number" min={0} max={100} value={depositPercent} onChange={(e) => setDepositPercent(e.target.value)} className="w-10 bg-transparent border-0 border-b border-zinc-200 text-xs text-center" />%)
                <Toggle checked={depositEnabled} onChange={setDepositEnabled} />
              </span>
              <span className="print:inline hidden">({depositPercent}%)</span>
            </span>
            {depositEnabled && <span className="font-medium text-black">{formatMoney(depositAmount)}</span>}
          </div>
          {depositEnabled && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-black">Balance on delivery</span>
              <span className="font-medium text-black">{formatMoney(balanceAmount)}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm pt-2 border-t border-[var(--kf-border)]">
            <span className="flex items-center gap-2 text-black">
              Monthly maintenance (after 30 days free)
              <span className="print:hidden">
                <Toggle checked={maintenanceEnabled} onChange={setMaintenanceEnabled} />
              </span>
            </span>
            {maintenanceEnabled && (
              <span className="font-medium text-black flex items-center gap-1">
                <span className="print:hidden">KES</span>
                <input type="number" min={0} value={maintenanceFee} onChange={(e) => setMaintenanceFee(e.target.value)} className="print:hidden w-20 bg-transparent border-0 border-b border-zinc-200 text-right" />
                <span className="print:inline hidden">{formatMoney(Number(maintenanceFee))}</span>
                <span>/mo</span>
              </span>
            )}
          </div>
        </div>

        {/* Standing policy - always shown, never toggled off */}
        <div className="mb-8 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3">
          <p className="text-xs font-semibold text-amber-900">New features requested outside this scope require a separate quote and invoice.</p>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-wide text-black mb-1">Terms and conditions</p>
          <span className="print:block hidden text-xs text-black whitespace-pre-wrap">{terms}</span>
          <span className="print:hidden">
            <TextAreaField rows={3} value={terms} onChange={(e) => setTerms(e.target.value)} className="text-xs" />
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto print:hidden">
        <TextAreaField label="Internal notes (not shown on the exported quote)" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
    </div>
  )
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex sm:justify-end items-center gap-2">
      <span className="text-xs font-medium text-black">{label}</span>
      <span className="text-sm text-black">{value}</span>
    </div>
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn('relative w-8 h-[18px] rounded-full transition-colors shrink-0', checked ? 'bg-[var(--kf-green)]' : 'bg-zinc-200')}
    >
      <span className={cn('absolute top-[2px] w-[14px] h-[14px] bg-white rounded-full shadow transition-transform', checked ? 'translate-x-[16px]' : 'translate-x-[2px]')} />
    </button>
  )
}
