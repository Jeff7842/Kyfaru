// Cron: runs daily to flip sent invoices past their due date to 'overdue'
// Triggered by Vercel cron — see vercel.json

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/admin/db'
import { invoices } from '@/lib/admin/db/schema'
import { and, eq, lt } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const now = new Date()
  const result = await db
    .update(invoices)
    .set({ status: 'overdue', updatedAt: now })
    .where(and(eq(invoices.status, 'sent'), lt(invoices.dueDate, now)))

  return NextResponse.json({ updated: result.rowCount ?? 0 })
}
