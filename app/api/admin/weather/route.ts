import { NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { getForecast } from '@/lib/admin/weather'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ forecast: [] }, { status: 401 })
  const forecast = await getForecast()
  return NextResponse.json({ forecast })
}
