import { Router } from 'express';
import { requireAuth } from '../../middlewares/requireAuth';
import { roleCheck } from '../../middlewares/roleCheck';
import { Roles } from '../../constants/roles';
import { getTenantServices, updateTenantServices } from './wlService.controller';
import { validate } from '../../middlewares/validate';
import { updateTenantServiceSchema } from './wlService.schema';

const router = Router();

router.get('/my', requireAuth, roleCheck([Roles.WL_ADMIN]), getTenantServices);

router.put(
  '/my',
  requireAuth,
  roleCheck([Roles.WL_ADMIN]),
  // validate(updateTenantServiceSchema),
  updateTenantServices
);

export default router
