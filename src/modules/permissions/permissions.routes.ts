import { Router } from 'express';
import * as PermissionController from './permissions.controller';
import {
  createPermissionSchema,
  updatePermissionSchema,
} from './permissions.schema';
import { Roles } from '../../constants/roles';
import { requireAuth } from '../../middlewares/requireAuth';
import { validate } from '../../middlewares/validate';
import { roleCheck } from '../../middlewares/roleCheck';
import { checkPermission } from '../../middlewares/permissions';
import { PERMISSIONS } from '../../constants/permissions';
import { AUDIT_ACTIONS, AUDIT_MODULES } from '../../constants/audit.constants';
import { withAuditContext } from '../../middlewares/auditContext';

const router = Router();

// Require SUPER_ADMIN to access permissions module
router.use(requireAuth, roleCheck([Roles.SUPER_ADMIN, Roles.EMPLOYEE]));

// GET /permissions
router.get('/', 
  checkPermission(PERMISSIONS.PERMISSIONS_READ, [Roles.SUPER_ADMIN]), 
  withAuditContext(AUDIT_MODULES.PERMISSION, AUDIT_ACTIONS.VIEW_PERMISSION),
  PermissionController.getAllPermissions);

// POST /permissions
router.post(
  '/',
  checkPermission(PERMISSIONS.PERMISSIONS_CREATE, [Roles.SUPER_ADMIN]), 
  withAuditContext(AUDIT_MODULES.PERMISSION, AUDIT_ACTIONS.CREATE_PERMISSION),
  validate(createPermissionSchema),
  PermissionController.createPermission
);

// PATCH /permissions/:id
router.patch(
  '/:id',
  checkPermission(PERMISSIONS.PERMISSIONS_UPDATE, [Roles.SUPER_ADMIN]), 
  withAuditContext(AUDIT_MODULES.PERMISSION, AUDIT_ACTIONS.UPDATE_PERMISSION),
  validate(updatePermissionSchema),
  PermissionController.updatePermission
);

// DELETE /permissions/:id
router.delete('/:id', 
  checkPermission(PERMISSIONS.PERMISSIONS_DELETE, [Roles.SUPER_ADMIN]), 
  withAuditContext(AUDIT_MODULES.PERMISSION, AUDIT_ACTIONS.DELETE_PERMISSION),
  PermissionController.deletePermission);

export default router;
