import { db } from '../../db';
import { permissions } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { AppError } from '../../utils/AppError';
import { ERRORS } from '../../constants/errorCodes';
import type { PermissionScope } from './permissions.types';

/**
 * List all permissions. Optional: filter by scope.
 */
export const getAllPermissions = async (scope?: PermissionScope) => {
  if (scope) {
    return db.select().from(permissions).where(eq(permissions.scope, scope));
  }
  return db.select().from(permissions);
};

/**
 * Create a permission (name must be unique).
 */
export const createPermission = async (data: {
  name: string;
  module: string;
  description?: string;
  scope: PermissionScope;
}) => {
  const existing = await db.query.permissions.findFirst({
    where: eq(permissions.name, data.name),
  });

  if (existing) throw new AppError(ERRORS.PERMISSION_EXISTS);

  const [created] = await db.insert(permissions).values(data).returning();
  return created;
};

/**
 * Update an existing permission.
 */
export const updatePermission = async (
  id: string,
  updates: Partial<typeof permissions.$inferInsert>
) => {
  const { createdAt, ...sanitized } = updates;

  const [updated] = await db
    .update(permissions)
    .set({ ...sanitized })
    .where(eq(permissions.id, id))
    .returning();

  if (!updated) throw new AppError(ERRORS.PERMISSION_NOT_FOUND);
  return updated;
};

/**
 * Delete a permission (soft-delete optional).
 */
export const deletePermission = async (id: string) => {
  const result = await db.delete(permissions).where(eq(permissions.id, id));
  if (!result.rowCount) throw new AppError(ERRORS.PERMISSION_NOT_FOUND);

  return { id };
};
