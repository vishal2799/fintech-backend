import { Router } from 'express';
import { requireAuth } from '../../middlewares/requireAuth';
import { roleCheck } from '../../middlewares/roleCheck';
import { Roles } from '../../constants/roles';
import { TenantServiceConfigController } from './tenantServiceConfig.controller';

const router = Router();

router.use(requireAuth, roleCheck([Roles.SUPER_ADMIN]));

router.get('/:tenantId', TenantServiceConfigController.getTenantServices);
router.put('/:tenantId', TenantServiceConfigController.updateTenantServices);

export default router;
