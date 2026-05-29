import { db } from '@/lib/admin/db'
import { and, count, ilike, or, type SQL, type SQLWrapper } from 'drizzle-orm'
// SQLWrapper used in the args interface below
import type { PgColumn } from 'drizzle-orm/pg-core'

interface PaginatedSearchArgs {
  /** The Drizzle table object. */
  table: any
  /** Text columns to OR-match against the query string. */
  searchColumns: PgColumn[]
  page: number
  pageSize: number
  q?: string
  /** orderBy expression(s), e.g. [desc(table.createdAt)]. */
  orderBy: SQL[]
  /** Optional extra filter ANDed with the search. */
  baseWhere?: SQLWrapper
}

/**
 * Generic server-side paginated search, mirroring the pattern in
 * app/api/admin/users/route.ts. Returns the page rows plus total count.
 */
export async function paginatedSearch<T = Record<string, unknown>>({
  table,
  searchColumns,
  page,
  pageSize,
  q,
  orderBy,
  baseWhere,
}: PaginatedSearchArgs): Promise<{ rows: T[]; total: number; page: number; pageSize: number }> {
  const safePage = Math.max(0, Number(page) || 0)
  const safeSize = Math.min(100, Math.max(1, Number(pageSize) || 20))

  const search =
    q && q.trim() && searchColumns.length
      ? or(...searchColumns.map((c) => ilike(c, `%${q.trim()}%`)))
      : undefined

  const where = (
    baseWhere && search ? and(baseWhere, search) : (baseWhere ?? search ?? undefined)
  ) as SQL | undefined

  const [rows, totalRes] = await Promise.all([
    db
      .select()
      .from(table)
      .where(where)
      .orderBy(...orderBy)
      .limit(safeSize)
      .offset(safePage * safeSize),
    db.select({ value: count() }).from(table).where(where),
  ])

  return { rows: rows as T[], total: totalRes[0]?.value ?? 0, page: safePage, pageSize: safeSize }
}
