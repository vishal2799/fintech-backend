// src/modules/tenantCommissions/tenantCommissions.routes.ts
import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { TenantCommissionsController } from './tenantCommissions.controller';
import {
  getTenantCommissionsSchema,
  getRoleTenantCommissionSchema,
  updateTenantCommissionsSchema,
} from './tenantCommissions.validation';
import { requireAuth } from '../../middlewares/requireAuth';

const router = Router();

// All routes require authentication
router.use(requireAuth);

// Get all tenant commissions for a tenant (WL Admin)
router.get(
  '/',
  TenantCommissionsController.getAll
);

// Get tenant commission for a specific service template
router.get(
  '/:serviceTemplateId',
  validate(getTenantCommissionsSchema, 'params'),
  TenantCommissionsController.getByServiceTemplate
);

// Get tenant commission for a specific role
router.get(
  '/:serviceTemplateId/role/:roleCode',
  validate(getRoleTenantCommissionSchema, 'params'),
  TenantCommissionsController.getByRole
);

// Update tenant commissions for a service template
router.post(
  '/:serviceTemplateId',
  validate(updateTenantCommissionsSchema),
  TenantCommissionsController.update
);

export default router;
