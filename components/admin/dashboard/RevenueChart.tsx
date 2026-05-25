'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { useEffect, useState } from 'react'

type Datum = { month: string; revenue: number }

export default function RevenueChart() {
  const [data, setData] = useState<Datum[]>([])

  useEffect(() => {
    fetch('/api/admin/finance/revenue-chart')
      .then((r) => r.json())
      .then((d) => setData(d?.data ?? []))
      .catch(() => null)
  }, [])

  return (
    <div className="kf-card rounded-2xl">
      <h2 className="font-semibold text-[var(--kf-text)] mb-4">
        Revenue (Last 6 months)
      </h2>
      {data.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-sm text-[var(--kf-text-muted)]">
          Loading…
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) =>
                new Intl.NumberFormat('en-KE', {
                  notation: 'compact',
                  style: 'currency',
                  currency: 'KES',
                }).format(v)
              }
            />
            <Tooltip
              formatter={(v: number | string) =>
                new Intl.NumberFormat('en-KE', {
                  style: 'currency',
                  currency: 'KES',
                }).format(Number(v))
              }
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#revGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
