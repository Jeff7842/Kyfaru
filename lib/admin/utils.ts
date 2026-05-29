// ============================================================
// Shared utilities for the admin dashboard.
// ============================================================

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Money ────────────────────────────────────────────────
export function formatMoney(
  amount: number | string | null | undefined,
  currency = 'KES',
): string {
  const n = Number(amount ?? 0)
  if (!Number.isFinite(n)) return `${currency} 0`
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(n)
}

export function formatNumber(n: number | null | undefined): string {
  return new Intl.NumberFormat('en-KE').format(Number(n ?? 0))
}

// ─── Project / Invoice code generators ────────────────────
export function makeProjectCode(year: number, sequence: number) {
  return `KYF-${year}-${String(sequence).padStart(3, '0')}`
}

export function makeInvoiceCode(year: number, sequence: number) {
  return `INV-${year}-${String(sequence).padStart(4, '0')}`
}

// ─── Date ─────────────────────────────────────────────────
// Day-first ordering (e.g. "28 May 2026") per Kenyan convention.
export function formatDate(d: Date | string | null | undefined): string {
  if (!d) return '—'
  const date = typeof d === 'string' ? new Date(d) : d
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// Includes the weekday — used in documents and detailed tables (e.g. "Thu, 28 May 2026").
export function formatDateLong(d: Date | string | null | undefined): string {
  if (!d) return '—'
  const date = typeof d === 'string' ? new Date(d) : d
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatDateTime(d: Date | string | null | undefined): string {
  if (!d) return '—'
  const date = typeof d === 'string' ? new Date(d) : d
  return date.toLocaleString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function daysBetween(a: Date, b: Date): number {
  return Math.floor((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24))
}

export function isOverdue(dueDate: Date | string | null | undefined): boolean {
  if (!dueDate) return false
  const d = typeof dueDate === 'string' ? new Date(dueDate) : dueDate
  return d.getTime() < Date.now()
}

// ─── Strings ──────────────────────────────────────────────
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]!.toUpperCase())
    .join('')
}

export function truncate(s: string, n = 80) {
  return s.length > n ? s.slice(0, n - 1) + '…' : s
}
