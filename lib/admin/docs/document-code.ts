// ============================================================
// Shared Agreement/SOW document code: KY-<Mon><NNNN>, e.g. KY-SE0023.
// One code per project, generated once and reused for both documents.
// ============================================================

import { sql } from 'drizzle-orm'
import { db } from '@/lib/admin/db'
import { projects } from '@/lib/admin/db/schema'
import { eq } from 'drizzle-orm'

const MONTH_CODE = [
  'JA', 'FE', 'MR', 'AP', 'MY', 'JN',
  'JL', 'AU', 'SE', 'OC', 'NO', 'DE',
] as const

export async function getOrCreateDocumentCode(projectId: string): Promise<string> {
  const existing = await db
    .select({ code: projects.documentCode })
    .from(projects)
    .where(eq(projects.id, projectId))
  if (existing[0]?.code) return existing[0].code

  const monthCode = MONTH_CODE[new Date().getMonth()]

  // Atomic: nextval() never repeats under concurrent calls, and the
  // `document_code IS NULL` guard means only one concurrent writer for the
  // same project actually claims a value — losers fall through and re-read.
  const updated = await db.execute<{ document_code: string }>(sql`
    UPDATE ${projects}
    SET document_code = 'KY-' || ${monthCode} || LPAD(nextval('document_code_seq')::text, 4, '0')
    WHERE id = ${projectId} AND document_code IS NULL
    RETURNING document_code
  `)
  if (updated.rows[0]?.document_code) return updated.rows[0].document_code

  // Lost the race to a concurrent request for the same project - read what it wrote.
  const [row] = await db
    .select({ code: projects.documentCode })
    .from(projects)
    .where(eq(projects.id, projectId))
  return row!.code!
}
