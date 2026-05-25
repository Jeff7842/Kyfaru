import type { Config } from 'drizzle-kit'
import * as fs from 'fs'
import * as path from 'path'

// Load .env.local so drizzle-kit picks up DATABASE_URL when run via CLI
const envLocalPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envLocalPath)) {
  for (const line of fs.readFileSync(envLocalPath, 'utf8').split('\n')) {
    const [k, ...rest] = line.split('=')
    if (k && !k.startsWith('#') && !process.env[k.trim()]) {
      process.env[k.trim()] = rest.join('=').trim()
    }
  }
}

export default {
  schema: './lib/admin/db/schema.ts',
  out: './lib/admin/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
  strict: false,
  verbose: true,
} satisfies Config
