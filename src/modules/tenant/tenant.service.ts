// src/services/tenant/tenant.service.ts
import { db } from '../../db';
import { tenants } from '../../db/schema';
import { eq } from 'drizzle-orm';
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

export const listTenants = async () => {
  return await db.query.tenants.findMany();
};

export const updateTenant = async (id: string, updates: Partial<typeof tenants.$inferInsert>) => {
  await db.update(tenants).set(updates).where(eq(tenants.id, id));
  return { message: 'Tenant updated' };
};
