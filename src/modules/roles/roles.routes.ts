// src/routes/roles.routes.ts

import { Router } from 'express';
import { requireAuth } from '../../middlewares/requireAuth';
import { checkPermission } from '../../middlewares/permissions';
import * as RoleController from './roles.controller';
import { PERMISSIONS } from '../../constants/permissions';
import { validate } from '../../middlewares/validate';
import { createRoleSchema, updateRoleSchema } from './roles.schema';
import { roleCheck } from '../../middlewares/roleCheck';
import { Roles } from '../../constants/roles';
import { withAuditContext } from '../../middlewares/auditContext';
import { AUDIT_ACTIONS, AUDIT_MODULES } from '../../constants/audit.constants';

const router = Router();

router.use(requireAuth, roleCheck([Roles.SUPER_ADMIN, Roles.WL_ADMIN, Roles.EMPLOYEE]));

// GET /roles
router.get('/', 
    checkPermission(PERMISSIONS.ROLES_READ, [Roles.SUPER_ADMIN, Roles.WL_ADMIN]),
    withAuditContext(AUDIT_MODULES.ROLES, AUDIT_ACTIONS.READ_ROLE),
    RoleController.listRoles
);

// GET /roles/:id/permissions
router.get('/:id/permissions', 
    checkPermission(PERMISSIONS.ROLES_READ, [Roles.SUPER_ADMIN, Roles.WL_ADMIN]),
    withAuditContext(AUDIT_MODULES.ROLES, AUDIT_ACTIONS.READ_ROLE),
    RoleController.getRolePermissions
);

// POST /roles
router.post(
  '/',
  checkPermission(PERMISSIONS.ROLES_CREATE, [Roles.SUPER_ADMIN, Roles.WL_ADMIN]),
withAuditContext(AUDIT_MODULES.ROLES, AUDIT_ACTIONS.CREATE_ROLE),
  validate(createRoleSchema),
  RoleController.createRole
);

router.get(
  '/:id',
  checkPermission(PERMISSIONS.ROLES_READ, [Roles.SUPER_ADMIN, Roles.WL_ADMIN]),
  withAuditContext(AUDIT_MODULES.ROLES, AUDIT_ACTIONS.READ_ROLE),
  RoleController.getRoleById
);

// PATCH /roles/:id
router.patch(
  '/:id',
  checkPermission(PERMISSIONS.ROLES_UPDATE, [Roles.SUPER_ADMIN, Roles.WL_ADMIN]),
  withAuditContext(AUDIT_MODULES.ROLES, AUDIT_ACTIONS.UPDATE_ROLE),
  validate(updateRoleSchema),
  RoleController.updateRole
);

// DELETE /roles/:id
router.delete('/:id', 
    checkPermission(PERMISSIONS.ROLES_DELETE, [Roles.SUPER_ADMIN, Roles.WL_ADMIN]),
    withAuditContext(AUDIT_MODULES.ROLES, AUDIT_ACTIONS.DELETE_ROLE),
    RoleController.deleteRole
);

export default router;
