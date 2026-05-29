import { NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { clients, communicationLogs } from '@/lib/admin/db/schema'
import { desc, eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rows = await db
    .select()
    .from(clients)
    .where(eq(clients.isActive, true))
    .orderBy(desc(clients.updatedAt))

  // Attach last message per client (small N; fine for a thread list).
  const threads = await Promise.all(
    rows.map(async (c) => {
      const last = await db.query.communicationLogs.findFirst({
        where: eq(communicationLogs.clientId, c.id),
        orderBy: [desc(communicationLogs.createdAt)],
      })
      return {
        client: { id: c.id, name: c.name, email: c.email, phone: c.phone, whatsappNumber: c.whatsappNumber, logoUrl: c.logoUrl },
        lastMessage: last ? { body: last.body, channel: last.channel, direction: last.direction, createdAt: last.createdAt } : null,
      }
    }),
  )

  // Sort: clients with messages first, by recency.
  threads.sort((a, b) => {
    const at = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0
    const bt = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0
    return bt - at
  })

  return NextResponse.json({ threads })
}
