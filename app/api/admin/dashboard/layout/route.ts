import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { dashboardLayouts } from '@/lib/admin/db/schema'
import { eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export const DEFAULT_LAYOUT = [
  { widgetId: 'kpis', size: 'full' },
  { widgetId: 'revenue', size: 'full' },
  { widgetId: 'invoices-status', size: 'half' },
  { widgetId: 'expenses-category', size: 'half' },
  { widgetId: 'projects-status', size: 'half' },
]

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const row = await db.query.dashboardLayouts.findFirst({ where: eq(dashboardLayouts.userId, session.user.id as string) })
  return NextResponse.json({ layout: row?.layout ?? DEFAULT_LAYOUT })
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { layout } = await req.json()
  if (!Array.isArray(layout)) return NextResponse.json({ error: 'Invalid layout' }, { status: 400 })

  const userId = session.user.id as string
  await db
    .insert(dashboardLayouts)
    .values({ userId, layout, updatedAt: new Date() })
    .onConflictDoUpdate({ target: dashboardLayouts.userId, set: { layout, updatedAt: new Date() } })

  return NextResponse.json({ ok: true })
}
