import { Router } from 'express';
import * as PermissionController from './permissions.controller';
import { requireAuth } from '../../middlewares/requireAuth';
import { checkPermission } from '../../middlewares/permissions';

const router = Router();

router.get(
  '/',
  requireAuth,
  // checkPermission('permissions:read'),
  PermissionController.getAllPermissions
);

router.post(
  '/',
  requireAuth,
  // checkPermission('permissions:create'),
  PermissionController.createPermission
);

router.patch(
  '/:id',
  requireAuth,
  // checkPermission('permissions:update'),
  PermissionController.updatePermission
);

router.delete(
  '/:id',
  requireAuth,
  // checkPermission('permissions:delete'),
  PermissionController.deletePermission
);

export default router;
