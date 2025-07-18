import { db } from '../../db';
import { auditLogs } from '../../db/schema/auditLogs';
import { and, desc, eq, ilike, sql } from 'drizzle-orm';

type ListAuditLogParams = {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  search?: string;
  module?: string;
  tenantId?: string;
};

const sortableColumns = {
  createdAt: auditLogs.createdAt,
  activity: auditLogs.activity,
  method: auditLogs.method,
  module: auditLogs.module,
} as const;


export const listAuditLogs = async ({
  page,
  limit,
  sortBy,
  sortOrder,
  search,
  module,
  tenantId,
}: ListAuditLogParams) => {
  const offset = (page - 1) * limit;

  const whereConditions = [];

  if (search) {
    whereConditions.push(
      ilike(auditLogs.activity, `%${search}%`)
    );
  }

  if (module) {
    whereConditions.push(
      ilike(auditLogs.module, `%${module}%`)
    );
  }

  if (tenantId) {
  whereConditions.push(eq(auditLogs.tenantId, tenantId));
}

  const where = whereConditions.length
    ? and(...whereConditions)
    : undefined;

  const totalQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(auditLogs)
    .where(where);

    const orderColumn = sortableColumns[sortBy as keyof typeof sortableColumns] || auditLogs.createdAt;


  const rowsQuery = db
    .select()
    .from(auditLogs)
    .where(where)
    .orderBy(sortOrder === 'asc' ? orderColumn : desc(orderColumn))
    .limit(limit)
    .offset(offset);

  const [totalRes, data] = await Promise.all([
    totalQuery,
    rowsQuery,
  ]);

  return {
    data,
    page,
    limit,
    total: Number(totalRes[0].count),
  };
};
