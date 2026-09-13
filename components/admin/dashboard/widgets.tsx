'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ComposedChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { CalendarDays, Flag, Receipt, FolderKanban, Globe } from 'lucide-react'
import { formatMoney, formatDate, formatDateTime } from '@/lib/admin/utils'
import { cn } from '@/lib/utils'
import RecentProjects from './RecentProjects'
import RecentInvoices from './RecentInvoices'
import RecentNotifications from './RecentNotifications'

const PALETTE = ['#0b7350', '#22c55e', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4']
const compactKES = (v: number) => new Intl.NumberFormat('en-KE', { notation: 'compact', style: 'currency', currency: 'KES' }).format(v)

// Preline's structural card idiom (rounded-xl border + shadow-2xs + p-4 md:p-5)
// applied with this app's own --kf-* color tokens instead of Preline's default palette.
function ChartCard({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full rounded-xl border border-[var(--kf-border)] bg-[var(--kf-bg-card)] shadow-2xs p-4 md:p-5">
      <div className="flex items-center justify-between gap-x-2 mb-4">
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

// ── KPIs ── (Preline "stat" card idiom: uppercase eyebrow + large value)
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
        <div key={i.label} className="rounded-xl border border-[var(--kf-border)] bg-[var(--kf-bg-card)] shadow-2xs p-4 md:p-5">
          <p className="text-xs uppercase tracking-wide text-[var(--kf-text-muted)]">{i.label}</p>
          <h3 className={cn('mt-1 text-xl sm:text-2xl font-semibold', i.color)}>{formatMoney(i.value)}</h3>
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
        <select value={range} onChange={(e) => setRange(e.target.value)} className="text-xs border border-[var(--kf-border)] rounded-md px-2 py-1 bg-[var(--kf-bg-card)]">
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

// ── Expenses trend (with range filter) ──
function ExpensesTrendWidget() {
  const [range, setRange] = useState('6m')
  const { data } = useQuery({
    queryKey: ['expenses-chart', range],
    queryFn: async () => (await fetch(`/api/admin/finance/expenses-chart?range=${range}`)).json(),
    staleTime: 2 * 60 * 1000,
  })
  const rows = data?.data ?? []
  return (
    <ChartCard
      title="Expenses"
      action={
        <select value={range} onChange={(e) => setRange(e.target.value)} className="text-xs border border-[var(--kf-border)] rounded-md px-2 py-1 bg-[var(--kf-bg-card)]">
          {RANGES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
      }
    >
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={rows} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={compactKES} />
          <Tooltip formatter={(v: number | string) => formatMoney(Number(v))} />
          <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} fill="url(#exp)" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

// ── Profit & loss (revenue + expenses + profit line, with margin %) ──
function ProfitLossWidget() {
  const [range, setRange] = useState('6m')
  const { data } = useQuery({
    queryKey: ['pnl-chart', range],
    queryFn: async () => (await fetch(`/api/admin/finance/pnl-chart?range=${range}`)).json(),
    staleTime: 2 * 60 * 1000,
  })
  const rows: { month: string; revenue: number; expense: number; profit: number; margin: number }[] = data?.data ?? []
  const totalRevenue = rows.reduce((s, r) => s + r.revenue, 0)
  const totalProfit = rows.reduce((s, r) => s + r.profit, 0)
  const overallMargin = totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 1000) / 10 : 0

  return (
    <ChartCard
      title="Profit & loss"
      action={
        <div className="flex items-center gap-3">
          <span className={cn('text-xs font-semibold', overallMargin >= 0 ? 'text-emerald-600' : 'text-red-600')}>
            {overallMargin.toFixed(1)}% margin
          </span>
          <select value={range} onChange={(e) => setRange(e.target.value)} className="text-xs border border-[var(--kf-border)] rounded-md px-2 py-1 bg-[var(--kf-bg-card)]">
            {RANGES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
      }
    >
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={rows} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={compactKES} />
          <Tooltip
            formatter={(v: number | string, name: string) =>
              name === 'margin' ? [`${Number(v).toFixed(1)}%`, 'Margin'] : [formatMoney(Number(v)), name[0].toUpperCase() + name.slice(1)]
            }
          />
          <Bar dataKey="revenue" fill="#0b7350" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
          <Line type="monotone" dataKey="profit" stroke="#f59e0b" strokeWidth={2} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

// ── New customers (clients created per bucket) ──
function NewCustomersWidget() {
  const { data } = useQuery({
    queryKey: ['new-customers'],
    queryFn: async () => (await fetch('/api/admin/dashboard/new-customers?range=6m')).json(),
    staleTime: 2 * 60 * 1000,
  })
  const rows = data?.data ?? []
  return (
    <ChartCard title="New customers">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={rows} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

// ── Active team members ──
function ActiveMembersWidget() {
  const { data } = useQuery({
    queryKey: ['active-members'],
    queryFn: async () => (await fetch('/api/admin/dashboard/active-members')).json(),
    staleTime: 5 * 60 * 1000,
  })
  const total = data?.total ?? 0
  const byRole: { role: string; count: number }[] = data?.byRole ?? []
  return (
    <ChartCard title="Active team members">
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-2xl sm:text-3xl font-bold text-[var(--kf-text)]" style={{ fontFamily: 'var(--kf-font-display)' }}>{total}</span>
        <span className="text-xs text-[var(--kf-text-muted)]">active</span>
      </div>
      {byRole.length === 0 ? (
        <p className="text-sm text-[var(--kf-text-muted)]">No active members.</p>
      ) : (
        <div className="space-y-2">
          {byRole.map((r) => (
            <div key={r.role} className="flex items-center justify-between text-sm">
              <span className="text-[var(--kf-text-muted)] capitalize">{r.role.replace(/_/g, ' ')}</span>
              <span className="font-medium text-[var(--kf-text)]">{r.count}</span>
            </div>
          ))}
        </div>
      )}
    </ChartCard>
  )
}

// ── Upcoming deadlines (projects, milestones, invoices, calendar) ──
const DEADLINE_ICONS: Record<string, typeof CalendarDays> = {
  project_end: FolderKanban,
  milestone: Flag,
  invoice_due: Receipt,
  calendar: CalendarDays,
}
const DEADLINE_LABELS: Record<string, string> = {
  project_end: 'Project',
  milestone: 'Milestone',
  invoice_due: 'Invoice',
  calendar: 'Event',
}
function UpcomingDeadlinesWidget() {
  const { data } = useQuery({
    queryKey: ['upcoming-deadlines'],
    queryFn: async () => (await fetch('/api/admin/dashboard/upcoming-deadlines')).json(),
    staleTime: 2 * 60 * 1000,
  })
  const rows: { type: string; label: string; date: string; entityId: string }[] = data?.data ?? []
  return (
    <ChartCard title="Upcoming deadlines">
      {rows.length === 0 ? (
        <p className="text-sm text-[var(--kf-text-muted)]">Nothing due in the next 60 days.</p>
      ) : (
        <div className="space-y-3 max-h-72 overflow-y-auto">
          {rows.map((d, i) => {
            const Icon = DEADLINE_ICONS[d.type] ?? CalendarDays
            return (
              <div key={`${d.type}-${d.entityId}-${i}`} className="flex gap-3 items-start">
                <div className="p-1.5 bg-[var(--kf-green)]/10 rounded-lg shrink-0">
                  <Icon className="w-4 h-4 text-[var(--kf-green)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{d.label}</div>
                  <div className="text-xs text-[var(--kf-text-muted)]">{DEADLINE_LABELS[d.type] ?? d.type} · {formatDate(d.date)}</div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </ChartCard>
  )
}

// ── Website notifications (contact/quote form submissions) ──
function WebsiteNotificationsWidget() {
  const { data } = useQuery({
    queryKey: ['website-notifications'],
    queryFn: async () => (await fetch('/api/admin/dashboard/website-notifications')).json(),
    staleTime: 60 * 1000,
  })
  const rows: { id: string; title: string; body: string; createdAt: string }[] = data?.data ?? []
  return (
    <ChartCard title="Website enquiries">
      {rows.length === 0 ? (
        <p className="text-sm text-[var(--kf-text-muted)]">No website enquiries yet.</p>
      ) : (
        <div className="space-y-3 max-h-72 overflow-y-auto">
          {rows.map((n) => (
            <div key={n.id} className="flex items-start gap-3">
              <div className="p-1.5 bg-[var(--kf-green)]/10 rounded-lg shrink-0">
                <Globe className="w-4 h-4 text-[var(--kf-green)]" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{n.title}</div>
                <div className="text-xs text-[var(--kf-text-muted)] line-clamp-2">{n.body}</div>
                <div className="text-[11px] text-[var(--kf-text-faint)] mt-0.5">{formatDateTime(n.createdAt)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </ChartCard>
  )
}

// ── Website analytics (PostHog-backed; graceful empty state when not configured) ──
function AnalyticsClicksWidget() {
  const { data, isLoading } = useQuery({
    queryKey: ['posthog-summary'],
    queryFn: async () => (await fetch('/api/admin/analytics/posthog-summary')).json(),
    staleTime: 5 * 60 * 1000,
  })

  if (!isLoading && !data?.configured) {
    return (
      <ChartCard title="Website analytics">
        <div className="h-48 flex flex-col items-center justify-center text-center gap-1 px-4">
          <p className="text-sm font-medium text-[var(--kf-text)]">Connect PostHog to see analytics</p>
          <p className="text-xs text-[var(--kf-text-muted)]">Set POSTHOG_PERSONAL_API_KEY, POSTHOG_PROJECT_ID and POSTHOG_HOST to enable this widget.</p>
        </div>
      </ChartCard>
    )
  }

  const rows = (data?.data ?? []).map((d: { date: string; count: number }) => ({ date: d.date.slice(5), count: d.count }))
  return (
    <ChartCard title="Website analytics" action={<span className="text-xs text-[var(--kf-text-muted)]">{data?.total ?? 0} pageviews · 30d</span>}>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={rows} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="clicks" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip />
          <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} fill="url(#clicks)" />
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

// ── Opt-in widgets (available via "Add section", not in the default layout) ──
function RecentProjectsWidget() {
  const { data } = useQuery({
    queryKey: ['recent-projects'],
    queryFn: async () => (await fetch('/api/admin/projects?pageSize=6')).json(),
    staleTime: 2 * 60 * 1000,
  })
  return <RecentProjects projects={data?.projects ?? []} />
}

function RecentInvoicesWidget() {
  const { data } = useQuery({
    queryKey: ['recent-invoices'],
    queryFn: async () => (await fetch('/api/admin/invoices?pageSize=6')).json(),
    staleTime: 2 * 60 * 1000,
  })
  return <RecentInvoices invoices={data?.invoices ?? []} />
}

function RecentNotificationsWidget() {
  const { data } = useQuery({
    queryKey: ['recent-notifications'],
    queryFn: async () => (await fetch('/api/admin/dashboard/website-notifications')).json(),
    staleTime: 60 * 1000,
  })
  return <RecentNotifications notifications={data?.data ?? []} />
}

export interface WidgetDef {
  title: string
  defaultSize: 'full' | 'half'
  Component: React.ComponentType
}

export const WIDGETS: Record<string, WidgetDef> = {
  kpis: { title: 'Finance KPIs', defaultSize: 'full', Component: KpisWidget },
  revenue: { title: 'Revenue', defaultSize: 'full', Component: RevenueWidget },
  'profit-loss': { title: 'Profit & loss', defaultSize: 'full', Component: ProfitLossWidget },
  'expenses-trend': { title: 'Expenses', defaultSize: 'half', Component: ExpensesTrendWidget },
  'new-customers': { title: 'New customers', defaultSize: 'half', Component: NewCustomersWidget },
  'active-members': { title: 'Active team members', defaultSize: 'half', Component: ActiveMembersWidget },
  'upcoming-deadlines': { title: 'Upcoming deadlines', defaultSize: 'half', Component: UpcomingDeadlinesWidget },
  'website-notifications': { title: 'Website enquiries', defaultSize: 'half', Component: WebsiteNotificationsWidget },
  'analytics-clicks': { title: 'Website analytics', defaultSize: 'half', Component: AnalyticsClicksWidget },
  'invoices-status': { title: 'Invoices by status', defaultSize: 'half', Component: InvoicesStatusWidget },
  'expenses-category': { title: 'Expenses by category', defaultSize: 'half', Component: ExpensesCategoryWidget },
  'projects-status': { title: 'Projects by status', defaultSize: 'half', Component: ProjectsStatusWidget },
  'recent-projects': { title: 'Recent projects', defaultSize: 'half', Component: RecentProjectsWidget },
  'recent-invoices': { title: 'Recent invoices', defaultSize: 'half', Component: RecentInvoicesWidget },
  'recent-notifications': { title: 'Recent notifications', defaultSize: 'half', Component: RecentNotificationsWidget },
}
