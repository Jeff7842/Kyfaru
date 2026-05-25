import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/admin/auth'
import { db } from '@/lib/admin/db'
import { users } from '@/lib/admin/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.redirect(new URL('/admin/login', req.url))

  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  if (!code || !state) {
    return NextResponse.redirect(new URL('/admin/settings?github=error', req.url))
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    })
    const tokenData = await tokenRes.json()
    const accessToken = tokenData.access_token as string | undefined
    if (!accessToken) throw new Error('No access token received')

    const ghUserRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/vnd.github+json' },
    })
    const ghUser = await ghUserRes.json()

    await db
      .update(users)
      .set({
        githubAccessToken: accessToken,
        githubLogin: ghUser.login ?? null,
        githubTokenExpiry: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id as string))

    return NextResponse.redirect(new URL('/admin/settings?github=connected', req.url))
  } catch {
    return NextResponse.redirect(new URL('/admin/settings?github=error', req.url))
  }
}
