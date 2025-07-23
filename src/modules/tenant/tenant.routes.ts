import { Router } from 'express';
import * as TenantController from './tenant.controller';
import { requireAuth } from '../../middlewares/requireAuth';
import { roleCheck } from '../../middlewares/roleCheck';
import { Roles } from '../../constants/roles';
import { createTenantSchema, updateTenantSchema, updateTenantStatusSchema } from './tenant.schema';
import { validate } from '../../middlewares/validate';

const router = Router();

router.use(requireAuth, roleCheck([Roles.SUPER_ADMIN]))

router.get('/', TenantController.listAllTenants);
router.post('/', validate(createTenantSchema), TenantController.createTenant);
router.patch('/:id/status', validate(updateTenantStatusSchema), TenantController.updateTenantStatus);
router.patch('/:id', validate(updateTenantSchema), TenantController.updateTenant);

export default router;
