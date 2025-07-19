// src/routes/roles.routes.ts

import { Router } from 'express';
import { requireAuth } from '../../middlewares/requireAuth';
import { checkPermission } from '../../middlewares/permissions';
import * as RolesController from './roles.controller';
// import { createTenantRoleWithPermissions, deleteRole, getPermissionsForRole, listTenantRoles, updateRole, updateRolePermissions } from './roles.controller';
import { PERMISSIONS } from '../../constants/permissions';

const router = Router();

// 🔒 All routes require authentication
router.use(requireAuth);

// ✅ Create role (Super Admin or WL Admin)
router.post('/', RolesController.createRole);

// ✅ List roles for current tenant
router.get('/', RolesController.listRoles);

// ✅ Get permissions assigned to a role
router.get('/:roleId/permissions', RolesController.getRolePermissions);

// ✅ Update role with permissions
router.patch('/:id', RolesController.updateRole);

// ✅ Update role permissions
router.patch('/:id/permissions', RolesController.updateRolePermissions);

// ✅ Delete role
router.delete('/:id', RolesController.deleteRole);

// router.post(
//   '/admin/roles',
//   requireAuth,
//   checkPermission(PERMISSIONS.ROLES_CREATE),
//   createTenantRoleWithPermissions
// );

// router.get(
//   '/admin/roles',
//   requireAuth,
//   checkPermission(PERMISSIONS.ROLES_READ),
//   listTenantRoles
// );

// router.get(
//   '/admin/roles/:roleId/permissions',
//   requireAuth,
//   checkPermission(PERMISSIONS.ROLES_READ),
//   getPermissionsForRole
// );


// router.patch(
//   '/admin/roles/:id',
//   requireAuth,
//   checkPermission(PERMISSIONS.ROLES_UPDATE),
//   updateRole
// );

// router.delete(
//   '/admin/roles/:id',
//   requireAuth,
//   checkPermission(PERMISSIONS.ROLES_DELETE),
//   deleteRole
// );

// router.put(
//   '/admin/roles/:roleId/permissions',
//   requireAuth,
//   checkPermission(PERMISSIONS.ROLES_UPDATE),
//   updateRolePermissions
// );


export default router;
