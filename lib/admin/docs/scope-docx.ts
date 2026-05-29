// ============================================================
// KYFARU SCOPE OF WORK — DOCX generator (ported from generate.js)
// Faithful port of the original design; identifying fields
// (project, refs, client, dates) are injected per project, the rest
// remains the curated template.
// ============================================================

import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, LevelFormat,
} from 'docx'

export interface ScopeDocxData {
  projectTitle?: string
  sowRef?: string
  clientName?: string
  agreementRef?: string
  issueDate?: string
  startDate?: string
  goLive?: string
  objective?: string
}

const G = '27731E', GOLD = 'DEAE00', GOLDT = 'FFF9E6'
const DARK = '1A1A1A', GREY = '666666', LGREY = 'F5F5F5', WHITE = 'FFFFFF'
const GL = 'EBF5EC', RED = 'C0392B', REDT = 'FDECEA'

const nb = { style: BorderStyle.NONE, size: 0, color: WHITE }
const NB = { top: nb, bottom: nb, left: nb, right: nb }
const sb = (c = 'CCCCCC', s = 3) => ({ style: BorderStyle.SINGLE, size: s, color: c })
const AB = (c: string, s = 3) => ({ top: sb(c, s), bottom: sb(c, s), left: sb(c, s), right: sb(c, s) })
const LB = (c = G, s = 12) => ({ top: nb, bottom: nb, left: { style: BorderStyle.SINGLE, size: s, color: c, space: 8 }, right: nb })

interface POpts { align?: (typeof AlignmentType)[keyof typeof AlignmentType]; b?: number; a?: number; indent?: number; lborder?: string; lbsize?: number; size?: number; bold?: boolean; color?: string; italic?: boolean }

const P = (text: string, opts: POpts = {}) =>
  new Paragraph({
    alignment: opts.align || AlignmentType.LEFT,
    spacing: { before: opts.b ?? 40, after: opts.a ?? 80 },
    indent: opts.indent ? { left: opts.indent } : undefined,
    border: opts.lborder ? LB(opts.lborder, opts.lbsize || 12) : undefined,
    children: [new TextRun({ text: String(text), font: 'Arial', size: opts.size || 18, bold: opts.bold || false, color: opts.color || DARK, italics: opts.italic || false })],
  })

const bullet = (text: string, opts: { level?: number; size?: number; bold?: boolean; color?: string; italic?: boolean } = {}) =>
  new Paragraph({
    numbering: { reference: 'sow-bullets', level: opts.level || 0 },
    spacing: { before: 30, after: 60 },
    children: [new TextRun({ text: String(text), font: 'Arial', size: opts.size || 18, bold: opts.bold || false, color: opts.color || DARK, italics: opts.italic || false })],
  })

const gap = (n = 120) => P('', { b: n, a: 0 })

const SH = (text: string) =>
  new Paragraph({ spacing: { before: 280, after: 100 }, border: LB(G, 16), children: [new TextRun({ text, font: 'Arial', size: 24, bold: true, color: DARK })] })

const sh2 = (text: string, color = DARK) => P(text, { bold: true, b: 160, a: 60, size: 20, color })

interface CellOpts { borders?: ReturnType<typeof AB>; fill?: string; mt?: number; mb?: number; ml?: number; mr?: number; span?: number; align?: POpts['align']; size?: number; bold?: boolean; color?: string; italic?: boolean; paras?: Paragraph[] }

const Cell = (text: string, w: number, opts: CellOpts = {}) =>
  new TableCell({
    width: { size: w, type: WidthType.DXA },
    borders: opts.borders || AB('DDDDDD'),
    shading: opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR } : undefined,
    margins: { top: opts.mt || 60, bottom: opts.mb || 60, left: opts.ml || 100, right: opts.mr || 100 },
    columnSpan: opts.span || 1,
    children: opts.paras || [new Paragraph({ alignment: opts.align || AlignmentType.LEFT, children: [new TextRun({ text: String(text), font: 'Arial', size: opts.size || 18, bold: opts.bold || false, color: opts.color || DARK, italics: opts.italic || false })] })],
  })

const Row = (...cells: TableCell[]) => new TableRow({ children: cells })
const hCell = (text: string, w: number) => Cell(text, w, { bold: true, fill: G, color: WHITE, borders: AB(G), size: 17 })
const dCell = (text: string, w: number, opts: CellOpts = {}) => Cell(text, w, { ...opts, size: opts.size || 17 })
const lCell = (text: string, w: number) => Cell(text, w, { bold: true, fill: LGREY, size: 16 })

const tick = '☑', cross = '☐'

const infoBox = (heading: string, lines: string[], fill = GL, borderColor = G) =>
  new Table({
    width: { size: 9906, type: WidthType.DXA }, columnWidths: [9906],
    rows: [new TableRow({ children: [new TableCell({
      borders: { ...NB, left: { style: BorderStyle.SINGLE, size: 12, color: borderColor, space: 0 } },
      shading: { fill, type: ShadingType.CLEAR },
      margins: { top: 100, bottom: 100, left: 160, right: 120 },
      children: [
        new Paragraph({ spacing: { before: 0, after: 50 }, children: [new TextRun({ text: heading, font: 'Arial', size: 19, bold: true, color: borderColor })] }),
        ...lines.map((l) => new Paragraph({ spacing: { before: 0, after: 40 }, children: [new TextRun({ text: l, font: 'Arial', size: 17, color: DARK })] })),
      ],
    })] })],
  })

export async function buildScopeDocx(data: ScopeDocxData = {}): Promise<Buffer> {
  const projectTitle = data.projectTitle ?? 'FECHI ORGANICS E-COMMERCE'
  const sowRef = data.sowRef ?? 'KYF-007-0526-SOW'
  const clientName = data.clientName ?? 'Wangeci Wa Kariuki / Fechi Organics'
  const agreementRef = data.agreementRef ?? 'KYF-007-0526'
  const issueDate = data.issueDate ?? '28th May 2026'
  const startDate = data.startDate ?? '28th May 2026'
  const goLive = data.goLive ?? '29th June 2026'
  const objective = data.objective ??
    'Design, develop, test, and deploy a fully functional e-commerce website. The system will enable customers to browse, add to cart, pay via M-Pesa or card, and receive confirmations automatically.'

  const doc = new Document({
    numbering: {
      config: [{
        reference: 'sow-bullets',
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 560, hanging: 280 } } } },
          { level: 1, format: LevelFormat.BULLET, text: '◦', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 900, hanging: 260 } } } },
        ],
      }],
    },
    styles: { default: { document: { run: { font: 'Arial', size: 18, color: DARK } } } },
    sections: [{
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 860, right: 1000, bottom: 860, left: 1000 } } },
      children: [
        // HEADER
        new Table({
          width: { size: 9906, type: WidthType.DXA }, columnWidths: [5000, 4906],
          rows: [Row(
            new TableCell({ width: { size: 5000, type: WidthType.DXA }, borders: NB, margins: { top: 0, bottom: 0, left: 0, right: 0 }, children: [
              new Paragraph({ spacing: { before: 0, after: 20 }, children: [new TextRun({ text: 'KYFARU', font: 'Arial', size: 44, bold: true, color: G })] }),
              new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text: 'TECH WITH HORNS', font: 'Arial', size: 14, color: GREY })] }),
            ] }),
            new TableCell({ width: { size: 4906, type: WidthType.DXA }, borders: NB, margins: { top: 0, bottom: 0, left: 0, right: 0 }, children: [
              new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 0, after: 20 }, children: [new TextRun({ text: 'SCOPE OF WORK', font: 'Arial', size: 28, bold: true, color: DARK })] }),
              new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 0, after: 0 }, children: [new TextRun({ text: `SOW Ref: ${sowRef}`, font: 'Arial', size: 16, color: GREY })] }),
            ] }),
          )],
        }),
        new Paragraph({ spacing: { before: 60, after: 100 }, border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: G, space: 1 } }, children: [new TextRun('')] }),

        // META
        new Table({
          width: { size: 9906, type: WidthType.DXA }, columnWidths: [1800, 3100, 1800, 3206],
          rows: [
            Row(lCell('Project', 1800), dCell(projectTitle, 3100, { bold: true }), lCell('SOW Ref', 1800), dCell(sowRef, 3206)),
            Row(lCell('Client', 1800), dCell(clientName, 3100), lCell('Agreement Ref', 1800), dCell(agreementRef, 3206)),
            Row(lCell('Issue Date', 1800), dCell(issueDate, 3100), lCell('Version', 1800), dCell('v1.0', 3206)),
            Row(lCell('Start Date', 1800), dCell(startDate, 3100), lCell('Go-Live', 1800), dCell(goLive, 3206, { bold: true, color: G })),
          ],
        }),
        gap(120),

        // A: OVERVIEW
        SH('A.  PROJECT OVERVIEW'),
        P(`This Scope of Work forms a binding part of Project Agreement ${agreementRef} between Kyfaru and the Client. It defines every deliverable, feature, integration, access structure, security measure, and exclusion for the system. Any item not listed in this document is outside scope and subject to a written Change Request.`),
        gap(60),
        new Table({
          width: { size: 9906, type: WidthType.DXA }, columnWidths: [2400, 7506],
          rows: [
            Row(lCell('Project Objective', 2400), dCell(objective, 7506)),
            Row(lCell('Target Users', 2400), dCell('Kenyan customers (primary), international buyers (secondary), and administrators.', 7506)),
            Row(lCell('Primary Market', 2400), dCell('Kenya with international shipping capability.', 7506)),
            Row(lCell('Platforms', 2400), dCell('Web (desktop + mobile browser). Mobile-first design. No native iOS/Android app in this scope.', 7506)),
          ],
        }),
        gap(100),

        // B: SERVICES
        SH('B.  SERVICES TO BE PROVIDED'),
        P('Kyfaru shall provide the following services under this Agreement:'),
        bullet('UI/UX Design — wireframes, high-fidelity mockups, and design approval before development begins'),
        bullet('Frontend Development — all customer-facing pages built in Next.js with Tailwind CSS'),
        bullet('Backend Development — all API routes, business logic, payment processing, and database integration'),
        bullet('Payment Integration — M-Pesa STK Push (Daraja API) and card processing'),
        bullet('Third-Party Integration — POS / inventory sync for real-time stock management'),
        bullet('Email Automation — transactional emails for confirmations, shipping, and password reset'),
        bullet('SEO Foundation — metadata, structured data, sitemaps, and performance optimisation'),
        bullet('Security Implementation — SSL, authentication, rate limiting, input validation, and HTTPS'),
        bullet('Automated Backup System — daily database backups and file storage redundancy'),
        bullet('System Testing — functional, payment sandbox, mobile responsiveness, and cross-browser testing'),
        bullet('Deployment — production deployment with domain configuration'),
        bullet('Admin Training — one (1) session of 1–2 hours training staff on the admin dashboard'),
        bullet('30-Day Free Support — bug fixes and minor adjustments after go-live for 30 calendar days'),
        gap(100),

        // C: FEATURES
        SH('C.  KEY FEATURES AND DELIVERABLES'),
        P('The following features are included in the agreed project fee. Checked items are confirmed in scope. Unchecked items are excluded and require a Change Request if required.'),
        gap(60),
        sh2('C1 — Customer-Facing Website'),
        new Table({
          width: { size: 9906, type: WidthType.DXA }, columnWidths: [400, 3800, 600, 5106],
          rows: [
            Row(hCell('#', 400), hCell('Feature / Deliverable', 3800), hCell('In', 600), hCell('Notes', 5106)),
            ...([
              ['1', 'Homepage / Landing Page', 'Hero, featured products, brand story, categories, testimonials, CTA sections'],
              ['2', 'Shop / Product Listing Page', 'All products with filters by category, price. Pagination included.'],
              ['3', 'Product Detail Page', 'Photos, description, ingredients, how-to-use, reviews, add to cart, size options'],
              ['4', 'Shopping Cart', 'Add, remove, update quantity. Cart persists across sessions.'],
              ['5', 'Checkout — M-Pesa & Card', '3-step: Cart review → Delivery details → Payment.'],
              ['6', 'Order Confirmation Page', 'Shows order number, estimated delivery, WhatsApp confirmation trigger.'],
              ['7', 'User Account / Profile Page', 'Register, login, order history, saved addresses, favourites, settings.'],
              ['8', 'About / Our Story Page', 'Brand timeline, mission, values, testimonials.'],
              ['9', 'Contact Page', 'Contact form, store locations, WhatsApp button, FAQ section.'],
              ['10', 'Mobile-Responsive Design', 'All pages fully functional on phones. Mobile-first build approach.'],
            ] as [string, string, string][]).map(([n, f, notes]) =>
              Row(
                dCell(n, 400, { align: AlignmentType.CENTER }),
                dCell(f, 3800, { bold: true }),
                dCell(tick, 600, { align: AlignmentType.CENTER, color: G, bold: true }),
                dCell(notes, 5106, { color: GREY }),
              ),
            ),
          ],
        }),
        gap(100),

        // D: TECH STACK (kept as template defaults)
        SH('D.  TECHNOLOGY STACK'),
        new Table({
          width: { size: 9906, type: WidthType.DXA }, columnWidths: [2000, 4000, 3906],
          rows: [
            Row(hCell('Layer', 2000), hCell('Technology', 4000), hCell('Purpose', 3906)),
            Row(lCell('Frontend', 2000), dCell('Next.js (App Router) + Tailwind CSS', 4000), dCell('Customer-facing pages, routing, SSR for SEO', 3906, { color: GREY })),
            Row(lCell('Backend / API', 2000), dCell('Next.js API Routes (Node.js)', 4000), dCell('Server logic, payment callbacks, background jobs', 3906, { color: GREY })),
            Row(lCell('Database', 2000), dCell('PostgreSQL', 4000), dCell('Products, orders, customers, sessions', 3906, { color: GREY })),
            Row(lCell('Hosting', 2000), dCell('Vercel + global CDN', 4000), dCell('Automatic deployment, zero downtime', 3906, { color: GREY })),
            Row(lCell('Payments', 2000), dCell('M-Pesa Daraja API + Card processor', 4000), dCell('STK Push + international cards', 3906, { color: GREY })),
            Row(lCell('Email', 2000), dCell('Resend', 4000), dCell('Transactional emails', 3906, { color: GREY })),
          ],
        }),
        gap(100),

        // E: OWNERSHIP (info boxes preserved)
        SH('E.  OWNERSHIP AND ACCESS STRUCTURE'),
        infoBox('CORE PRINCIPLE: The Client owns the system. Kyfaru builds and maintains it.', [
          'The domain, the website, the database, and all customer data belong entirely to the Client.',
          "Kyfaru's role is to build the system, keep it running, and provide expertise when needed.",
          'Upon full and final payment, every credential and access detail is transferred to the Client.',
        ], GL, G),
        gap(80),
        infoBox('Disconnection and Separation Procedure', [
          '1.  Full payment of all outstanding amounts must be settled before any handover begins.',
          '2.  Kyfaru provides all credentials: source code, database access, hosting login, domain registrar, API keys.',
          '3.  Kyfaru provides a 1-hour technical handover session.',
          '4.  A complete system documentation package is handed over.',
          '5.  Kyfaru will not sabotage, restrict, or complicate the handover. The system belongs to the Client.',
        ], GOLDT, GOLD),
        gap(100),

        // I: MONTHLY RETAINER excerpt + exclusions list
        SH('I.  MONTHLY SUPPORT RETAINER — KES 6,000/MONTH'),
        P('Begins 30 days after the system goes live. Includes security updates, bug fixes for Kyfaru code, one minor feature per month, performance monitoring, monthly reports, renewal reminders, backup verification, and support during business hours.'),
        gap(60),
        infoBox('The following attract additional charges (quoted per Change Request):', [
          'New pages, sections, or major features not in the original SOW',
          'New third-party integrations (SMS, loyalty, new payment gateway)',
          'Emergency out-of-hours support — minimum KES 2,500',
          'Additional staff training sessions — KES 3,000 per session',
          'Product photography, videography, or copywriting',
          'Native mobile app (iOS/Android) or USSD integration',
        ], REDT, RED),
        gap(100),

        // L: EXCLUSIONS
        SH('L.  EXCLUSIONS FROM SCOPE'),
        P('The following are expressly excluded and require a separate written Change Request and additional fee if required:'),
        gap(60),
        new Table({
          width: { size: 9906, type: WidthType.DXA }, columnWidths: [400, 9506],
          rows: [
            'Blog or content management system (CMS)',
            'SMS notification system',
            'Native iOS or Android mobile application',
            'Loyalty / points / rewards programme',
            'Product photography or videography',
            'Copywriting for product descriptions or web content',
            'Ongoing SEO management or keyword research services',
            'Custom analytics beyond the admin dashboard',
            'USSD integration for feature phone customers',
            'Multi-language interface (English only in this scope)',
          ].map((item) => new TableRow({ children: [
            Cell(cross, 400, { borders: AB('EEEEEE'), size: 16, color: GREY, align: AlignmentType.CENTER }),
            Cell(item, 9506, { borders: AB('EEEEEE'), size: 16, color: GREY }),
          ] })),
        }),
        gap(100),

        // M: SIGN-OFF
        SH('M.  SCOPE CONFIRMATION AND SIGN-OFF'),
        P(`By signing below, both Parties confirm they have reviewed and agreed to the scope defined in this document. This SOW forms a binding part of Project Agreement ${agreementRef}.`),
        gap(80),
        new Table({
          width: { size: 9906, type: WidthType.DXA }, columnWidths: [4700, 506, 4700],
          rows: [
            Row(
              new TableCell({ width: { size: 4700, type: WidthType.DXA }, borders: NB, children: [new Paragraph({ children: [new TextRun({ text: 'FOR KYFARU (Developer)', font: 'Arial', size: 16, bold: true, color: G })] })] }),
              new TableCell({ width: { size: 506, type: WidthType.DXA }, borders: NB, children: [new Paragraph({ children: [new TextRun('')] })] }),
              new TableCell({ width: { size: 4700, type: WidthType.DXA }, borders: NB, children: [new Paragraph({ children: [new TextRun({ text: 'FOR CLIENT', font: 'Arial', size: 16, bold: true, color: G })] })] }),
            ),
            ...([['Signature', 'Signature'], ['Full Name & Title', 'Full Name & Business Name'], ['Date (dd/mm/yyyy)', 'Date (dd/mm/yyyy)']] as [string, string][]).flatMap(([l, r]) => [
              new TableRow({ children: [
                new TableCell({ width: { size: 4700, type: WidthType.DXA }, borders: { ...NB, bottom: sb('333333', 6) }, margins: { top: 120, bottom: 40, left: 0, right: 0 }, children: [new Paragraph({ children: [new TextRun('')] })] }),
                new TableCell({ width: { size: 506, type: WidthType.DXA }, borders: NB, children: [new Paragraph({ children: [new TextRun('')] })] }),
                new TableCell({ width: { size: 4700, type: WidthType.DXA }, borders: { ...NB, bottom: sb('333333', 6) }, margins: { top: 120, bottom: 40, left: 0, right: 0 }, children: [new Paragraph({ children: [new TextRun('')] })] }),
              ] }),
              new TableRow({ children: [
                new TableCell({ width: { size: 4700, type: WidthType.DXA }, borders: NB, children: [new Paragraph({ spacing: { before: 20 }, children: [new TextRun({ text: l, font: 'Arial', size: 15, italics: true, color: GREY })] })] }),
                new TableCell({ width: { size: 506, type: WidthType.DXA }, borders: NB, children: [new Paragraph({ children: [new TextRun('')] })] }),
                new TableCell({ width: { size: 4700, type: WidthType.DXA }, borders: NB, children: [new Paragraph({ spacing: { before: 20 }, children: [new TextRun({ text: r, font: 'Arial', size: 15, italics: true, color: GREY })] })] }),
              ] }),
            ]),
          ],
        }),
        gap(120),
        P(`This Scope of Work is issued in conjunction with Project Agreement ${agreementRef} and the Kyfaru Terms of Service at kyfaru.com/terms. Both documents must be signed for the project to commence.`, { italic: true, color: GREY, align: AlignmentType.CENTER, size: 15 }),
      ],
    }],
  })

  return Packer.toBuffer(doc)
}
