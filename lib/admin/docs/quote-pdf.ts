import { PDFDocument, rgb } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { getKyfaruLogoBytes, LOGO_ASPECT } from './docx-helpers'
import { accentHex, hexToRgbFraction } from '@/lib/admin/constants/quote-colors'
import { formatQuoteMoney } from '@/lib/admin/constants/currencies'

export interface QuoteLineItem {
  description: string
  quantity: number
  unitPrice: number
}

export interface ToolPricing {
  name: string
  price: number
  duration: 'monthly' | 'one_time' | 'annual'
}

export interface QuoteDocData {
  quoteNumber: string // e.g. "QT-00001"
  quoteDate: string // formatted, e.g. "14 Sep 2026"
  dueDate?: string
  clientName?: string
  clientAddress?: string
  projectTitle?: string
  items: QuoteLineItem[]
  taxRate: number // percentage, e.g. 16
  discount?: number // flat amount, applied after subtotal and before tax - omitted from the PDF entirely when 0
  currency: string // e.g. "KES", "USD"
  accentColor?: string // key into lib/admin/constants/quote-colors.ts
  contactEmail?: string
  contactPhone?: string
  depositEnabled?: boolean
  depositPercent?: number
  maintenanceEnabled?: boolean
  maintenanceFee?: number
  // Recurring tool costs (monthly/annual duration) - summed, never itemised
  // by tool name on this client-facing document, same reasoning as the
  // one-time "Tools & Equipment" line already folded into `items`.
  recurringMonthly?: number
  recurringAnnual?: number
  termsAndConditions?: string
  notes?: string
}

// Built as plain strings (not require.resolve/import) so Next.js's bundler
// doesn't try to trace and bundle the .woff files as a module dependency -
// same reasoning as invoice-pdf.ts.
const fontsourceFile = (pkg: string, file: string) =>
  path.join(process.cwd(), 'node_modules', '@fontsource', pkg, 'files', file)
const ROBOTO_REGULAR = fontsourceFile('roboto', 'roboto-latin-400-normal.woff')
const ROBOTO_BOLD = fontsourceFile('roboto', 'roboto-latin-700-normal.woff')
const MONO_REGULAR = fontsourceFile('roboto-mono', 'roboto-mono-latin-400-normal.woff')
const MONO_BOLD = fontsourceFile('roboto-mono', 'roboto-mono-latin-700-normal.woff')

const W = 595.28
const H = 841.89
const MARGIN = 48
const INK = rgb(0, 0, 0)
const MUTED = rgb(0.2, 0.2, 0.2)
const LINE = rgb(0.87, 0.88, 0.89)

/** Draws a fully Kyfaru-branded quote PDF from scratch (no template artwork). */
export async function buildQuotePdf(data: QuoteDocData): Promise<Uint8Array> {
  const [logoBytes, robotoBytes, robotoBoldBytes, monoBytes, monoBoldBytes] = await Promise.all([
    getKyfaruLogoBytes(),
    readFile(ROBOTO_REGULAR),
    readFile(ROBOTO_BOLD),
    readFile(MONO_REGULAR),
    readFile(MONO_BOLD),
  ])

  const pdf = await PDFDocument.create()
  pdf.registerFontkit(fontkit)
  const logo = await pdf.embedPng(logoBytes)
  const roboto = await pdf.embedFont(robotoBytes, { subset: true })
  const robotoBold = await pdf.embedFont(robotoBoldBytes, { subset: true })
  const mono = await pdf.embedFont(monoBytes, { subset: true })
  const monoBold = await pdf.embedFont(monoBoldBytes, { subset: true })

  const money = (n: number) => formatQuoteMoney(n, data.currency)
  const [ar, ag, ab] = hexToRgbFraction(accentHex(data.accentColor))
  const ACCENT = rgb(ar, ag, ab)

  let page = pdf.addPage([W, H])
  let y = H - MARGIN

  const text = (
    str: string,
    x: number,
    yPos: number,
    opts: { size?: number; bold?: boolean; mono?: boolean; color?: typeof INK; align?: 'left' | 'right' } = {},
  ) => {
    const size = opts.size ?? 9.5
    const font = opts.mono ? (opts.bold ? monoBold : mono) : opts.bold ? robotoBold : roboto
    const width = font.widthOfTextAtSize(str, size)
    const drawX = opts.align === 'right' ? x - width : x
    page.drawText(str, { x: drawX, y: yPos, size, font, color: opts.color ?? INK })
  }

  // Header: Kyfaru company block (left) + logo (right)
  const logoW = 100
  const logoH = logoW / LOGO_ASPECT
  page.drawImage(logo, { x: W - MARGIN - logoW, y: y - logoH + 6, width: logoW, height: logoH })
  text('Kyfaru', MARGIN, y - 2, { size: 16, bold: true, color: ACCENT })
  text('TECH WITH HORNS', MARGIN, y - 16, { size: 7.5, color: MUTED })
  text(`${data.contactEmail ?? 'info@kyfaru.com'}  ·  ${data.contactPhone ?? '+254 705 256 443'}`, MARGIN, y - 30, { size: 8.5, color: MUTED })
  y -= 60

  // Title
  text('SOFTWARE QUOTATION', MARGIN, y, { size: 22, bold: true, color: INK })
  y -= 8
  page.drawLine({ start: { x: MARGIN, y }, end: { x: W - MARGIN, y }, thickness: 1.5, color: ACCENT })
  y -= 28

  // Bill To (left) + quote meta (right), side by side
  const metaTop = y
  text('BILL TO', MARGIN, y, { size: 8, bold: true, color: MUTED })
  y -= 14
  if (data.clientName) { text(data.clientName, MARGIN, y, { size: 11, bold: true }); y -= 14 }
  if (data.projectTitle) { text(data.projectTitle, MARGIN, y, { size: 9, color: MUTED }); y -= 13 }
  if (data.clientAddress) { text(data.clientAddress, MARGIN, y, { size: 9, color: MUTED }); y -= 13 }

  let metaY = metaTop
  const metaRow = (label: string, value: string) => {
    text(label, W - MARGIN - 160, metaY, { size: 8.5, bold: true, color: MUTED })
    text(value, W - MARGIN, metaY, { size: 9.5, mono: true, align: 'right' })
    metaY -= 16
  }
  metaRow('Quote #', data.quoteNumber)
  metaRow('Quote date', data.quoteDate)
  if (data.dueDate) metaRow('Valid until', data.dueDate)

  y = Math.min(y, metaY) - 20

  // Line items table
  const col = { qty: MARGIN, desc: MARGIN + 40, price: W - MARGIN - 190, amount: W - MARGIN }
  const rowH = 22

  const drawHeader = () => {
    page.drawRectangle({ x: MARGIN, y: y - 16, width: W - MARGIN * 2, height: 22, color: ACCENT })
    text('QTY', col.qty + 4, y - 10, { size: 8.5, bold: true, color: rgb(1, 1, 1) })
    text('DESCRIPTION', col.desc, y - 10, { size: 8.5, bold: true, color: rgb(1, 1, 1) })
    text('UNIT PRICE', col.price, y - 10, { size: 8.5, bold: true, color: rgb(1, 1, 1) })
    text('AMOUNT', col.amount, y - 10, { size: 8.5, bold: true, color: rgb(1, 1, 1), align: 'right' })
    y -= 22
  }
  drawHeader()

  let subtotal = 0
  const maxRowsPerPage = 16
  let rowsOnPage = 0
  for (const item of data.items) {
    if (rowsOnPage >= maxRowsPerPage) {
      page = pdf.addPage([W, H])
      y = H - MARGIN
      rowsOnPage = 0
      drawHeader()
    }
    const amount = item.quantity * item.unitPrice
    subtotal += amount
    text(String(item.quantity), col.qty + 4, y - 15, { size: 9, mono: true })
    text(item.description || '—', col.desc, y - 15, { size: 9 })
    text(money(item.unitPrice), col.price, y - 15, { size: 9, mono: true })
    text(money(amount), col.amount, y - 15, { size: 9, mono: true, align: 'right' })
    page.drawLine({ start: { x: MARGIN, y: y - rowH + 2 }, end: { x: W - MARGIN, y: y - rowH + 2 }, thickness: 0.5, color: LINE })
    y -= rowH
    rowsOnPage += 1
  }
  if (data.items.length === 0) {
    text('No line items yet.', col.desc, y - 15, { size: 9, color: MUTED })
    y -= rowH
  }

  y -= 24
  const discount = data.discount ?? 0
  const afterDiscount = subtotal - discount
  const tax = afterDiscount * (data.taxRate / 100)
  const total = afterDiscount + tax
  const summaryRow = (
  label: string,
  value: string,
  opts: {
    bold?: boolean
    size?: number
    labelColor?: typeof INK
    valueColor?: typeof INK
  } = {},
) => {
  text(label, col.price, y, {
    size: opts.size ?? 9.5,
    bold: opts.bold,
    color: opts.labelColor ?? MUTED,
  })

  text(value, col.amount, y, {
    size: opts.size ?? 9.5,
    mono: true,
    bold: opts.bold,
    color: opts.valueColor ?? INK,
    align: 'right',
  })

  y -= 18
}
  summaryRow('Subtotal', money(subtotal), {
  labelColor: ACCENT,
})

if (discount > 0) {
  summaryRow('Discount', `-${money(discount)}`, {
    labelColor: ACCENT,
  })
}

summaryRow(`Tax (${data.taxRate}%)`, money(tax), {
  labelColor: ACCENT,
})
  page.drawLine({ start: { x: col.price, y: y + 10 }, end: { x: W - MARGIN, y: y + 10 }, thickness: 1, color: ACCENT, })
  // Extra vertical gap
  y -= 20
  summaryRow('Total', money(total), {
  bold: true,
  size: 12,
  labelColor: ACCENT,
  valueColor: ACCENT,
})

  const wrapText = (str: string, font: typeof roboto, size: number, maxWidth: number): string[] => {
    const words = str.split(' ')
    const lines: string[] = []
    let line = ''
    for (const word of words) {
      const trial = line ? `${line} ${word}` : word
      if (font.widthOfTextAtSize(trial, size) > maxWidth) {
        if (line) lines.push(line)
        line = word
      } else {
        line = trial
      }
    }
    if (line) lines.push(line)
    return lines
  }

  // Payment schedule - a breakdown of when the Total is paid, not extra cost.
  const depositOn = data.depositEnabled ?? true
  const depositPct = data.depositPercent ?? 50
  const maintenanceOn = data.maintenanceEnabled ?? true
  const recurringMonthly = data.recurringMonthly ?? 0
  const recurringAnnual = data.recurringAnnual ?? 0
  if (depositOn || maintenanceOn || recurringMonthly > 0 || recurringAnnual > 0) {
    y -= 22
    const boxTop = y
    text('PAYMENT SCHEDULE', MARGIN, y, { size: 8, bold: true, color: MUTED })
    y -= 16
    if (depositOn) {
      const deposit = total * (depositPct / 100)
      text(`Deposit to begin work (${depositPct}%)`, MARGIN, y, { size: 9 })
      text(money(deposit), col.amount, y, { size: 9, mono: true, align: 'right' })
      y -= 14
      text('Balance on delivery', MARGIN, y, { size: 9 })
      text(money(total - deposit), col.amount, y, { size: 9, mono: true, align: 'right' })
      y -= 14
    }
    if (maintenanceOn) {
      text('Monthly maintenance (after 30 days free)', MARGIN, y, { size: 9 })
      text(`${money(data.maintenanceFee ?? 0)}/mo`, col.amount, y, { size: 9, mono: true, align: 'right' })
      y -= 14
    }
    if (recurringMonthly > 0) {
      text('Recurring tool costs', MARGIN, y, { size: 9 })
      text(`${money(recurringMonthly)}/mo`, col.amount, y, { size: 9, mono: true, align: 'right' })
      y -= 14
    }
    if (recurringAnnual > 0) {
      text('Annual tool costs', MARGIN, y, { size: 9 })
      text(`${money(recurringAnnual)}/yr`, col.amount, y, { size: 9, mono: true, align: 'right' })
      y -= 14
    }
    page.drawRectangle({
      x: MARGIN - 8, y: y + 2, width: W - MARGIN * 2 + 16, height: boxTop - y + 4,
      borderColor: LINE, borderWidth: 1, color: undefined,
    })
  }

  // Terms & conditions
  if (data.termsAndConditions) {
    y -= 12
    text('TERMS AND CONDITIONS', MARGIN, y, { size: 8, bold: true, color: MUTED })
    y -= 14
    for (const line of wrapText(data.termsAndConditions, roboto, 8.5, W - MARGIN * 2)) {
      text(line, MARGIN, y, { size: 8.5, color: MUTED })
      y -= 12
    }
  }

  return pdf.save()
}
