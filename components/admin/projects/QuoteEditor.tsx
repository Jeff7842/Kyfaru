'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Loader2, Save, Printer, FileDown, Eye, Plus, X,
  DollarSign, Percent, Mail, Phone, Calendar,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatQuoteMoney, CURRENCY_OPTIONS } from '@/lib/admin/constants/currencies'
import { ACCENT_COLOR_OPTIONS, accentHex } from '@/lib/admin/constants/quote-colors'
import HeroSection from '@/components/admin/layout/HeroSection'
import { TextAreaField, SelectField } from '@/components/admin/shared/Form/Field'
import DatePicker from '@/components/admin/shared/DatePicker'
import { kfToast } from '@/lib/admin/toast'
import { useConfirmClose } from '@/hooks/useConfirmClose'
import { useRegisterNavigationGuard } from '@/hooks/useNavigationGuard'
import type { Quote, Project, Client } from '@/lib/admin/db/schema'
import type { ToolPricing } from '@/lib/admin/docs/quote-pdf'

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

// Same figure as lib/admin/docs/docx-helpers.ts's LOGO_ASPECT - kept as a
// local constant since that module is server-only (reads the file off disk)
// and can't be imported into this client component.
const LOGO_ASPECT = 5420 / 1635

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
  const [discount, setDiscount] = useState('0')
  const [currency, setCurrency] = useState('KES')
  const [accentColor, setAccentColor] = useState('green')
  const [contactEmail, setContactEmail] = useState('info@kyfaru.com')
  const [contactPhone, setContactPhone] = useState('+254 705 256 443')
  const [dueDate, setDueDate] = useState<string | null>(null)
  const [terms, setTerms] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState('draft')
  // Editable per-quote pricing for the project's selected tools - seeded
  // server-side from the catalog, freely edited here (price + duration).
  const [toolsPricing, setToolsPricing] = useState<ToolPricing[]>([])
  // System rows - computed, not hand-typed, each on by default and togglable per quote.
  const [includeToolsRow, setIncludeToolsRow] = useState(true)
  const [depositEnabled, setDepositEnabled] = useState(true)
  const [depositPercent, setDepositPercent] = useState('50')
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(true)
  const [maintenanceFee, setMaintenanceFee] = useState('0')
  const [saving, setSaving] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [previewing, setPreviewing] = useState(false)
  const snapshotRef = useRef('')
  const loadedRef = useRef(false)

  useEffect(() => {
    if (!quote || loadedRef.current) return
    loadedRef.current = true
    const li = (quote.lineItems as LineItem[] | null) ?? []
    const nextItems = li.length ? li : [blankItem()]
    const nextDue = quote.dueDate ? new Date(quote.dueDate).toISOString().slice(0, 10) : null
    const next = {
      items: nextItems, taxRate: quote.taxRate ?? '0', discount: quote.discount ?? '0', currency: quote.currency ?? 'KES',
      accentColor: quote.accentColor ?? 'green', contactEmail: quote.contactEmail ?? 'info@kyfaru.com',
      contactPhone: quote.contactPhone ?? '+254 705 256 443', dueDate: nextDue,
      terms: quote.termsAndConditions ?? '', notes: quote.notes ?? '', status: quote.status,
      toolsPricing: (quote.toolsPricing as ToolPricing[] | null) ?? [],
      includeToolsRow: quote.includeToolsRow, depositEnabled: quote.depositEnabled,
      depositPercent: quote.depositPercent ?? '50', maintenanceEnabled: quote.maintenanceEnabled,
      maintenanceFee: quote.maintenanceFee ?? '0',
    }
    setItems(next.items)
    setTaxRate(next.taxRate)
    setDiscount(next.discount)
    setCurrency(next.currency)
    setAccentColor(next.accentColor)
    setContactEmail(next.contactEmail)
    setContactPhone(next.contactPhone)
    setDueDate(next.dueDate)
    setTerms(next.terms)
    setNotes(next.notes)
    setStatus(next.status)
    setToolsPricing(next.toolsPricing)
    setIncludeToolsRow(next.includeToolsRow)
    setDepositEnabled(next.depositEnabled)
    setDepositPercent(next.depositPercent)
    setMaintenanceEnabled(next.maintenanceEnabled)
    setMaintenanceFee(next.maintenanceFee)
    snapshotRef.current = JSON.stringify(next)
  }, [quote])

  // Kept as a function (not a memoized value) so it always reads the latest
  // state when called from isDirty (every render) and from save() (on demand)
  // - field order here must match the `next` object in the load effect above,
  // since JSON.stringify key order affects the dirty-check string comparison.
  function buildSnapshot() {
    return JSON.stringify({
      items, taxRate, discount, currency, accentColor, contactEmail, contactPhone, dueDate, terms, notes, status,
      toolsPricing, includeToolsRow, depositEnabled, depositPercent, maintenanceEnabled, maintenanceFee,
    })
  }

  const isDirty = buildSnapshot() !== snapshotRef.current
  const goBack = () => router.push('/admin/projects')
  const requestClose = useConfirmClose(isDirty, goBack)
  useRegisterNavigationGuard(isDirty)

  // Tools & equipment pricing, aggregated exactly like the server-side PDF
  // route does: one-time tools fold into the main items subtotal as one
  // generic line, monthly/annual ones surface as recurring-cost lines in the
  // payment schedule - never itemised by tool name on the printed document.
  const oneTimeToolsTotal = includeToolsRow
    ? toolsPricing.filter((t) => t.duration === 'one_time').reduce((s, t) => s + (Number(t.price) || 0), 0)
    : 0
  const recurringMonthlyTotal = includeToolsRow
    ? toolsPricing.filter((t) => t.duration === 'monthly').reduce((s, t) => s + (Number(t.price) || 0), 0)
    : 0
  const recurringAnnualTotal = includeToolsRow
    ? toolsPricing.filter((t) => t.duration === 'annual').reduce((s, t) => s + (Number(t.price) || 0), 0)
    : 0

  const itemsSubtotal = items.reduce((s, it) => s + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0), 0)
  const subtotal = itemsSubtotal + oneTimeToolsTotal
  const discountAmount = Number(discount) || 0
  const afterDiscount = subtotal - discountAmount
  const tax = afterDiscount * (Number(taxRate) / 100 || 0)
  const total = afterDiscount + tax
  const depositAmount = total * (Number(depositPercent) / 100 || 0)
  const balanceAmount = total - depositAmount
  const accent = accentHex(accentColor)
  const money = (n: number) => formatQuoteMoney(n, currency)

  function updateItem(i: number, patch: Partial<LineItem>) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)))
  }

  function updateTool(i: number, patch: Partial<ToolPricing>) {
    setToolsPricing((prev) => prev.map((t, idx) => (idx === i ? { ...t, ...patch } : t)))
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
          discount,
          currency,
          accentColor,
          contactEmail,
          contactPhone,
          dueDate,
          termsAndConditions: terms,
          notes,
          status,
          toolsPricing,
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
      snapshotRef.current = buildSnapshot()
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

  async function handlePreview() {
    setPreviewing(true)
    try {
      if (isDirty && !(await save())) return
      window.open(`/api/admin/projects/${projectId}/quote/pdf?preview=1`, '_blank')
    } finally {
      setPreviewing(false)
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

      {/* The document itself - styled to look like the real quote both on screen and printed */}
      <div className="kf-card rounded-2xl print:rounded-none print:border-none print:shadow-none print:p-0 p-6 md:p-10 max-w-3xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Logos/Kyfaru Logo-08.png"
              alt="Kyfaru"
              style={{ width: 100, height: 100 / LOGO_ASPECT }}
              className="mb-1.5"
            />
            <div className="mt-2 space-y-1 max-w-[200px]">
              <ContactField icon={Mail} type="email" value={contactEmail} onChange={setContactEmail} placeholder="info@kyfaru.com" />
              <ContactField icon={Phone} type="text" value={contactPhone} onChange={setContactPhone} placeholder="+254 705 256 443" />
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-[var(--kf-text)]">QUOTATION</h2>
            {quote && <p className="text-sm text-black mt-1">{quote.quoteNumber}</p>}
          </div>
        </div>

        <div className="h-0.5 mb-8" style={{ backgroundColor: accent }} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-black mb-1">Bill to</p>
            <p className="text-sm font-semibold text-black">{project.client?.name ?? '—'}</p>
            <p className="text-xs text-black">{project.name}</p>
            {project.client?.address && <p className="text-xs text-black">{project.client.address}</p>}
          </div>
          <div className="md:text-right space-y-1.5">
            <MetaRow label="Quote date" value={quote ? new Date(quote.quoteDate).toLocaleDateString('en-GB') : '—'} />
            <div className="flex md:justify-end items-center gap-2">
              <span className="text-xs font-medium text-black shrink-0">Valid until</span>
              <span className="print:inline hidden text-sm text-black">{dueDate ? new Date(dueDate).toLocaleDateString('en-GB') : '—'}</span>
              <span className="print:hidden relative [&_input]:pl-7">
                <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none z-10" />
                <DatePicker value={dueDate} onChange={setDueDate} className="!gap-0" />
              </span>
            </div>
          </div>
        </div>

        {/* Admin-only document configuration - grouped, not scattered */}
        <div className="kf-card rounded-2xl mb-6 print:hidden">
          <p className="text-[10px] uppercase tracking-wide text-zinc-500 font-semibold mb-3">Document settings</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <SelectField label="Status" value={status} onChange={setStatus} options={STATUS_OPTIONS} />
            <SelectField label="Currency" value={currency} onChange={setCurrency} options={CURRENCY_OPTIONS} />
            <SelectField label="Accent color" value={accentColor} onChange={setAccentColor} options={ACCENT_COLOR_OPTIONS} />
          </div>
        </div>

        <table className="w-full mb-6">
          <thead>
            <tr className="text-white text-xs" style={{ backgroundColor: accent }}>
              <th className="text-left font-semibold py-2.5 px-3 w-16 rounded-l-md">QTY</th>
              <th className="text-left font-semibold py-2.5 px-3">Description</th>
              <th className="text-right font-semibold py-2.5 px-3 w-36">Unit price</th>
              <th className="text-right font-semibold py-2.5 px-3 w-36 rounded-r-md">Amount</th>
              <th className="w-8 print:hidden" />
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i} className="border-b border-[var(--kf-border)] text-sm">
                <td className="py-2.5 px-3">
                  <input type="number" min={0} value={it.quantity} onChange={(e) => updateItem(i, { quantity: Number(e.target.value) })} className="w-full bg-transparent print:border-none border-0 focus:ring-1 focus:ring-[var(--kf-green)] rounded" />
                </td>
                <td className="py-2.5 px-3">
                  <input value={it.description} onChange={(e) => updateItem(i, { description: e.target.value })} placeholder="Item description" className="w-full bg-transparent print:border-none border-0 focus:ring-1 focus:ring-[var(--kf-green)] rounded" />
                </td>
                <td className="py-2.5 px-3">
                  <div className="relative print:static">
                    <DollarSign className="print:hidden absolute left-1 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-400 pointer-events-none" />
                    <input type="number" min={0} value={it.unitPrice} onChange={(e) => updateItem(i, { unitPrice: Number(e.target.value) })} className="w-full text-right bg-transparent print:border-none border-0 focus:ring-1 focus:ring-[var(--kf-green)] rounded pl-4 print:pl-0" />
                  </div>
                </td>
                <td className="py-2.5 px-3 text-right font-medium">{money((Number(it.quantity) || 0) * (Number(it.unitPrice) || 0))}</td>
                <td className="print:hidden">
                  <button type="button" onClick={() => setItems((p) => p.filter((_, idx) => idx !== i))} className="p-1 text-zinc-400 hover:text-red-600 transition" aria-label="Remove item">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
            {oneTimeToolsTotal > 0 && (
              <tr className="border-b border-[var(--kf-border)] text-sm">
                <td className="py-2.5 px-3">1</td>
                <td
                  className="py-2.5 px-3"
                  title={`Admin only - ask if you want the breakdown:\n${toolsPricing.filter((t) => t.duration === 'one_time').map((t) => `${t.name} (${money(t.price)})`).join('\n')}`}
                >
                  Tools &amp; Equipment
                </td>
                <td className="py-2.5 px-3 text-right">{money(oneTimeToolsTotal)}</td>
                <td className="py-2.5 px-3 text-right font-medium">{money(oneTimeToolsTotal)}</td>
                <td className="print:hidden" />
              </tr>
            )}
          </tbody>
        </table>

        <div className="print:hidden mb-6">
          <button type="button" onClick={() => setItems((p) => [...p, blankItem()])} className="text-xs text-[var(--kf-green)] hover:underline flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Add line item
          </button>
        </div>

        {/* Admin-only editable pricing for tools/equipment - tool names never
            appear on the exported/printed quote, only here. Always visible
            (not gated on already having entries) so the admin can add rows
            from scratch, not just edit ones seeded from the project's Tools. */}
        <div className="print:hidden mb-6 border border-[var(--kf-border)] rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] uppercase tracking-wide text-black font-semibold">Tools &amp; equipment pricing (internal)</p>
            <ToggleSwitch checked={includeToolsRow} onChange={setIncludeToolsRow}>Include in quote</ToggleSwitch>
          </div>
          {toolsPricing.length === 0 ? (
            <p className="text-xs text-zinc-400">No tools added yet.</p>
          ) : (
            <div className="space-y-2">
              {toolsPricing.map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={t.name}
                    onChange={(e) => updateTool(i, { name: e.target.value })}
                    placeholder="Tool name"
                    className="kf-modal-input h-8 text-xs flex-1"
                  />
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-400 pointer-events-none" />
                    <input
                      type="number"
                      min={0}
                      value={t.price}
                      onChange={(e) => updateTool(i, { price: Number(e.target.value) })}
                      className="kf-modal-input h-8 text-xs w-28 pl-6"
                    />
                  </div>
                  <select
                    value={t.duration}
                    onChange={(e) => updateTool(i, { duration: e.target.value as ToolPricing['duration'] })}
                    className="kf-modal-input h-8 text-xs w-28"
                  >
                    <option value="one_time">One-time</option>
                    <option value="monthly">Monthly</option>
                    <option value="annual">Annual</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => setToolsPricing((p) => p.filter((_, idx) => idx !== i))}
                    className="p-1.5 text-zinc-400 hover:text-red-600 transition"
                    aria-label="Remove tool"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={() => setToolsPricing((p) => [...p, { name: '', price: 0, duration: 'one_time' }])}
            className="text-xs text-[var(--kf-green)] hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add tool
          </button>
          <p className="text-[11px] text-zinc-400">
            Never itemised by name on the exported quote - one-time tools fold into &ldquo;Tools &amp; Equipment&rdquo; above, recurring ones into the payment schedule below.
          </p>
        </div>

        <div className="flex justify-end mb-8">
          <div className="w-full sm:w-64 space-y-1.5 text-sm">
            <div className="flex justify-between text-black">
              <span>Subtotal</span>
              <span>{money(subtotal)}</span>
            </div>
            {/* Editable on screen regardless of value; omitted from print/PDF
                entirely when zero - a discount line with nothing to say. */}
            <div className={cn('flex justify-between items-center text-black', discountAmount === 0 && 'print:hidden')}>
              <span className="flex items-center gap-1.5">
                Discount
                <span className="print:hidden relative inline-flex items-center">
                  <DollarSign className="absolute left-1 w-2.5 h-2.5 text-zinc-400 pointer-events-none" />
                  <input type="number" min={0} value={discount} onChange={(e) => setDiscount(e.target.value)} className="w-20 pl-4 bg-transparent border-0 border-b border-zinc-200 text-xs" />
                </span>
              </span>
              <span>-{money(discountAmount)}</span>
            </div>
            <div className="flex justify-between items-center text-black">
              <span className="flex items-center gap-1.5">
                Tax
                <span className="print:hidden relative inline-flex items-center">
                  <Percent className="absolute left-1 w-2.5 h-2.5 text-zinc-400 pointer-events-none" />
                  <input type="number" min={0} max={100} value={taxRate} onChange={(e) => setTaxRate(e.target.value)} className="w-14 pl-4 bg-transparent border-0 border-b border-zinc-200 text-xs text-center" />
                </span>
                <span className="print:inline hidden">({taxRate}</span>%<span className="print:inline hidden">)</span>
              </span>
              <span>{money(tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-1.5 border-t border-[var(--kf-border)]" style={{ color: accent }}>
              <span>Total</span>
              <span>{money(total)}</span>
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
                (
                <span className="relative inline-flex items-center">
                  <Percent className="absolute left-1 w-2.5 h-2.5 text-zinc-400 pointer-events-none" />
                  <input type="number" min={0} max={100} value={depositPercent} onChange={(e) => setDepositPercent(e.target.value)} className="w-12 pl-4 bg-transparent border-0 border-b border-zinc-200 text-xs text-center" />
                </span>
                %)
                <ToggleSwitch checked={depositEnabled} onChange={setDepositEnabled} />
              </span>
              <span className="print:inline hidden">({depositPercent}%)</span>
            </span>
            {depositEnabled && <span className="font-medium text-black">{money(depositAmount)}</span>}
          </div>
          {depositEnabled && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-black">Balance on delivery</span>
              <span className="font-medium text-black">{money(balanceAmount)}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm pt-2 border-t border-[var(--kf-border)]">
            <span className="flex items-center gap-2 text-black">
              Monthly maintenance (after 30 days free)
              <span className="print:hidden">
                <ToggleSwitch checked={maintenanceEnabled} onChange={setMaintenanceEnabled} />
              </span>
            </span>
            {maintenanceEnabled && (
              <span className="font-medium text-black flex items-center gap-1">
                <span className="print:hidden">{currency}</span>
                <span className="print:hidden relative inline-flex items-center">
                  <DollarSign className="absolute left-1 w-3 h-3 text-zinc-400 pointer-events-none" />
                  <input type="number" min={0} value={maintenanceFee} onChange={(e) => setMaintenanceFee(e.target.value)} className="w-20 pl-4 bg-transparent border-0 border-b border-zinc-200 text-right" />
                </span>
                <span className="print:inline hidden">{money(Number(maintenanceFee))}</span>
                <span>/mo</span>
              </span>
            )}
          </div>
          {recurringMonthlyTotal > 0 && (
            <div className="flex items-center justify-between text-sm pt-2 border-t border-[var(--kf-border)]">
              <span className="text-black">Recurring tool costs</span>
              <span className="font-medium text-black">{money(recurringMonthlyTotal)}/mo</span>
            </div>
          )}
          {recurringAnnualTotal > 0 && (
            <div className="flex items-center justify-between text-sm pt-2 border-t border-[var(--kf-border)]">
              <span className="text-black">Annual tool costs</span>
              <span className="font-medium text-black">{money(recurringAnnualTotal)}/yr</span>
            </div>
          )}
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
        <TextAreaField
          label="Internal notes (not shown on the exported quote)"
          rows={4}
          placeholder="Anything worth remembering about this quote - client questions, negotiation notes, etc."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
    </div>
  )
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex md:justify-end items-center gap-2">
      <span className="text-xs font-medium text-black">{label}</span>
      <span className="text-sm text-black">{value}</span>
    </div>
  )
}

function ContactField({
  icon: Icon,
  type,
  value,
  onChange,
  placeholder,
}: {
  icon: LucideIcon
  type: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="print:hidden w-3 h-3 text-zinc-400 shrink-0" />
      <span className="print:inline hidden text-xs text-black">{value || placeholder}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="print:hidden w-full text-xs text-black bg-transparent border-0 border-b border-transparent focus:border-zinc-300 outline-none transition-colors"
      />
    </div>
  )
}

/** Preline-style toggle switch: a native checkbox + label, styled with the
 * Tailwind peer-checked pattern - gives click-anywhere-on-label toggling and
 * correct baseline alignment with adjacent text for free, unlike a custom
 * <button role="switch">. Pass children for a labelled switch, omit for a
 * bare one used inline next to existing text. */
function ToggleSwitch({
  checked,
  onChange,
  children,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  children?: React.ReactNode
}) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none align-middle">
      <span className="relative inline-flex w-8 h-[18px] shrink-0">
        <input
          type="checkbox"
          role="switch"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span className="absolute inset-0 rounded-full bg-zinc-200 peer-checked:bg-[var(--kf-green)] transition-colors duration-200 pointer-events-none" />
        <span className="absolute top-[2px] left-[2px] w-[14px] h-[14px] bg-white rounded-full shadow transition-transform duration-200 peer-checked:translate-x-[16px] pointer-events-none" />
      </span>
      {children && <span className="text-xs text-zinc-600">{children}</span>}
    </label>
  )
}
