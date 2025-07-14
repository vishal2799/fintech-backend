// src/services/tenant/tenant.service.ts
import { db } from '../../db';
import { tenants } from '../../db/schema';
import { asc, desc, eq, ilike, sql } from 'drizzle-orm';
import { AppError } from '../../utils/AppError';

export const createTenant = async (data: {
  name: string;
  slug: string;
  logoUrl?: string;
  themeColor?: string;
}) => {
  const existing = await db.query.tenants.findFirst({ where: eq(tenants.slug, data.slug) });
  if (existing) throw new AppError('Slug already exists', 400);

  const result = await db.insert(tenants).values(data).returning();
  return result[0];
};

export const listTenants = async ({
  page,
  perPage,
}: {
  page: number;
  perPage: number;
}) => {
  const offset = (page - 1) * perPage;

  // concurrent query & total‑count
  const [rows, [{ count }]] = await Promise.all([
    db.select().from(tenants).limit(perPage).offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(tenants),
  ]);

  return {
    data: rows,
    total: Number(count),
    page,
    perPage,
    totalPages: Math.ceil(Number(count) / perPage),
  };
};

export const updateTenant = async (id: string, updates: Partial<typeof tenants.$inferInsert>) => {
  const allowedFields = ['name', 'slug', 'logoUrl', 'themeColor', 'domainCname', 'status'];

const payload = Object.fromEntries(
  Object.entries(updates).filter(([key, val]) =>
    allowedFields.includes(key) && val !== undefined && val !== ''
  )
) as Partial<typeof tenants.$inferInsert>;


  const [updated] = await db.update(tenants).set({ ...payload, updatedAt: new Date() }).where(eq(tenants.id, id)).returning();
    return updated
  // return { message: 'Tenant updated' };
};


export const listAllTenants = async () => {
  return await db.select().from(tenants);
};

type TenantSortKey = 'name' | 'slug' | 'status' | 'createdAt';

export const listTenantsAdvanced = async ({
  page = 1,
  perPage = 10,
  q = '',
  sortBy = 'name',
  sortDir = 'asc'
}: {
  page?: number;
  perPage?: number;
  q?: string;
  sortBy?: TenantSortKey;
  sortDir?: 'asc' | 'desc';
}) => {
  const offset = (page - 1) * perPage;
  const safeSortBy: TenantSortKey = ['name', 'slug', 'status', 'createdAt'].includes(sortBy as TenantSortKey)
    ? (sortBy as TenantSortKey)
    : 'name';
  const safeSortDir = sortDir === 'desc' ? 'desc' : 'asc';

  // Map string to actual column object
  const sortColumns: Record<TenantSortKey, typeof tenants.name | typeof tenants.slug | typeof tenants.status | typeof tenants.createdAt> = {
    name: tenants.name,
    slug: tenants.slug,
    status: tenants.status,
    createdAt: tenants.createdAt,
  };
  const sortColumn = sortColumns[safeSortBy];

  const whereClause = q
    ? ilike(tenants.name, `%${q.toLowerCase()}%`)
    : undefined;

  const [rows, [{ count }]] = await Promise.all([
    db
      .select()
      .from(tenants)
      .where(whereClause)
      .orderBy(
        safeSortDir === 'asc'
          ? asc(sortColumn)
          : desc(sortColumn)
      )
      .limit(perPage)
      .offset(offset),

    db
      .select({ count: sql<number>`count(*)` })
      .from(tenants)
      .where(whereClause)
  ]);

  return {
    data: rows,
    total: Number(count),
    page,
    perPage,
    totalPages: Math.ceil(Number(count) / perPage)
  };
};

// export const listTenantsAdvanced = async ({
//   page,
//   perPage,
//   sortBy,
//   sortDir,
//   search
// }: {
//   page: number;
//   perPage: number;
//   sortBy?: string;
//   sortDir?: 'asc' | 'desc';
//   search?: string;
// }) => {
//   const offset = (page - 1) * perPage;

//   const baseQuery = db.select().from(tenants);
//   if (search) baseQuery.where(ilike(tenants.name, `%${search}%`));

//   if (sortBy) {
//     const validColumns = ['id', 'name', 'slug', 'logoUrl', 'themeColor', 'status']; // update with actual column names
//     if (validColumns.includes(sortBy)) {
//       baseQuery.orderBy(
//         sortDir === 'desc'
//           ? desc((tenants as any)[sortBy])
//           : asc((tenants as any)[sortBy])
//       );
//     }
//   }

//   const [rows, [{ count }]] = await Promise.all([
//     baseQuery.limit(perPage).offset(offset),
//     db.select({ count: sql<number>`count(*)` }).from(tenants)
//   ]);

//   return {
//     data: rows,
//     total: Number(count),
//     page,
//     perPage,
//     totalPages: Math.ceil(Number(count) / perPage)
//   };
// };

