'use client'

// ============================================================
// RETAINER PRICE
// Detects visitor's region via browser timezone and shows
// the monthly maintenance retainer fee in local currency.
// No API key or network request — instant via Intl API.
// ============================================================

import { useEffect, useState } from 'react'

interface RegionPrice {
  amount: string
  currency: string
  note?: string
}

// Timezone prefix → regional price. Sorted most-specific first.
const TIMEZONE_PRICES: Array<{ prefix: string | string[]; price: RegionPrice }> = [
  // ── Kenya ────────────────────────────────────────────────
  { prefix: 'Africa/Nairobi',      price: { amount: 'KES 6,000', currency: 'KES' } },

  // ── East Africa ──────────────────────────────────────────
  { prefix: 'Africa/Dar_es_Salaam', price: { amount: 'TZS 115,000', currency: 'TZS' } },
  { prefix: 'Africa/Kampala',       price: { amount: 'UGX 165,000', currency: 'UGX' } },
  { prefix: 'Africa/Kigali',        price: { amount: 'RWF 55,000',  currency: 'RWF' } },
  { prefix: 'Africa/Addis_Ababa',   price: { amount: 'ETB 2,600',   currency: 'ETB' } },

  // ── Southern Africa ───────────────────────────────────────
  { prefix: 'Africa/Johannesburg',  price: { amount: 'ZAR 840',     currency: 'ZAR' } },
  { prefix: 'Africa/Harare',        price: { amount: 'USD 45',       currency: 'USD', note: 'Zimbabwe (USD)' } },
  { prefix: 'Africa/Lusaka',        price: { amount: 'ZMW 1,200',   currency: 'ZMW' } },

  // ── West Africa ───────────────────────────────────────────
  { prefix: 'Africa/Lagos',         price: { amount: '₦72,000',     currency: 'NGN' } },
  { prefix: 'Africa/Accra',         price: { amount: 'GHS 700',      currency: 'GHS' } },

  // ── North Africa ─────────────────────────────────────────
  { prefix: ['Africa/Cairo', 'Africa/Tripoli', 'Africa/Tunis', 'Africa/Algiers', 'Africa/Casablanca'],
    price: { amount: 'USD 45', currency: 'USD' } },

  // ── UK ───────────────────────────────────────────────────
  { prefix: 'Europe/London',        price: { amount: '£36',          currency: 'GBP' } },

  // ── Eurozone ─────────────────────────────────────────────
  { prefix: 'Europe/',              price: { amount: '€42',          currency: 'EUR' } },

  // ── North America ────────────────────────────────────────
  { prefix: ['America/New_York', 'America/Chicago', 'America/Denver',
             'America/Los_Angeles', 'America/Phoenix', 'America/Anchorage',
             'America/Honolulu', 'Pacific/Honolulu'],
    price: { amount: 'USD 45', currency: 'USD' } },
  { prefix: 'America/Toronto',      price: { amount: 'CAD 62',       currency: 'CAD' } },
  { prefix: ['America/Vancouver', 'America/Edmonton', 'America/Winnipeg',
             'America/Halifax', 'America/St_Johns'],
    price: { amount: 'CAD 62', currency: 'CAD' } },

  // ── Middle East ───────────────────────────────────────────
  { prefix: 'Asia/Dubai',           price: { amount: 'AED 165',      currency: 'AED' } },
  { prefix: 'Asia/Riyadh',          price: { amount: 'SAR 168',      currency: 'SAR' } },
  { prefix: 'Asia/Kuwait',          price: { amount: 'KWD 14',       currency: 'KWD' } },

  // ── Asia-Pacific ─────────────────────────────────────────
  { prefix: 'Australia/',           price: { amount: 'AUD 72',       currency: 'AUD' } },
  { prefix: ['Pacific/Auckland', 'Pacific/Chatham'],
    price: { amount: 'NZD 78', currency: 'NZD' } },
  { prefix: 'Asia/Singapore',       price: { amount: 'SGD 62',       currency: 'SGD' } },
  { prefix: 'Asia/Kolkata',         price: { amount: '₹3,800',       currency: 'INR' } },

  // ── Rest of world (fallback) ──────────────────────────────
  { prefix: '',                     price: { amount: 'USD 45',        currency: 'USD', note: 'Billed in USD' } },
]

function detectPrice(): RegionPrice {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? ''

    for (const entry of TIMEZONE_PRICES) {
      const prefixes = Array.isArray(entry.prefix) ? entry.prefix : [entry.prefix]
      for (const prefix of prefixes) {
        if (prefix === '' || tz === prefix || (prefix.endsWith('/') && tz.startsWith(prefix))) {
          return entry.price
        }
      }
    }
  } catch {
    // Intl not available — return fallback
  }
  return { amount: 'USD 45', currency: 'USD' }
}

export default function RetainerPrice() {
  const [price, setPrice] = useState<RegionPrice | null>(null)

  useEffect(() => {
    setPrice(detectPrice())
  }, [])

  if (!price) {
    // Skeleton while hydrating
    return (
      <span className="inline-block h-7 w-40 rounded bg-ky-raised animate-pulse" />
    )
  }

  return (
    <span className="inline-flex flex-col items-end gap-0.5">
      <span className="text-xl font-display font-bold text-ky-gold">
        {price.amount} <span className="text-sm font-normal text-ky-faint">/ month</span>
      </span>
      {price.note && (
        <span className="text-[11px] text-ky-faint font-inter">{price.note}</span>
      )}
    </span>
  )
}
