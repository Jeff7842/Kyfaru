import { PDFDocument, rgb } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

export interface InvoiceLineItem {
  product: string
  price: string // formatted, e.g. "KES 50,000"
  quantity: number | string
  total: string
}

export interface InvoiceDocData {
  invoiceNumber: string // e.g. "KY-00021"
  date: string // formatted, e.g. "28th May 2026"
  paid?: boolean
  paymentName?: string
  paymentAccount?: string
  paymentBank?: string
  paymentMpesa?: string // optional 3rd payment line, e.g. "Mpesa +254705256443"
  clientName?: string
  items: InvoiceLineItem[]
  discount?: string
  taxes?: string
  total: string
}

// The blank artwork - swap target for the old pre-filled template that baked a
// fake sample invoice into the pixels (the actual cause of the reported overlap).
const TEMPLATE = path.join(process.cwd(), 'public', 'invoice', 'Invoice Template.png')

// Copied into public/fonts/ from @fontsource rather than read from
// node_modules at runtime - node_modules is subject to Vercel's serverless
// build file-tracing (which, even with outputFileTracingIncludes pointed at
// it, didn't reliably survive pnpm's symlinked node_modules layout there),
// while public/ is always deployed in full, no tracing involved.
const fontFile = (file: string) => path.join(process.cwd(), 'public', 'fonts', file)
const ROBOTO_REGULAR = fontFile('roboto-latin-400-normal.woff')
const ROBOTO_BOLD = fontFile('roboto-latin-700-normal.woff')
const ROBOTO_MONO_REGULAR = fontFile('roboto-mono-latin-400-normal.woff')
const ROBOTO_MONO_BOLD = fontFile('roboto-mono-latin-700-normal.woff')

// Fractional coordinates (x, y as fraction of page width/height, y measured from TOP).
// Calibrated against public/invoice/Invoice Template.png (2552×3579); no external
// provenance doc exists - recalibrate by eye against that PNG if it changes.
const C = {
  paymentName: { x: 0.13, yTop: 0.199 },
  paymentAccount: { x: 0.38, yTop: 0.199 },
  paymentBank: { x: 0.38, yTop: 0.201 },
  paymentMpesa: { x: 0.38, yTop: 0.240 }, // optional 3rd line - drawn only if provided
  invoiceNumber: { x: 0.285, yTop: 0.299 },
  paidStamp: { x: 0.62, yTop: 0.215 },
  date: { x: 0.285, yTop: 0.331 },
  rows: { firstYTop: 0.435, pitch: 0.040, max: 5 },
  col: { product: 0.13, price: 0.46, quantity: 0.62, total: 0.8 },
  clientName: { x: 0.13, yTop: 0.672 },
  summary: {
    labelX: 0.637,
    valueX: 0.8,
    discountYTop: 0.672,
    taxesYTop: 0.7,
    totalYTop: 0.731,
  },
}

const W = 595.28
const H = 841.89

/** Builds the branded invoice PDF by overlaying data on the Kyfaru artwork. */
export async function buildInvoicePdf(data: InvoiceDocData): Promise<Uint8Array> {
  const [pngBytes, robotoBytes, robotoBoldBytes, monoBytes, monoBoldBytes] = await Promise.all([
    readFile(TEMPLATE),
    readFile(ROBOTO_REGULAR),
    readFile(ROBOTO_BOLD),
    readFile(ROBOTO_MONO_REGULAR),
    readFile(ROBOTO_MONO_BOLD),
  ])

  const pdf = await PDFDocument.create()
  pdf.registerFontkit(fontkit)
  const png = await pdf.embedPng(pngBytes)

  // Every dynamic value on the invoice is Roboto Mono per the confirmed font-role
  // rule - no static label is ever drawn here, they all live in the template artwork.
  const mono = await pdf.embedFont(monoBytes, { subset: true })
  const monoBold = await pdf.embedFont(monoBoldBytes, { subset: true })
  // Roboto is reserved for any label text drawn on a continuation page, matching
  // the artwork's own convention for static headings.
  const roboto = await pdf.embedFont(robotoBytes, { subset: true })
  const robotoBold = await pdf.embedFont(robotoBoldBytes, { subset: true })

  const ink = rgb(0.18, 0.2, 0.21)
  const green = rgb(0.06, 0.45, 0.32)

  function newPage() {
    const page = pdf.addPage([W, H])
    page.drawImage(png, { x: 0, y: 0, width: W, height: H })
    return page
  }

  let page = newPage()

  const at = (xFrac: number, yTopFrac: number) => ({ x: xFrac * W, y: H - yTopFrac * H })

  const draw = (
    text: string,
    xFrac: number,
    yTopFrac: number,
    opts: { size?: number; bold?: boolean; color?: typeof ink; font?: 'mono' | 'roboto' } = {},
  ) => {
    const { x, y } = at(xFrac, yTopFrac)
    const font = opts.font === 'roboto' ? (opts.bold ? robotoBold : roboto) : opts.bold ? monoBold : mono
    page.drawText(text ?? '', { x, y, size: opts.size ?? 8, font, color: opts.color ?? ink })
  }

  draw(data.paymentName ?? '', C.paymentName.x, C.paymentName.yTop)
  draw(data.paymentAccount ?? '', C.paymentAccount.x, C.paymentAccount.yTop)
  draw(data.paymentBank ?? '', C.paymentBank.x, C.paymentBank.yTop)
  if (data.paymentMpesa) draw(data.paymentMpesa, C.paymentMpesa.x, C.paymentMpesa.yTop)

  draw(data.invoiceNumber, C.invoiceNumber.x, C.invoiceNumber.yTop, { size: 13, bold: true })
  draw(data.date, C.date.x, C.date.yTop, { size: 8 })
  if (data.paid) draw('PAID', C.paidStamp.x, C.paidStamp.yTop, { size: 12, bold: true, color: green })

  const items = data.items
  let row = 0
  let pageFirstYTop = C.rows.firstYTop
  for (const item of items) {
    if (row === C.rows.max) {
      // Continuation page: repeat the column headers (Roboto, matching the
      // artwork's own label convention) below the logo lockup (which occupies
      // roughly x:[0.62,0.91], y:[0.045,0.10] on this artwork).
      page = newPage()
      const contHeaderYTop = 0.14
      draw('Product', C.col.product, contHeaderYTop, { font: 'roboto', bold: true })
      draw('Price', C.col.price, contHeaderYTop, { font: 'roboto', bold: true })
      draw('Quantity', C.col.quantity, contHeaderYTop, { font: 'roboto', bold: true })
      draw('Total', C.col.total, contHeaderYTop, { font: 'roboto', bold: true })
      pageFirstYTop = contHeaderYTop + C.rows.pitch
      row = 0
    }
    const yTop = pageFirstYTop + row * C.rows.pitch
    draw(item.product, C.col.product, yTop)
    draw(item.price, C.col.price, yTop)
    draw(String(item.quantity), C.col.quantity, yTop)
    draw(item.total, C.col.total, yTop)
    row += 1
  }

  if (data.clientName) draw(data.clientName, C.clientName.x, C.clientName.yTop, { color: green, bold: true })

  draw(data.discount ?? 'KES 0.00', C.summary.valueX, C.summary.discountYTop)
  draw(data.taxes ?? 'KES 0.00', C.summary.valueX, C.summary.taxesYTop)
  draw(data.total, C.summary.valueX, C.summary.totalYTop, { bold: true, color: green })

  return pdf.save()
}
