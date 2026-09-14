import type { ToolPricing } from './quote-pdf'

export interface QuoteTotalsInput {
  lineItems: { quantity: number; unitPrice: number }[] | null
  toolsPricing: ToolPricing[] | null
  includeToolsRow: boolean
  discount: number | string | null
  taxRate: number | string | null
}

/** Same subtotal -> discount -> tax -> total math as quote-pdf.ts and
 * QuoteEditor.tsx, kept here just for the quotes-list "Amount" column so
 * that route doesn't need to re-derive a PDF or render the full editor. */
export function computeQuoteTotal(q: QuoteTotalsInput): number {
  const itemsSubtotal = (q.lineItems ?? []).reduce((s, it) => s + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0), 0)
  const oneTimeTools = q.includeToolsRow
    ? (q.toolsPricing ?? []).filter((t) => t.duration === 'one_time').reduce((s, t) => s + (Number(t.price) || 0), 0)
    : 0
  const subtotal = itemsSubtotal + oneTimeTools
  const afterDiscount = subtotal - (Number(q.discount) || 0)
  const tax = afterDiscount * ((Number(q.taxRate) || 0) / 100)
  return afterDiscount + tax
}
