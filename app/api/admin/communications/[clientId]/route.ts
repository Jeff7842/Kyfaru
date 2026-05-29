import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { communicationLogs } from '@/lib/admin/db/schema'
import { asc, eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ clientId: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { clientId } = await params
  const messages = await db
    .select()
    .from(communicationLogs)
    .where(eq(communicationLogs.clientId, clientId))
    .orderBy(asc(communicationLogs.createdAt))

  return NextResponse.json({ messages })
}
