// Cron: runs daily to fire in-app notifications for projects nearing support expiry

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/admin/db'
import { projects, notifications, users } from '@/lib/admin/db/schema'
import { and, eq, lte, gte, isNotNull } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const now = new Date()
  const in30 = new Date(now)
  in30.setDate(in30.getDate() + 30)

  const expiring = await db
    .select()
    .from(projects)
    .where(
      and(
        isNotNull(projects.supportExpiryDate),
        gte(projects.supportExpiryDate!, now),
        lte(projects.supportExpiryDate!, in30),
        eq(projects.status, 'completed'),
      ),
    )

  const admins = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.isActive, true))

  let count = 0
  for (const project of expiring) {
    for (const admin of admins) {
      await db.insert(notifications).values({
        userId: admin.id,
        type: 'support_expiry',
        title: 'Support Expiry Approaching',
        body: `Support for "${project.name}" expires on ${project.supportExpiryDate?.toLocaleDateString('en-KE')}.`,
        projectId: project.id,
        actionUrl: `/admin/projects/${project.id}`,
      })
      count++
    }
  }

  return NextResponse.json({ notified: count })
}
