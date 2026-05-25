// ============================================================
// Seed the first Super Admin. Runs once.
//   pnpm db:seed
// ============================================================

import * as fs from 'fs'
import * as path from 'path'
import bcrypt from 'bcryptjs'

// Load .env.local before any module that reads DATABASE_URL
const envPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[key]) process.env[key] = val
  }
}

async function main() {
  // Dynamic import so DATABASE_URL is available when the db client initialises
  const { db } = await import('../lib/admin/db')
  const { users } = await import('../lib/admin/db/schema')
  const { eq } = await import('drizzle-orm')

  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  const name = process.env.SEED_ADMIN_NAME ?? 'Kyfaru Super Admin'

  if (!email || !password) {
    throw new Error('Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env.local')
  }

  const existing = await db.query.users.findFirst({ where: eq(users.email, email) })
  if (existing) {
    console.log(`Super admin already exists: ${email}`)
    return
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const [admin] = await db
    .insert(users)
    .values({
      email,
      name,
      passwordHash,
      role: 'super_admin',
      isActive: true,
      isTwoFactorEnabled: false,
    })
    .returning()

  console.log(`Created super admin: ${admin.email} (id=${admin.id})`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => process.exit(0))
