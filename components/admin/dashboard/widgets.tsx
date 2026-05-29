'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { formatMoney } from '@/lib/admin/utils'
import { cn } from '@/lib/utils'

const PALETTE = ['#0b7350', '#22c55e', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4']
const compactKES = (v: number) => new Intl.NumberFormat('en-KE', { notation: 'compact', style: 'currency', currency: 'KES' }).format(v)

function ChartCard({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="kf-card rounded-2xl h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-[var(--kf-text)] text-sm">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  )
}

function useSummary() {
  return useQuery({
    queryKey: ['finance-summary'],
    queryFn: async () => (await fetch('/api/admin/finance/summary')).json(),
    staleTime: 2 * 60 * 1000,
  })
}

// ── KPIs ──
function KpisWidget() {
  const { data } = useSummary()
  const k = data?.kpis ?? { revenue: 0, expense: 0, profit: 0, outstanding: 0 }
  const items = [
    { label: 'Revenue', value: k.revenue, color: 'text-emerald-600' },
    { label: 'Expenses', value: k.expense, color: 'text-red-600' },
    { label: 'Profit', value: k.profit, color: 'text-[var(--kf-green)]' },
    { label: 'Outstanding', value: k.outstanding, color: 'text-amber-600' },
  ]
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((i) => (
        <div key={i.label} className="kf-card rounded-2xl">
          <div className="text-xs text-[var(--kf-text-muted)]">{i.label}</div>
          <div className={cn('text-xl font-semibold mt-1', i.color)}>{formatMoney(i.value)}</div>
        </div>
      ))}
    </div>
  )
}

// ── Revenue (with range filter) ──
const RANGES = [
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: '90d', label: '90 days' },
  { value: '6m', label: '6 months' },
]
function RevenueWidget() {
  const [range, setRange] = useState('6m')
  const { data } = useQuery({
    queryKey: ['revenue-chart', range],
    queryFn: async () => (await fetch(`/api/admin/finance/revenue-chart?range=${range}`)).json(),
    staleTime: 2 * 60 * 1000,
  })
  const rows = data?.data ?? []
  return (
    <ChartCard
      title="Revenue"
      action={
        <select value={range} onChange={(e) => setRange(e.target.value)} className="text-xs border border-zinc-200 rounded-md px-2 py-1">
          {RANGES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
      }
    >
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={rows} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0b7350" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#0b7350" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={compactKES} />
          <Tooltip formatter={(v: number | string) => formatMoney(Number(v))} />
          <Area type="monotone" dataKey="revenue" stroke="#0b7350" strokeWidth={2} fill="url(#rev)" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

// ── Invoices by status (pie) ──
function InvoicesStatusWidget() {
  const { data } = useSummary()
  const rows = (data?.invoiceByStatus ?? []).map((r: { status: string; total: number }) => ({ name: r.status, value: r.total }))
  return (
    <ChartCard title="Invoices by status">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={rows} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={2}>
            {rows.map((_: unknown, i: number) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
          </Pie>
          <Tooltip formatter={(v: number | string) => formatMoney(Number(v))} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

// ── Expenses by category (pie) ──
function ExpensesCategoryWidget() {
  const { data } = useSummary()
  const rows = (data?.expenseByCategory ?? []).map((r: { category: string; total: number }) => ({ name: r.category, value: r.total }))
  return (
    <ChartCard title="Expenses by category">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={rows} dataKey="value" nameKey="name" outerRadius={80} paddingAngle={2}>
            {rows.map((_: unknown, i: number) => <Cell key={i} fill={PALETTE[(i + 3) % PALETTE.length]} />)}
          </Pie>
          <Tooltip formatter={(v: number | string) => formatMoney(Number(v))} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

// ── Projects by status (bar) ──
function ProjectsStatusWidget() {
  const { data } = useSummary()
  const rows = (data?.projectByStatus ?? []).map((r: { status: string; count: number }) => ({ name: r.status.replace('_', ' '), count: r.count }))
  return (
    <ChartCard title="Projects by status">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={rows} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#0b7350" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

export interface WidgetDef {
  title: string
  defaultSize: 'full' | 'half'
  Component: React.ComponentType
}

export const WIDGETS: Record<string, WidgetDef> = {
  kpis: { title: 'Finance KPIs', defaultSize: 'full', Component: KpisWidget },
  revenue: { title: 'Revenue', defaultSize: 'full', Component: RevenueWidget },
  'invoices-status': { title: 'Invoices by status', defaultSize: 'half', Component: InvoicesStatusWidget },
  'expenses-category': { title: 'Expenses by category', defaultSize: 'half', Component: ExpensesCategoryWidget },
  'projects-status': { title: 'Projects by status', defaultSize: 'half', Component: ProjectsStatusWidget },
}
