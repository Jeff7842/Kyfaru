// ============================================================
// KYFARU PROJECT AGREEMENT — DOCX generator (ported from the
// provided kyfaru-project-agreement.js). Identity fields injected
// per project; layout/clauses preserved verbatim.
// ============================================================

import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign,
} from 'docx'

export interface AgreementDocxData {
  ref?: string
  clientName?: string
  clientBiz?: string
  clientPhone?: string
  clientEmail?: string
  projectTitle?: string
  projectType?: string
  startDate?: string
  goLive?: string
}

const GREEN = '27731E', DARK = '1A1A1A', GREY = '666666'
const LGREY = 'F5F5F5', LGREEN = 'EBF5EC', WHITE = 'FFFFFF'

const PAGE_W = 11906, PAGE_H = 16838
const MARGIN = { top: 860, right: 1000, bottom: 860, left: 1000 }
const INNER_W = PAGE_W - MARGIN.left - MARGIN.right

const solidBorder = (color = 'CCCCCC', size = 3) => ({ style: BorderStyle.SINGLE, size, color })
const noBorderSide = { style: BorderStyle.NONE, size: 0, color: WHITE }
const NO_BORDERS = { top: noBorderSide, bottom: noBorderSide, left: noBorderSide, right: noBorderSide }
const ALL_GREY = (size = 3) => { const b = solidBorder('DDDDDD', size); return { top: b, bottom: b, left: b, right: b } }
const ALL_GREEN = () => { const b = solidBorder(GREEN, 4); return { top: b, bottom: b, left: b, right: b } }

interface TrOpts { bold?: boolean; italic?: boolean; size?: number; color?: string; underline?: boolean }
const tr = (text: string, opts: TrOpts = {}) =>
  new TextRun({ text, font: 'Arial', size: opts.size ?? 18, bold: opts.bold ?? false, italics: opts.italic ?? false, color: opts.color ?? DARK, underline: opts.underline ? { type: 'single' as const } : undefined })

interface ParaOpts { align?: POptsAlign; before?: number; after?: number; indent?: number; lborder?: boolean }
type POptsAlign = (typeof AlignmentType)[keyof typeof AlignmentType]
const para = (runs: TextRun[] | TextRun, opts: ParaOpts = {}) =>
  new Paragraph({
    alignment: opts.align ?? AlignmentType.LEFT,
    spacing: { before: opts.before ?? 40, after: opts.after ?? 80 },
    indent: opts.indent ? { left: opts.indent } : undefined,
    border: opts.lborder ? { left: { style: BorderStyle.SINGLE, size: 16, color: GREEN, space: 8 } } : undefined,
    children: Array.isArray(runs) ? runs : [runs],
  })

const p = (text: string, opts: TrOpts & ParaOpts = {}) => para([tr(text, opts)], opts)
const gap = (before = 80) => p('', { before, after: 0 })

/* eslint-disable @typescript-eslint/no-explicit-any */
interface CellOpts { fill?: string; borders?: any; mt?: number; mb?: number; ml?: number; mr?: number; span?: number; va?: any; align?: POptsAlign; size?: number; bold?: boolean; color?: string; italic?: boolean }

const cell = (paragraphs: Paragraph[] | Paragraph, width: number, opts: CellOpts = {}) =>
  new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: opts.borders ?? ALL_GREY(),
    shading: opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR } : undefined,
    margins: { top: opts.mt ?? 60, bottom: opts.mb ?? 60, left: opts.ml ?? 100, right: opts.mr ?? 100 },
    columnSpan: opts.span ?? 1,
    verticalAlign: opts.va ?? VerticalAlign.TOP,
    children: Array.isArray(paragraphs) ? paragraphs : [paragraphs],
  })

const hCell = (text: string, width: number, opts: CellOpts = {}) =>
  cell([p(text, { bold: true, color: WHITE, size: opts.size ?? 17, align: opts.align })], width, { borders: ALL_GREEN(), fill: GREEN, ...opts })
const lCell = (text: string, width: number, size = 16) =>
  cell([p(text, { bold: true, color: DARK, size })], width, { fill: LGREY })
const vCell = (text: string, width: number, opts: TrOpts & ParaOpts = {}) =>
  cell([p(text, opts)], width, {})
const nbCell = (paragraphs: Paragraph[], width: number) => cell(paragraphs, width, { borders: NO_BORDERS })

const sectionHead = (text: string) =>
  new Paragraph({ spacing: { before: 200, after: 80 }, border: { left: { style: BorderStyle.SINGLE, size: 16, color: GREEN, space: 8 } }, children: [tr(text, { bold: true, size: 22, color: DARK })] })

const SIG_COL = 4653
const sigLineRow = () => new TableRow({ children: [
  new TableCell({ width: { size: SIG_COL, type: WidthType.DXA }, borders: { ...NO_BORDERS, bottom: solidBorder('333333', 6) }, margins: { top: 140, bottom: 40, left: 0, right: 0 }, children: [] }),
  nbCell([], 600),
  new TableCell({ width: { size: SIG_COL, type: WidthType.DXA }, borders: { ...NO_BORDERS, bottom: solidBorder('333333', 6) }, margins: { top: 140, bottom: 40, left: 0, right: 0 }, children: [] }),
] })
const sigLabelRow = (l: string, r: string) => new TableRow({ children: [
  nbCell([p(l, { italic: true, color: GREY, size: 15 })], SIG_COL), nbCell([], 600), nbCell([p(r, { italic: true, color: GREY, size: 15 })], SIG_COL),
] })
const sigSpacerRow = () => new TableRow({ children: [nbCell([], SIG_COL), nbCell([], 600), nbCell([], SIG_COL)] })

export async function buildAgreementDocx(data: AgreementDocxData = {}): Promise<Buffer> {
  const REF = data.ref ?? 'KYF-______-______'
  const CLIENT_NAME = data.clientName ?? '_________________________________'
  const CLIENT_BIZ = data.clientBiz ?? '_________________________________'
  const CLIENT_PHONE = data.clientPhone ?? '_________________________________'
  const CLIENT_EMAIL = data.clientEmail ?? '_________________________________'
  const projectTitle = data.projectTitle ?? ''
  const projectType = data.projectType ?? ''
  const startDate = data.startDate ?? ''
  const goLive = data.goLive ?? ''

  const doc = new Document({
    styles: { default: { document: { run: { font: 'Arial', size: 18, color: DARK } } } },
    sections: [{
      properties: { page: { size: { width: PAGE_W, height: PAGE_H }, margin: MARGIN } },
      children: [
        // HEADER
        new Table({
          width: { size: INNER_W, type: WidthType.DXA }, columnWidths: [4953, 4953],
          rows: [new TableRow({ children: [
            nbCell([
              new Paragraph({ spacing: { before: 0, after: 20 }, children: [tr('KYFARU', { bold: true, size: 42, color: GREEN })] }),
              p('TECH WITH HORNS', { size: 14, color: GREY, before: 0, after: 0 }),
            ], 4953),
            nbCell([
              new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 0, after: 20 }, children: [tr('PROJECT AGREEMENT', { bold: true, size: 26, color: DARK })] }),
              new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 0, after: 0 }, children: [tr(`Ref: ${REF}`, { size: 16, color: GREY })] }),
            ], 4953),
          ] })],
        }),
        new Paragraph({ spacing: { before: 60, after: 100 }, border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: GREEN, space: 1 } }, children: [] }),

        // PARTIES
        new Table({
          width: { size: INNER_W, type: WidthType.DXA }, columnWidths: [4953, 4953],
          rows: [new TableRow({ children: [
            new TableCell({ width: { size: 4953, type: WidthType.DXA }, borders: { ...NO_BORDERS, right: solidBorder('DDDDDD', 3) }, margins: { top: 60, bottom: 60, left: 0, right: 120 }, children: [
              p('DEVELOPER', { size: 14, bold: true, color: GREEN, before: 0, after: 40 }),
              para([tr('KYFARU', { bold: true, size: 20, color: DARK })], { before: 0, after: 20 }),
              p('Nairobi, Kenya', { size: 17, color: GREY, before: 0, after: 20 }),
              para([tr('hello@kyfaru.com', { size: 16, color: GREEN }), tr('  •  ', { size: 16, color: GREY }), tr('kyfaru.com', { size: 16, color: GREEN })], { before: 0, after: 0 }),
            ] }),
            new TableCell({ width: { size: 4953, type: WidthType.DXA }, borders: NO_BORDERS, margins: { top: 60, bottom: 60, left: 120, right: 0 }, children: [
              p('CLIENT', { size: 14, bold: true, color: GREEN, before: 0, after: 40 }),
              ...([['Full Name:', CLIENT_NAME], ['Business:', CLIENT_BIZ], ['Phone:', CLIENT_PHONE], ['Email:', CLIENT_EMAIL]] as [string, string][]).map(([label, value]) =>
                para([tr(`${label} `, { bold: true, size: 17 }), tr(value, { size: 17, color: DARK })], { before: 0, after: 20 })),
            ] }),
          ] })],
        }),
        gap(100),

        // 1. THE PROJECT
        sectionHead('1.  THE PROJECT'),
        gap(40),
        new Table({
          width: { size: INNER_W, type: WidthType.DXA }, columnWidths: [2200, 7706],
          rows: ([
            ['Project Title', projectTitle],
            ['Project Type', projectType],
            ['Start Date', startDate],
            ['Estimated Go-Live', goLive],
            ['Scope Reference', 'As detailed in the Scope of Work [SOW] document attached hereto and forming part of this Agreement.'],
          ] as [string, string][]).map(([label, value]) => new TableRow({ children: [lCell(label, 2200, 16), vCell(value, 7706, { size: 16 })] })),
        }),
        gap(100),

        // 2. DELIVER
        sectionHead('2.  WHAT KYFARU WILL DELIVER'),
        gap(40),
        p('Kyfaru agrees to design, develop, test, and deploy the System described in the attached Scope of Work [SOW]. All deliverables, features, pages, integrations, and technical specifications are defined in the SOW, which forms a binding part of this Agreement. Any feature or service not listed in the SOW is outside scope and subject to a Change Request.', { align: AlignmentType.JUSTIFIED, after: 80 }),
        para([tr('Companion documents that form part of this Agreement:', { bold: true, size: 18 })], { after: 60 }),
        new Table({
          width: { size: INNER_W, type: WidthType.DXA }, columnWidths: [3302, 3302, 3302],
          rows: [new TableRow({ children: ([
            ['☐  Scope of Work [SOW]', 'Attached / To be issued'],
            ['☐  Invoice(s)', 'Issued at each milestone'],
            ['☐  Change Request Form', 'Issued when applicable'],
          ] as [string, string][]).map(([title, sub]) => cell([p(title, { bold: true, size: 17, color: GREEN }), p(sub, { size: 15, color: GREY, before: 20, after: 0 })], 3302, { fill: LGREEN, borders: ALL_GREY(2) })) })],
        }),
        gap(100),

        // 3. TIMELINE
        sectionHead('3.  TIMELINE AND MILESTONES'),
        gap(40),
        new Table({
          width: { size: INNER_W, type: WidthType.DXA }, columnWidths: [3302, 1800, 4804],
          rows: [
            new TableRow({ children: [hCell('Milestone', 3302), hCell('Target Date', 1800, { align: AlignmentType.CENTER }), hCell('Description', 4804)] }),
            ...([
              ['M1 - Kick-Off & Deposit', '____ / ____ / ______', 'Agreement signed. Deposit received. Work commences.'],
              ['M2 - Design Approval', '____ / ____ / ______', 'Client reviews and approves design concepts / staging.'],
              ['M3 - Staging Handover', '____ / ____ / ______', 'Full working system delivered on staging environment.'],
              ['M4 - Go-Live', '____ / ____ / ______', 'System deployed live.'],
              ['M5 - Final Payment', '____ / ____ / ______', 'Final payment due. Credentials handed over.'],
              ['M6 - Free Support Ends', '____ / ____ / ______', '30-day complimentary support period concludes.'],
            ] as [string, string, string][]).map(([m, d, desc]) => new TableRow({ children: [
              vCell(m, 3302, { bold: true, size: 17 }), vCell(d, 1800, { size: 17, align: AlignmentType.CENTER }), vCell(desc, 4804, { size: 16, color: GREY }),
            ] })),
          ],
        }),
        gap(60),
        para([tr('Timeline is contingent on the Client providing required content, approvals, and feedback within 5 business days of each request. Delays caused by the Client extend the timeline accordingly. ', { italic: true, size: 15, color: GREY }), tr('Kyfaru', { italic: true, bold: true, size: 15, color: DARK }), tr(' shall bear no liability for Client-induced delays.', { italic: true, size: 15, color: GREY })], { align: AlignmentType.JUSTIFIED }),
        gap(100),

        // 4. PAYMENT
        sectionHead('4.  PAYMENT'),
        gap(40),
        new Table({
          width: { size: INNER_W, type: WidthType.DXA }, columnWidths: [3302, 1500, 2000, 3104],
          rows: [
            new TableRow({ children: [hCell('Payment Milestone', 3302), hCell('%', 1500, { align: AlignmentType.CENTER }), hCell('Amount (KES)', 2000, { align: AlignmentType.CENTER }), hCell('Due Date / Trigger', 3104)] }),
            ...([
              ['M1 - Deposit (non-refundable)', '50%', 'KES ____________', 'On signing. Work starts on receipt.'],
              ['M2 - Staging Approval', '25%', 'KES ____________', 'On Client approval of staging site.'],
              ['M3 - Final Delivery', '25%', 'KES ____________', 'Before go-live. Triggers credential handover.'],
              ['Total Project Fee', '100%', 'KES ____________', '—'],
            ] as [string, string, string, string][]).map(([m, pct, amount, trigger], i) => new TableRow({ children: [
              vCell(m, 3302, { bold: i === 3, size: 17 }),
              vCell(pct, 1500, { bold: i === 3, size: 17, align: AlignmentType.CENTER }),
              vCell(amount, 2000, { bold: i === 3, size: 17, color: i === 3 ? GREEN : DARK, align: AlignmentType.CENTER }),
              vCell(trigger, 3104, { size: 15, color: GREY }),
            ] })),
          ],
        }),
        gap(60),
        new Table({
          width: { size: INNER_W, type: WidthType.DXA }, columnWidths: [4953, 4953],
          rows: [new TableRow({ children: [
            cell([
              p('ONGOING SUPPORT  [ After Go-Live ]', { bold: true, size: 16, color: GREEN, before: 0, after: 20 }),
              para([tr('Free support: 30 days [', { size: 16 }), tr('bug fixes only', { size: 16, bold: true }), tr(']', { size: 16 })], { before: 0, after: 16 }),
              p('Monthly retainer: KES 6,000 / month thereafter', { size: 16, before: 0, after: 0 }),
            ], 4953, { fill: LGREEN, borders: { ...ALL_GREY(2), right: { style: BorderStyle.NONE, size: 0, color: WHITE } } }),
            cell([
              p('PAYMENT METHODS', { bold: true, size: 16, color: DARK, before: 0, after: 20 }),
              p('M-Pesa: ________________________', { size: 16, before: 0, after: 16 }),
              p('Bank Transfer: On invoice', { size: 15, color: GREY, before: 0, after: 0 }),
            ], 4953, { fill: LGREY, borders: ALL_GREY(2) }),
          ] })],
        }),
        gap(100),

        // 5. TERMS
        sectionHead('5.  TERMS & CONDITIONS'),
        gap(40),
        new Table({
          width: { size: INNER_W, type: WidthType.DXA }, columnWidths: [INNER_W],
          rows: [new TableRow({ children: [cell([
            para([tr('This Agreement is governed by and incorporates by reference the Kyfaru Terms of Service published at '), tr('kyfaru.com/terms', { color: GREEN }), tr(' (the “Kyfaru Terms”), as updated from time to time. By signing below, the Client confirms they have read, understood, and agree to be bound by this Agreement and the Kyfaru Terms in their entirety.')], { align: AlignmentType.JUSTIFIED, before: 0, after: 80 }),
            para([tr('The Kyfaru Terms govern: '), tr('intellectual property ownership and transfer, confidentiality and non-disclosure, limitation of liability, Change Requests, data protection (Kenya Data Protection Act 2019), service suspension, termination rights, forfeit clauses, dispute resolution (arbitration under the Arbitration Act Cap. 49 Laws of Kenya), and governing law (Laws of Kenya).', { italic: true }), tr(' A printed copy of the current Kyfaru Terms is available on request.')], { align: AlignmentType.JUSTIFIED, before: 0, after: 0 }),
          ], INNER_W, { fill: LGREEN, borders: { top: solidBorder(GREEN, 4), bottom: solidBorder(GREEN, 4), left: { style: BorderStyle.SINGLE, size: 16, color: GREEN }, right: solidBorder(GREEN, 4) }, ml: 140, mr: 120, mt: 100, mb: 100 })] })],
        }),
        gap(100),

        // 6. KEY AGREEMENTS
        sectionHead('6.  KEY AGREEMENTS AT A GLANCE'),
        gap(40),
        new Table({
          width: { size: INNER_W, type: WidthType.DXA }, columnWidths: [2800, 7106],
          rows: ([
            ['Credential Handover', 'All system credentials handed over only after full and final payment is received.'],
            ['IP Ownership', 'Intellectual property transfers to Client in full upon final payment.'],
            ['Scope Changes', 'Any feature outside the SOW requires a written Change Request and additional fee.'],
            ['Cancellation Forfeit', 'Deposit non-refundable. 20% of remaining balance forfeit if cancelled mid-project.'],
            ['Service Suspension', '14 days written notice before suspension for unpaid invoices.'],
            ['Client Liability', 'Kyfaru is not liable for issues arising from Client actions, credential misuse, or third-party service outages.'],
            ['Data Protection', 'Both parties comply with Kenya Data Protection Act, No. 24 of 2019.'],
          ] as [string, string][]).map(([label, value]) => new TableRow({ children: [lCell(label, 2800, 16), vCell(value, 7106, { size: 16 })] })),
        }),
        gap(100),

        // 7. SIGNATURES
        sectionHead('7.  SIGNATURES'),
        gap(40),
        para([tr('By signing below, both Parties confirm they have read and agree to this Agreement and the Kyfaru Terms at '), tr('kyfaru.com/terms', { color: GREEN }), tr('. Electronic signatures are accepted and legally valid under the Kenya Information and Communications Act (Cap. 411A).')], { align: AlignmentType.JUSTIFIED, after: 80 }),
        new Table({
          width: { size: INNER_W, type: WidthType.DXA }, columnWidths: [SIG_COL, 600, SIG_COL],
          rows: [
            new TableRow({ children: [nbCell([p('FOR KYFARU [Developer]', { bold: true, size: 16, color: GREEN })], SIG_COL), nbCell([], 600), nbCell([p('FOR CLIENT', { bold: true, size: 16, color: GREEN })], SIG_COL)] }),
            sigLineRow(), sigLabelRow('Signature', 'Signature'), sigSpacerRow(),
            sigLineRow(), sigLabelRow('Full Name & Title', 'Full Name & Business Name'), sigSpacerRow(),
            sigLineRow(), sigLabelRow('Date (dd/mm/yyyy)', 'Date (dd/mm/yyyy)'),
          ],
        }),
        gap(100),
        new Table({
          width: { size: INNER_W, type: WidthType.DXA }, columnWidths: [INNER_W],
          rows: [new TableRow({ children: [cell([
            p('CLIENT CONFIRMATION (please initial each):', { bold: true, size: 15, color: DARK, before: 0, after: 40 }),
            para([tr('☐  I have read and agree to the Kyfaru Terms of Service at ', { size: 16 }), tr('kyfaru.com/terms', { color: GREEN, size: 16 }), tr('         Initials: _______', { size: 16 })], { before: 0, after: 30 }),
            p('☐  I understand this Agreement is binding and that the deposit is non-refundable   Initials: _______', { size: 16, before: 0, after: 30 }),
            p('☐  I accept that features outside the agreed SOW will attract additional charges     Initials: _______', { size: 16, before: 0, after: 0 }),
          ], INNER_W, { fill: LGREY, borders: ALL_GREY(2), ml: 120, mr: 120, mt: 80, mb: 80 })] })],
        }),
      ],
    }],
  })

  return Packer.toBuffer(doc)
}
