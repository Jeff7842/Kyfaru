import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import {
  invoices,
  projects,
  clients,
  communicationLogs,
  auditLogs,
} from '@/lib/admin/db/schema'
import { desc } from 'drizzle-orm'

function toCSV(rows: Record<string, unknown>[]): string {
  if (!rows.length) return ''
  const headers = Object.keys(rows[0])
  const lines = [
    headers.join(','),
    ...rows.map((row) =>
      headers.map((h) => JSON.stringify(row[h] ?? '')).join(','),
    ),
  ]
  return lines.join('\n')
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ reportId: string }> },
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { reportId } = await params
  let csv = ''

  switch (reportId) {
    case 'revenue': {
      const rows = await db
        .select({
          invoice_number: invoices.invoiceNumber,
          amount: invoices.amount,
          currency: invoices.currency,
          status: invoices.status,
          issued_at: invoices.issuedAt,
          due_date: invoices.dueDate,
          paid_at: invoices.paidAt,
        })
        .from(invoices)
        .orderBy(desc(invoices.issuedAt))
      csv = toCSV(rows as Record<string, unknown>[])
      break
    }
    case 'projects': {
      const rows = await db
        .select({
          code: projects.projectCode,
          name: projects.name,
          status: projects.status,
          start_date: projects.startDate,
          expected_end: projects.expectedEndDate,
          actual_end: projects.actualEndDate,
          progress: projects.progress,
        })
        .from(projects)
        .orderBy(desc(projects.createdAt))
      csv = toCSV(rows as Record<string, unknown>[])
      break
    }
    case 'clients': {
      const rows = await db
        .select({
          name: clients.name,
          email: clients.email,
          phone: clients.phone,
          industry: clients.industry,
          is_active: clients.isActive,
          created_at: clients.createdAt,
        })
        .from(clients)
        .orderBy(desc(clients.createdAt))
      csv = toCSV(rows as Record<string, unknown>[])
      break
    }
    case 'comms': {
      const rows = await db
        .select({
          channel: communicationLogs.channel,
          direction: communicationLogs.direction,
          to_address: communicationLogs.toAddress,
          subject: communicationLogs.subject,
          status: communicationLogs.status,
          created_at: communicationLogs.createdAt,
        })
        .from(communicationLogs)
        .orderBy(desc(communicationLogs.createdAt))
      csv = toCSV(rows as Record<string, unknown>[])
      break
    }
    case 'audit': {
      const rows = await db
        .select({
          action: auditLogs.action,
          entity_type: auditLogs.entityType,
          entity_id: auditLogs.entityId,
          ip_address: auditLogs.ipAddress,
          created_at: auditLogs.createdAt,
        })
        .from(auditLogs)
        .orderBy(desc(auditLogs.createdAt))
      csv = toCSV(rows as Record<string, unknown>[])
      break
    }
    default:
      return NextResponse.json({ error: 'unknown_report' }, { status: 400 })
  }

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="kyfaru-${reportId}-report.csv"`,
    },
  })
}
