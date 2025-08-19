// src/modules/tenant/tenant.service.ts
import { eq } from 'drizzle-orm';
import { tenants } from '../../db/schema';
import { db } from '../../db';
import { AppError } from '../../utils/AppError';
import { ERRORS } from '../../constants/errorCodes';
import * as UserService from '../users/users.service';
import { hashPassword } from '../../utils/hash';
import { Roles } from '../../constants/roles';

type STATUS = 'ACTIVE' | 'DISABLED';

export const createTenant = async (data: {
  name: string;
  slug: string;
  logoUrl?: string;
  themeColor?: string;
}) => {
  const existing = await db.query.tenants.findFirst({ where: eq(tenants.slug, data.slug) });
  if (existing) throw new AppError(ERRORS.SLUG_EXISTS);

  const [tenant] = await db.insert(tenants).values(data).returning();

  // ✅ Auto-create WL Admin for this tenant
  const username = `wladmin_${tenant.slug}`;
  const passwordHash = await hashPassword("ChangeMe123!"); // temp password

  const wladmin = await UserService.createUserWithStaticRole({
    tenantId: tenant.id,
    parentId: null,
    name: username,
    username: username,
    passwordHash,
    mobile: '',
    email: '',
    staticRole: Roles.WL_ADMIN
  })

  return {tenant, wladmin}

  // const [wlAdmin] = await db.insert(users).values({
  //   tenantId: tenant.id,
  //   parentId: null,
  //   name: "WL Admin",
  //   username,
  //   passwordHash,
  //   role: Rol,
  // }).returning();
};

export const updateTenant = async (
  id: string,
  updates: Partial<typeof tenants.$inferInsert>
) => {
  const allowedFields = ['name', 'slug', 'logoUrl', 'themeColor', 'domainCname', 'status'];

  const payload = Object.fromEntries(
    Object.entries(updates).filter(
      ([key, val]) => allowedFields.includes(key) && val !== undefined && val !== ''
    )
  ) as Partial<typeof tenants.$inferInsert>;

  const [updated] = await db
    .update(tenants)
    .set({ ...payload, updatedAt: new Date() })
    .where(eq(tenants.id, id))
    .returning();

  if (!updated) throw new AppError(ERRORS.TENANT_NOT_FOUND);

  return updated;
};

export const updateTenantStatus = async (id: string, status: STATUS) => {
  if (!['ACTIVE', 'DISABLED'].includes(status)) {
    throw new AppError(ERRORS.TENANT_INVALID_STATUS);
  }

  const existing = await db.query.tenants.findFirst({
    where: eq(tenants.id, id),
  });

  if (!existing) throw new AppError(ERRORS.TENANT_NOT_FOUND);

  const result = await db
    .update(tenants)
    .set({ status, updatedAt: new Date() })
    .where(eq(tenants.id, id))
    .returning();

  return result[0];
};

export const listAllTenants = async () => {
  return await db.select().from(tenants);
};
