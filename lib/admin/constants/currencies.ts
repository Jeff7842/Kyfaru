export const CURRENCIES = {
  KES: { label: 'KES - Kenyan Shilling', symbol: 'KES' },
  USD: { label: 'USD - US Dollar', symbol: '$' },
  EUR: { label: 'EUR - Euro', symbol: '€' },
  GBP: { label: 'GBP - British Pound', symbol: '£' },
} as const

export type CurrencyCode = keyof typeof CURRENCIES

export const CURRENCY_OPTIONS = (Object.keys(CURRENCIES) as CurrencyCode[]).map((value) => ({
  value,
  label: CURRENCIES[value].label,
}))

export function formatQuoteMoney(n: number, currency: string): string {
  const symbol = CURRENCIES[currency as CurrencyCode]?.symbol ?? currency
  return `${symbol} ${n.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
