// routes/admin/tenant.routes.ts
import { Router } from 'express';
import * as TenantController from './tenant.controller';
import { requireAuth } from '../../middlewares/requireAuth';
import { roleCheck } from '../../middlewares/roleCheck';
import { Roles } from '../../constants/roles';

const router = Router();

router.post('/', requireAuth, roleCheck([Roles.SUPER_ADMIN]), TenantController.createTenant);
router.get('/', requireAuth, roleCheck([Roles.SUPER_ADMIN]), TenantController.listTenants);
router.patch('/:id', requireAuth, roleCheck([Roles.SUPER_ADMIN]), TenantController.updateTenant);

export default router;
