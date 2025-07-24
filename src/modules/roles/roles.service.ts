import { v4 as uuidv4 } from 'uuid';
import { db } from '../../db';
import { roles, permissions, rolePermissions } from '../../db/schema';
import { and, eq, inArray } from 'drizzle-orm';
import { AppError } from '../../utils/AppError';
import { ERRORS } from '../../constants/errorCodes';
import type { CreateRoleInput, UpdateRoleInput } from './roles.schema';
import { chunkArray } from '../../utils/chunkArray';

/**
 * List all roles for the current tenant.
 */
export const listRoles = async (tenantId: string) => {
  return db.query.roles.findMany({
    where: eq(roles.tenantId, tenantId),
  });
};

/**
 * Get all permissions for a specific role.
 */
export const getPermissionsForRole = async (roleId: string) => {
  return db
    .select({
      id: permissions.id,
      name: permissions.name,
      module: permissions.module,
      description: permissions.description,
      scope: permissions.scope,
    })
    .from(rolePermissions)
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(eq(rolePermissions.roleId, roleId));
};

/**
 * Create a role with permissions (with scope validation).
 */

export const createRole = async (tenantId: string, input: CreateRoleInput) => {
  const { name, description, scope, permissionIds = [] } = input;

  const existing = await db.query.roles.findFirst({
    where: and(eq(roles.name, name), eq(roles.tenantId, tenantId)),
  });
  if (existing) throw new AppError(ERRORS.ROLE_EXISTS);

  const perms = await db.query.permissions.findMany({
    where: inArray(permissions.id, permissionIds),
  });

  const invalidPerms = perms.filter((p) => {
    return scope === 'PLATFORM'
      ? !(p.scope === 'PLATFORM' || p.scope === 'BOTH')
      : !(p.scope === 'TENANT' || p.scope === 'BOTH');
  });

  if (invalidPerms.length > 0) {
    throw new AppError({
      message: `Invalid permission scopes for ${scope}: ${invalidPerms.map(p => p.name).join(', ')}`,
      status: 400,
    });
  }

  const roleId = uuidv4();

  await db.insert(roles).values({
    id: roleId, // ✅ Fix: assign the generated ID
    name,
    description,
    scope,
    tenantId,
  });

  // ✅ Optional: batch inserts if permissionIds is large
  const values = permissionIds.map((permId) => ({
    id: uuidv4(),
    roleId,
    permissionId: permId,
  }));

const chunks = chunkArray(values, 100);
for (const chunk of chunks) {
  await db.insert(rolePermissions).values(chunk);
}

  return { id: roleId };
};


/**
 * Update a role's basic info and optionally its permissions.
 */
export const updateRole = async (
  tenantId: string,
  roleId: string,
  data: UpdateRoleInput
) => {
  const role = await db.query.roles.findFirst({ where: eq(roles.id, roleId) });
  if (!role) throw new AppError(ERRORS.ROLE_NOT_FOUND);

  if (role.tenantId !== tenantId) {
    throw new AppError({
      message: 'Cannot update role from another tenant',
      status: 403,
      errorCode: 'ANOTHER_TENANT_ROLE',
    });
  }

  const { name, description, permissionIds } = data;

  if (name || description) {
    await db
      .update(roles)
      .set({ ...(name && { name }), ...(description && { description }) })
      .where(eq(roles.id, roleId));
  }

  if (Array.isArray(permissionIds)) {
    const perms = await db.query.permissions.findMany({
      where: inArray(permissions.id, permissionIds),
    });

    const invalidPerms = perms.filter((p) => {
      return role.scope === 'PLATFORM'
        ? !(p.scope === 'PLATFORM' || p.scope === 'BOTH')
        : !(p.scope === 'TENANT' || p.scope === 'BOTH');
    });

    if (invalidPerms.length > 0) {
      throw new AppError({
        message: `Invalid permission scopes for ${role.scope}: ${invalidPerms.map(p => p.name).join(', ')}`,
        status: 400,
      });
    }

    await db.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId));

    if (permissionIds.length > 0) {
      const values = permissionIds.map((permissionId) => ({
        id: uuidv4(),
        roleId,
        permissionId,
      }));

      const chunks = chunkArray(values, 25); // safe chunk size
      for (const chunk of chunks) {
        await db.insert(rolePermissions).values(chunk);
      }
    }
  }

  return { id: roleId };
};


/**
 * Delete a role and associated permissions.
 */
export const deleteRole = async (roleId: string) => {
  await db.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId));
  const [deleted] = await db.delete(roles).where(eq(roles.id, roleId)).returning();

  if (!deleted) throw new AppError(ERRORS.ROLE_NOT_FOUND);
  return deleted;
};

export const getRoleById = async (id: string) => {
  const role = await db.query.roles.findFirst({
    where: eq(roles.id, id),
  });

  if (!role) throw new AppError(ERRORS.ROLE_NOT_FOUND);

  return role;
};
