import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
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
  paymentName?: string
  paymentAccount?: string
  paymentBank?: string
  clientName?: string
  items: InvoiceLineItem[]
  discount?: string
  taxes?: string
  total: string
  phone?: string
  email?: string
}

const TEMPLATE = path.join(process.cwd(), 'public', 'templates', 'invoice-template.png')

// Fractional coordinates (x, y as fraction of page width/height, y measured from TOP).
// Calibrated against the 2552×3579 invoice artwork; tweak here if alignment drifts.
const C = {
  paymentName: { x: 0.13, yTop: 0.188 },
  paymentAccount: { x: 0.38, yTop: 0.188 },
  paymentBank: { x: 0.38, yTop: 0.205 },
  invoiceNumber: { x: 0.285, yTop: 0.275 },
  date: { x: 0.285, yTop: 0.318 },
  rows: { firstYTop: 0.418, pitch: 0.0505, max: 5 },
  col: { product: 0.13, price: 0.46, quantity: 0.62, total: 0.8 },
  clientName: { x: 0.13, yTop: 0.672 },
  summary: {
    labelX: 0.637,
    valueX: 0.8,
    discountYTop: 0.672,
    taxesYTop: 0.7,
    totalYTop: 0.731,
  },
  phone: { x: 0.22, yTop: 0.918 },
  email: { x: 0.22, yTop: 0.935 },
}

/** Builds the branded invoice PDF by overlaying data on the Illustrator artwork. */
export async function buildInvoicePdf(data: InvoiceDocData): Promise<Uint8Array> {
  const pngBytes = await readFile(TEMPLATE)
  const pdf = await PDFDocument.create()
  const png = await pdf.embedPng(pngBytes)

  // A4 portrait, artwork drawn full-bleed.
  const W = 595.28
  const H = 841.89
  const page = pdf.addPage([W, H])
  page.drawImage(png, { x: 0, y: 0, width: W, height: H })

  const font = await pdf.embedFont(StandardFonts.Courier)
  const fontBold = await pdf.embedFont(StandardFonts.CourierBold)
  const ink = rgb(0.18, 0.2, 0.21)
  const green = rgb(0.06, 0.45, 0.32)

  const at = (xFrac: number, yTopFrac: number) => ({ x: xFrac * W, y: H - yTopFrac * H })

  const draw = (
    text: string,
    xFrac: number,
    yTopFrac: number,
    opts: { size?: number; bold?: boolean; color?: typeof ink } = {},
  ) => {
    const { x, y } = at(xFrac, yTopFrac)
    page.drawText(text ?? '', {
      x,
      y,
      size: opts.size ?? 8,
      font: opts.bold ? fontBold : font,
      color: opts.color ?? ink,
    })
  }

  draw(data.paymentName ?? '', C.paymentName.x, C.paymentName.yTop)
  draw(data.paymentAccount ?? '', C.paymentAccount.x, C.paymentAccount.yTop)
  draw(data.paymentBank ?? '', C.paymentBank.x, C.paymentBank.yTop)

  draw(data.invoiceNumber, C.invoiceNumber.x, C.invoiceNumber.yTop, { size: 13, bold: true })
  draw(data.date, C.date.x, C.date.yTop, { size: 8 })

  data.items.slice(0, C.rows.max).forEach((item, i) => {
    const yTop = C.rows.firstYTop + i * C.rows.pitch
    draw(item.product, C.col.product, yTop)
    draw(item.price, C.col.price, yTop)
    draw(String(item.quantity), C.col.quantity, yTop)
    draw(item.total, C.col.total, yTop)
  })

  if (data.clientName) draw(data.clientName, C.clientName.x, C.clientName.yTop, { color: green, bold: true })

  draw(data.discount ?? 'KES0.00', C.summary.valueX, C.summary.discountYTop)
  draw(data.taxes ?? 'KES0.00', C.summary.valueX, C.summary.taxesYTop)
  draw(data.total, C.summary.valueX, C.summary.totalYTop, { bold: true, color: green })

  if (data.phone) draw(data.phone, C.phone.x, C.phone.yTop, { size: 7 })
  if (data.email) draw(data.email, C.email.x, C.email.yTop, { size: 7 })

  return pdf.save()
}
