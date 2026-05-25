import { NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { requireRole } from '@/lib/admin/permissions'
import type { Role } from '@/lib/admin/permissions'

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  requireRole(session.user.role as Role, 'admin')

  const clientId = process.env.GITHUB_CLIENT_ID
  if (!clientId) {
    return NextResponse.json({ error: 'GITHUB_CLIENT_ID is not set' }, { status: 500 })
  }

  const state = Buffer.from(JSON.stringify({ userId: session.user.id, ts: Date.now() })).toString('base64url')
  const callbackUrl = `${process.env.NEXTAUTH_URL}/api/admin/github/oauth/callback`

  const url = new URL('https://github.com/login/oauth/authorize')
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('redirect_uri', callbackUrl)
  url.searchParams.set('scope', 'repo read:org')
  url.searchParams.set('state', state)

  return NextResponse.redirect(url.toString())
}
