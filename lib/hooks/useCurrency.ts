'use client'

// ============================================================
// useCurrency — timezone-based currency detection
//
// Reads the browser's IANA timezone via Intl, maps it to a
// regional currency, and returns formatting helpers.
// No API key required. Rates are approximate static values.
// ============================================================

import { useState, useEffect } from 'react'

export type CurrencyCode = 'KES' | 'TZS' | 'UGX' | 'NGN' | 'ZAR' | 'USD'

export interface CurrencyInfo {
  code: CurrencyCode
  symbol: string
  /** Full currency name used in the disclaimer note */
  name: string
  /** How many units of this currency equal 1 KES (approx.) */
  rate: number
  locale: string
}

// ── Static exchange rates (1 KES → X currency) ──────────────
const CURRENCY_INFO: Record<CurrencyCode, CurrencyInfo> = {
  KES: { code: 'KES', symbol: 'KES', name: 'Kenyan Shillings',    rate: 1,      locale: 'en-KE' },
  TZS: { code: 'TZS', symbol: 'TZS', name: 'Tanzanian Shillings', rate: 25.5,   locale: 'sw-TZ' },
  UGX: { code: 'UGX', symbol: 'UGX', name: 'Ugandan Shillings',   rate: 28.5,   locale: 'en-UG' },
  NGN: { code: 'NGN', symbol: '₦',   name: 'Nigerian Naira',      rate: 12.0,   locale: 'en-NG' },
  ZAR: { code: 'ZAR', symbol: 'R',   name: 'South African Rand',  rate: 0.14,   locale: 'en-ZA' },
  USD: { code: 'USD', symbol: '$',   name: 'US Dollars',          rate: 0.0077, locale: 'en-US' },
}

// ── Timezone → currency code ─────────────────────────────────
const TZ_CURRENCY: Record<string, CurrencyCode> = {
  'Africa/Nairobi':        'KES',
  'Africa/Dar_es_Salaam':  'TZS',
  'Africa/Dodoma':         'TZS',
  'Africa/Kampala':        'UGX',
  'Africa/Lagos':          'NGN',
  'Africa/Abuja':          'NGN',
  'Africa/Johannesburg':   'ZAR',
  'Africa/Cape_Town':      'ZAR',
  'Africa/Harare':         'ZAR',
}

function detectCurrencyCode(): CurrencyCode {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (TZ_CURRENCY[tz]) return TZ_CURRENCY[tz]
    // Any unmapped African timezone → KES (closest East-African default)
    if (tz.startsWith('Africa/')) return 'KES'
    // Everything else (Europe, Americas, Asia, Pacific) → USD
    return 'USD'
  } catch {
    return 'KES'
  }
}

/**
 * Converts a KES base amount to the active currency and formats it.
 * Pass `compact: true` for abbreviated labels like "$1.2K".
 */
export function formatPrice(
  kesAmount: number,
  currency: CurrencyInfo,
  compact = false,
): string {
  const converted = Math.round(kesAmount * currency.rate)
  const fmt = new Intl.NumberFormat(currency.locale, {
    maximumFractionDigits: 0,
    notation: compact ? 'compact' : 'standard',
    compactDisplay: 'short',
  })
  return `${currency.symbol} ${fmt.format(converted)}`
}

/**
 * React hook — returns the detected CurrencyInfo.
 * Defaults to KES on the server (SSR-safe) then updates on the client.
 */
export function useCurrency(): CurrencyInfo {
  const [currency, setCurrency] = useState<CurrencyInfo>(CURRENCY_INFO.KES)

  useEffect(() => {
    const code = detectCurrencyCode()
    setCurrency(CURRENCY_INFO[code])
  }, [])

  return currency
}
