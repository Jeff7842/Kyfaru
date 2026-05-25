// ============================================================
// KYFARU ADMIN — Drizzle database client
// Uses Neon's serverless driver. Works in Edge + Node.
// ============================================================

import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

if (!process.env.DATABASE_URL) {
  // Avoid throwing during edge build; warn only.
  console.warn('[kyfaru-admin] DATABASE_URL is not set. DB calls will fail.')
}

const sql = neon(process.env.DATABASE_URL ?? 'postgres://invalid')
export const db = drizzle(sql, { schema })

export { schema }
