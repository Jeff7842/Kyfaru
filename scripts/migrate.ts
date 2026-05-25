/**
 * Run pending Drizzle migrations against Neon using the HTTP adapter.
 * Usage: pnpm db:migrate
 */
import * as fs from 'fs'
import * as path from 'path'

// Load .env.local
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

import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { migrate } from 'drizzle-orm/neon-http/migrator'

const url = process.env.DATABASE_URL
if (!url) {
  console.error('❌  DATABASE_URL is not set in .env.local')
  process.exit(1)
}

void (async () => {
  const sql = neon(url)
  const db = drizzle(sql)

  console.log('🔄  Running migrations…')
  await migrate(db, { migrationsFolder: './lib/admin/db/migrations' })
  console.log('✅  Migrations complete')
})()
