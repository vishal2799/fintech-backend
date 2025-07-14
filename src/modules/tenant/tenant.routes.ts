// routes/admin/tenant.routes.ts
import { Router } from 'express';
import * as TenantController from './tenant.controller';
import { requireAuth } from '../../middlewares/requireAuth';
import { roleCheck } from '../../middlewares/roleCheck';
import { Roles } from '../../constants/roles';

const router = Router();

// router.get('/all', requireAuth, roleCheck([Roles.SUPER_ADMIN]), TenantController.listTenants);
// router.get('/advanced', requireAuth, roleCheck([Roles.SUPER_ADMIN]), TenantController.listTenantsAdvanced);
router.patch('/:id', requireAuth, roleCheck([Roles.SUPER_ADMIN]), TenantController.updateTenant);
router.get('/', requireAuth, roleCheck([Roles.SUPER_ADMIN]), TenantController.listAllTenants);
router.post('/', requireAuth, roleCheck([Roles.SUPER_ADMIN]), TenantController.createTenant);

export default router;
