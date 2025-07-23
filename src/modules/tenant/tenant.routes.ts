import { Router } from 'express';
import * as TenantController from './tenant.controller';
import { requireAuth } from '../../middlewares/requireAuth';
import { roleCheck } from '../../middlewares/roleCheck';
import { Roles } from '../../constants/roles';
import { createTenantSchema, updateTenantSchema, updateTenantStatusSchema } from './tenant.schema';
import { validate } from '../../middlewares/validate';
import { AUDIT_ACTIONS, AUDIT_MODULES } from '../../constants/audit.constants';
import { withAuditContext } from '../../middlewares/auditContext';

const router = Router();

router.use(requireAuth, roleCheck([Roles.SUPER_ADMIN]))

router.get('/', 
  withAuditContext(AUDIT_MODULES.TENANT, AUDIT_ACTIONS.READ_TENANT),
  TenantController.listAllTenants
);

router.post('/', 
  withAuditContext(AUDIT_MODULES.TENANT, AUDIT_ACTIONS.CREATE_TENANT),
  validate(createTenantSchema), TenantController.createTenant
);

router.patch('/:id/status',   
  withAuditContext(AUDIT_MODULES.TENANT, AUDIT_ACTIONS.UPDATE_TENANT_STATUS),
  validate(updateTenantStatusSchema), TenantController.updateTenantStatus
);

router.patch('/:id',   
  withAuditContext(AUDIT_MODULES.TENANT, AUDIT_ACTIONS.UPDATE_TENANT),
  validate(updateTenantSchema), TenantController.updateTenant
);

export default router;
