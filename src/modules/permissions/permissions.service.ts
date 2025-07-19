import { db } from '../../db';
import { permissions } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { AppError } from '../../utils/AppError';

/**
 * List all permissions. Optional: filter by scope.
 */
export const getAllPermissions = async (scopeFilter?: 'PLATFORM' | 'TENANT' | 'BOTH') => {
  if (scopeFilter) {
    return db.select().from(permissions).where(eq(permissions.scope, scopeFilter));
  }

  return db.select().from(permissions);
};

/**
 * Create a permission (name must be unique).
 */
export const createPermission = async ({
  name,
  module,
  description,
  scope,
}: {
  name: string;
  module: string;
  description?: string;
  scope: 'PLATFORM' | 'TENANT' | 'BOTH';
}) => {
  const exists = await db.query.permissions.findFirst({
    where: eq(permissions.name, name),
  });

  if (exists) throw new AppError('Permission already exists', 409);

  const [created] = await db
    .insert(permissions)
    .values({ name, module, description, scope })
    .returning();

  return created;
};

/**
 * Update a permission.
 */
export const updatePermission = async (
  id: string,
  updates: Partial<typeof permissions.$inferInsert>
) => {
  const [updated] = await db
    .update(permissions)
    .set(updates)
    .where(eq(permissions.id, id))
    .returning();

  if (!updated) throw new AppError('Permission not found', 404);
  return updated;
};

/**
 * Delete a permission (soft‑delete optional).
 */
export const deletePermission = async (id: string) => {
  const result = await db.delete(permissions).where(eq(permissions.id, id));
  if (!result.rowCount) throw new AppError('Permission not found', 404);
};
