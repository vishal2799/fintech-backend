// src/services/roles.service.ts
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../db';
import { permissions, rolePermissions, roles } from '../../db/schema';
import { and, eq, inArray } from 'drizzle-orm';
import { AppError } from '../../utils/AppError';


export const createRoleWithPermissions = async (req: any) => {
  const { name, description, permissionIds, scope } = req.body;
  const tenantId = req.user?.tenantId;
  const isPlatformUser = req.user?.roleNames?.includes('SUPER_ADMIN');

  if (!tenantId) throw new AppError('Invalid tenant context', 403);

  const roleScope = scope || (isPlatformUser ? 'PLATFORM' : 'TENANT');

  const existing = await db.query.roles.findFirst({
    where: and(eq(roles.name, name), eq(roles.tenantId, tenantId)),
  });
  if (existing) throw new AppError('Role already exists', 400);

  // Validate permission scope
  const foundPermissions = await db.query.permissions.findMany({
    where: inArray(permissions.id, permissionIds),
  });

  const invalidPerms = foundPermissions.filter((p) => {
    return roleScope === 'PLATFORM'
      ? !(p.scope === 'PLATFORM' || p.scope === 'BOTH')
      : !(p.scope === 'TENANT' || p.scope === 'BOTH');
  });

  if (invalidPerms.length > 0) {
    throw new AppError(
      `Invalid permission scopes for ${roleScope}: ${invalidPerms.map(p => p.name).join(', ')}`,
      400
    );
  }

  const roleId = uuidv4();

  await db.insert(roles).values({
    id: roleId,
    name,
    description,
    scope: roleScope,
    tenantId,
  });

  if (permissionIds?.length > 0) {
    await db.insert(rolePermissions).values(
      permissionIds.map((permId: string) => ({
        id: uuidv4(),
        roleId,
        permissionId: permId,
      }))
    );
  }

  return { roleId };
};

export const listRoles = async (req: any) => {
  const tenantId = req.user?.tenantId;
  if (!tenantId) throw new AppError('Invalid tenant context', 403);

  return await db.query.roles.findMany({
    where: eq(roles.tenantId, tenantId),
  });
};

export const getPermissionsForRole = async (roleId: string) => {
  return await db
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

export const updateRole = async (
  roleId: string,
  data: { name?: string; description?: string }
) => {
  const [updated] = await db.update(roles)
    .set(data)
    .where(eq(roles.id, roleId))
    .returning();

  if (!updated) throw new AppError('Role not found', 404);
  return updated;
};

export const deleteRole = async (roleId: string) => {
  await db.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId));
  const [deleted] = await db.delete(roles).where(eq(roles.id, roleId)).returning();

  if (!deleted) throw new AppError('Role not found', 404);
  return deleted;
};

export const updateRolePermissions = async (req: any, roleId: string, permissionIds: string[]) => {
  const tenantId = req.user?.tenantId;
  const isPlatformUser = req.user?.roleNames?.includes('SUPER_ADMIN');

  if (!tenantId) throw new AppError('Invalid tenant context', 403);

  const role = await db.query.roles.findFirst({ where: eq(roles.id, roleId) });
  if (!role) throw new AppError('Role not found', 404);

  const roleScope = role.scope;

  // Validate new permissions
  const foundPermissions = await db.query.permissions.findMany({
    where: inArray(permissions.id, permissionIds),
  });

  const invalidPerms = foundPermissions.filter((p) => {
    return roleScope === 'PLATFORM'
      ? !(p.scope === 'PLATFORM' || p.scope === 'BOTH')
      : !(p.scope === 'TENANT' || p.scope === 'BOTH');
  });

  if (invalidPerms.length > 0) {
    throw new AppError(
      `Invalid permission scopes for ${roleScope}: ${invalidPerms.map(p => p.name).join(', ')}`,
      400
    );
  }

  await db.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId));

  if (permissionIds.length > 0) {
    await db.insert(rolePermissions).values(
      permissionIds.map((permissionId) => ({
        id: uuidv4(),
        roleId,
        permissionId,
      }))
    );
  }

  return { message: 'Permissions updated' };
};


// export const createRoleWithPermissions = async (req: any) => {
//   const { name, description, permissionIds, scope = 'TENANT' } = req.body;
//   const tenantId = req.user?.tenantId;

//   if (!tenantId) throw new AppError('Invalid tenant context', 403);

//   const existing = await db.query.roles.findFirst({
//     where: and(eq(roles.name, name), eq(roles.tenantId, tenantId))
//   });

//   if (existing) throw new AppError('Role already exists', 400);

//   const roleId = uuidv4();

//   await db.insert(roles).values({
//     id: roleId,
//     name,
//     description,
//     scope, // 'PLATFORM' or 'TENANT'
//     tenantId
//   });

//   if (Array.isArray(permissionIds) && permissionIds.length > 0) {
//     await db.insert(rolePermissions).values(
//       permissionIds.map((permId: string) => ({
//         id: uuidv4(),
//         roleId,
//         permissionId: permId
//       }))
//     );
//   }

//   return { roleId };
// };

// export const listRoles = async (req: any) => {
//   const tenantId = req.user?.tenantId;
//   if (!tenantId) throw new AppError('Invalid tenant context', 403);

//   return await db.query.roles.findMany({
//     where: eq(roles.tenantId, tenantId)
//   });
// };

// export const getPermissionsForRole = async (roleId: string) => {
//   return await db
//     .select({
//       id: permissions.id,
//       name: permissions.name,
//       module: permissions.module,
//       description: permissions.description
//     })
//     .from(rolePermissions)
//     .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
//     .where(eq(rolePermissions.roleId, roleId));
// };

// export const updateRole = async (
//   roleId: string,
//   data: { name?: string; description?: string }
// ) => {
//   const [updated] = await db.update(roles)
//     .set(data)
//     .where(eq(roles.id, roleId))
//     .returning();

//   if (!updated) throw new AppError('Role not found', 404);
//   return updated;
// };

// export const deleteRole = async (roleId: string) => {
//   await db.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId));
//   const [deleted] = await db.delete(roles).where(eq(roles.id, roleId)).returning();

//   if (!deleted) throw new AppError('Role not found', 404);
//   return deleted;
// };

// export const updateRolePermissions = async (roleId: string, permissionIds: string[]) => {
//   if (!Array.isArray(permissionIds)) throw new AppError('Invalid permissionIds', 400);

//   await db.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId));

//   if (permissionIds.length > 0) {
//     await db.insert(rolePermissions).values(
//       permissionIds.map((permissionId) => ({
//         id: uuidv4(),
//         roleId,
//         permissionId
//       }))
//     );
//   }

//   return { message: 'Permissions updated' };
// };


// export const createTenantRoleWithPermissions = async (req: any) => {
//   const { name, description, permissionIds } = req.body;
//   const tenantId = req.user?.tenantId;

//   if (!tenantId) throw new AppError('Invalid tenant context', 403);

//   const existing = await db.query.roles.findFirst({
//     where: (r, { eq, and }) => and(eq(r.name, name), eq(r.tenantId, tenantId))
//   });

//   if (existing) throw new AppError('Role already exists', 400);

//   const roleId = uuidv4();

//   await db.insert(roles).values({
//     id: roleId,
//     name,
//     description,
//     scope: 'TENANT',
//     tenantId
//   });

//   if (Array.isArray(permissionIds) && permissionIds.length > 0) {
//     await db.insert(rolePermissions).values(
//       permissionIds.map((permId: string) => ({
//         id: uuidv4(),
//         roleId,
//         permissionId: permId
//       }))
//     );
//   }

//   return { roleId };
// };

// export const listTenantRoles = async (req: any) => {
//   const tenantId = req.user?.tenantId;
//   if (!tenantId) throw new AppError('Invalid tenant context', 403);

//   return await db.query.roles.findMany({
//     where: and(eq(roles.scope, 'TENANT'), eq(roles.tenantId, tenantId))
//   });
// };

// export const getPermissionsForRole = async (roleId: string) => {
//   return await db
//     .select({
//       id: permissions.id,
//       name: permissions.name,
//       module: permissions.module,
//       description: permissions.description
//     })
//     .from(rolePermissions)
//     .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
//     .where(eq(rolePermissions.roleId, roleId));
// };

// export const updateRole = async (id: string, data: { name?: string; description?: string }) => {
//   await db.update(roles)
//     .set(data)
//     .where(eq(roles.id, id));
// };

// export const deleteRole = async (id: string) => {
//   await db.delete(rolePermissions).where(eq(rolePermissions.roleId, id));
//   await db.delete(roles).where(eq(roles.id, id));
// };

// export const updateRolePermissions = async (roleId: string, permissionIds: string[]) => {
//   if (!Array.isArray(permissionIds)) {
//     throw new AppError('Invalid permissionIds', 400);
//   }

//   await db.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId));

//   if (permissionIds.length > 0) {
//     await db.insert(rolePermissions).values(
//       permissionIds.map((permissionId) => ({
//         id: uuidv4(),
//         roleId,
//         permissionId
//       }))
//     );
//   }
// };
