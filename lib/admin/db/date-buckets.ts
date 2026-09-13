// ============================================================
// Shared day/month bucketing for time-series finance & dashboard charts.
// Supports ?range=7d|30d|90d|6m or ?from&to - buckets by day for short
// ranges, by month for long ones. Used by revenue-chart, expenses-chart,
// pnl-chart and new-customers routes.
// ============================================================

export interface DateRangeParams {
  range?: string | null
  from?: string | null
  to?: string | null
}

export interface DateRange {
  from: Date
  to: Date
  byMonth: boolean
}

export function resolveDateRange({ range = '6m', from: fromParam, to: toParam }: DateRangeParams): DateRange {
  let from = new Date()
  let to = new Date()
  let byMonth = false

  if (fromParam && toParam) {
    from = new Date(fromParam)
    to = new Date(toParam)
    byMonth = (to.getTime() - from.getTime()) / 86400000 > 92
  } else if (range === '7d') {
    from.setDate(from.getDate() - 6)
  } else if (range === '30d') {
    from.setDate(from.getDate() - 29)
  } else if (range === '90d') {
    from.setDate(from.getDate() - 89)
  } else {
    from.setMonth(from.getMonth() - 5)
    from.setDate(1)
    byMonth = true
  }
  from.setHours(0, 0, 0, 0)
  to.setHours(23, 59, 59, 999)

  return { from, to, byMonth }
}

// Raw SQL fragments for a `to_char(column, fmt)` label + matching `date_trunc`
// grouping/ordering key. `column` is a trusted, hardcoded identifier (never
// user input) so string interpolation into the raw SQL is safe here.
export function bucketSqlParts(column: string, byMonth: boolean) {
  const fmt = byMonth ? `'Mon YY'` : `'DD Mon'`
  const trunc = byMonth ? `date_trunc('month', ${column})` : `date_trunc('day', ${column})`
  return { fmt, trunc }
}

// Full list of bucket labels across the range, in chronological order - used
// to zero-fill and align two independently-grouped queries (e.g. revenue and
// expenses) onto the same x-axis for the P&L chart.
export function enumerateBucketLabels(from: Date, to: Date, byMonth: boolean): string[] {
  const labels: string[] = []
  if (byMonth) {
    const cursor = new Date(from.getFullYear(), from.getMonth(), 1)
    const end = new Date(to.getFullYear(), to.getMonth(), 1)
    while (cursor <= end) {
      const mon = cursor.toLocaleDateString('en-US', { month: 'short' })
      const yy = String(cursor.getFullYear()).slice(-2)
      labels.push(`${mon} ${yy}`)
      cursor.setMonth(cursor.getMonth() + 1)
    }
  } else {
    const cursor = new Date(from.getFullYear(), from.getMonth(), from.getDate())
    const end = new Date(to.getFullYear(), to.getMonth(), to.getDate())
    while (cursor <= end) {
      const day = String(cursor.getDate()).padStart(2, '0')
      const mon = cursor.toLocaleDateString('en-US', { month: 'short' })
      labels.push(`${day} ${mon}`)
      cursor.setDate(cursor.getDate() + 1)
    }
  }
  return labels
}
