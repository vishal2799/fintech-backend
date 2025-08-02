// backend/src/services/auditLog.service.ts

import { and, ilike, or, sql, asc, desc, type AnyColumn } from 'drizzle-orm'
import { db } from '../../db'
import { auditLogs } from '../../db/schema/auditLogs'
import { Filters, PaginatedData } from './auditLogs.types'

export const listAuditLogs = async (
  filters: Filters<typeof auditLogs.$inferSelect>,
  options?: { exportAll?: boolean }
): Promise<PaginatedData<typeof auditLogs.$inferSelect>> => {
  const {
  sortBy,
  search,
} = filters

const pageIndex = Number(filters.pageIndex) || 0
const pageSize = Number(filters.pageSize) || 10


  const offset = pageIndex * pageSize

  // 🔍 Global search on a few string fields
  const searchConditions = search
    ? or(
        ilike(auditLogs.activity, `%${search}%`),
        ilike(auditLogs.module, `%${search}%`),
        ilike(auditLogs.method, `%${search}%`),
        ilike(auditLogs.url, `%${search}%`),
        ilike(auditLogs.actorType, `%${search}%`)
      )
    : undefined

  // 🔁 Sorting logic
  let orderClause: ReturnType<typeof asc> | ReturnType<typeof desc> = desc(auditLogs.createdAt) // default

  if (sortBy) {
    const [field, direction] = sortBy.split('.') as [string, 'asc' | 'desc']
    const rawCol = auditLogs[field as keyof typeof auditLogs]
    if (rawCol && typeof rawCol === 'object') {
      const column = rawCol as AnyColumn
      orderClause = direction === 'asc' ? asc(column) : desc(column)
    }
  }

  const query = db
    .select()
    .from(auditLogs)
    .where(searchConditions ?? undefined)
    .orderBy(orderClause);

    const rows = await (options?.exportAll
    ? query
    : query.limit(pageSize).offset(pageIndex * pageSize));

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(auditLogs)
    .where(searchConditions ?? undefined);

  return {
    result: rows,
    rowCount: count,
  }
}

  // // 📥 Data query
  // const rows = await db
  //   .select()
  //   .from(auditLogs)
  //   .where(searchConditions ?? undefined)
  //   .orderBy(orderClause)
  //   .limit(5)
  //   .offset(offset)

  // // 📊 Total count query
  // const [{ count }] = await db
  //   .select({ count: sql<number>`count(*)` })
  //   .from(auditLogs)
  //   .where(searchConditions ?? undefined)