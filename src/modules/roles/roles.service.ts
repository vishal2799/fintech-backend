// src/services/roles.service.ts
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../db';
import { permissions, rolePermissions, roles } from '../../db/schema';
import { and, eq } from 'drizzle-orm';
import { AppError } from '../../utils/AppError';

export const createTenantRoleWithPermissions = async (req: any) => {
  const { name, description, permissionIds } = req.body;
  const tenantId = req.user?.tenantId;

  if (!tenantId) throw new AppError('Invalid tenant context', 403);

  const existing = await db.query.roles.findFirst({
    where: (r, { eq, and }) => and(eq(r.name, name), eq(r.tenantId, tenantId))
  });

  if (existing) throw new AppError('Role already exists', 400);

  const roleId = uuidv4();

  await db.insert(roles).values({
    id: roleId,
    name,
    description,
    scope: 'TENANT',
    tenantId
  });

  if (Array.isArray(permissionIds) && permissionIds.length > 0) {
    await db.insert(rolePermissions).values(
      permissionIds.map((permId: string) => ({
        id: uuidv4(),
        roleId,
        permissionId: permId
      }))
    );
  }

  return { roleId };
};

export const listTenantRoles = async (req: any) => {
  const tenantId = req.user?.tenantId;
  if (!tenantId) throw new AppError('Invalid tenant context', 403);

  return await db.query.roles.findMany({
    where: and(eq(roles.scope, 'TENANT'), eq(roles.tenantId, tenantId))
  });
};

export const getPermissionsForRole = async (roleId: string) => {
  return await db
    .select({
      id: permissions.id,
      name: permissions.name,
      module: permissions.module,
      description: permissions.description
    })
    .from(rolePermissions)
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(eq(rolePermissions.roleId, roleId));
};

export const updateRole = async (id: string, data: { name?: string; description?: string }) => {
  await db.update(roles)
    .set(data)
    .where(eq(roles.id, id));
};

export const deleteRole = async (id: string) => {
  await db.delete(rolePermissions).where(eq(rolePermissions.roleId, id));
  await db.delete(roles).where(eq(roles.id, id));
};

export const updateRolePermissions = async (roleId: string, permissionIds: string[]) => {
  if (!Array.isArray(permissionIds)) {
    throw new AppError('Invalid permissionIds', 400);
  }

  await db.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId));

  if (permissionIds.length > 0) {
    await db.insert(rolePermissions).values(
      permissionIds.map((permissionId) => ({
        id: uuidv4(),
        roleId,
        permissionId
      }))
    );
  }
};
