// src/controllers/roles.controller.ts

import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';
import { db } from '../../db';
import { permissions, rolePermissions, roles } from '../../db/schema';
import { and, eq } from 'drizzle-orm';

export const createTenantRoleWithPermissions = async (req: Request, res: Response) => {
  const { name, description, permissionIds } = req.body;
  const tenantId = req.user?.tenantId;

  if (!tenantId) {
    res.status(403).json({ message: 'Invalid tenant context' });
    return
  }
  // Check if role already exists in this tenant
 const existing = await db.query.roles.findFirst({
  where: (r, { eq, and }) => and(eq(r.name, name), eq(r.tenantId, tenantId))
});


  if (existing) {
    res.status(400).json({ message: 'Role already exists' });
    return
  }

  // Insert role
  const roleId = uuidv4();
  await db.insert(roles).values({
    id: roleId,
    name,
    description,
    scope: 'TENANT',
    tenantId
  });

  // Insert role-permissions
  if (Array.isArray(permissionIds) && permissionIds.length > 0) {
    await db.insert(rolePermissions).values(
      permissionIds.map((permId) => ({
        id: uuidv4(),
        roleId,
        permissionId: permId
      }))
    );
  }

  res.status(201).json({ message: 'Role created', roleId });
};

export const listTenantRoles = async (req: Request, res: Response) => {
  const tenantId = req.user?.tenantId;

  if (!tenantId) {
    res.status(403).json({ message: 'Invalid tenant context' });
    return 
  }
  const result = await db.query.roles.findMany({
    where: and(eq(roles.scope, 'TENANT'), eq(roles.tenantId, tenantId))
  });

  res.status(200).json({ roles: result });
};

export const getPermissionsForRole = async (req: Request, res: Response) => {
  const { roleId } = req.params;

  const assigned = await db
    .select({
      id: permissions.id,
      name: permissions.name,
      module: permissions.module,
      description: permissions.description
    })
    .from(rolePermissions)
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(eq(rolePermissions.roleId, roleId));

  res.json({ permissions: assigned });
};

export const updateRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;

  await db.update(roles)
    .set({ name, description })
    .where(eq(roles.id, id));

  res.json({ message: 'Role updated' });
};

export const deleteRole = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Delete associated permissions
  await db.delete(rolePermissions).where(eq(rolePermissions.roleId, id));

  // Delete role
  await db.delete(roles).where(eq(roles.id, id));

  res.json({ message: 'Role deleted' });
};

export const updateRolePermissions = async (req: Request, res: Response) => {
  const { roleId } = req.params;
  const { permissionIds } = req.body;

  if (!Array.isArray(permissionIds)) {
    res.status(400).json({ message: 'Invalid permissionIds' });
    return
  }

  // 1. Delete existing permissions
  await db.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId));

  // 2. Insert new permissions
  if (permissionIds.length > 0) {
    await db.insert(rolePermissions).values(
      permissionIds.map((permissionId: string) => ({
        id: uuidv4(),
        roleId,
        permissionId
      }))
    );
  }

  res.json({ message: 'Permissions updated successfully' });
};