import { Router } from 'express';
import * as TenantController from './tenant.controller';
import { requireAuth } from '../../middlewares/requireAuth';
import { roleCheck } from '../../middlewares/roleCheck';
import { Roles } from '../../constants/roles';
import { createTenantSchema, updateTenantSchema, updateTenantStatusSchema } from './tenant.schema';
import { validate } from '../../middlewares/validate';
import { AUDIT_ACTIONS, AUDIT_MODULES } from '../../constants/audit.constants';
import { withAuditContext } from '../../middlewares/auditContext';
import { checkPermission } from '../../middlewares/permissions';
import { PERMISSIONS } from '../../constants/permissions';

const router = Router();

router.get('/details', TenantController.getTenantDetails);

router.use(requireAuth, roleCheck([Roles.SUPER_ADMIN, Roles.EMPLOYEE]))

router.get('/',
  checkPermission(PERMISSIONS.TENANTS_READ, [Roles.SUPER_ADMIN]), 
  withAuditContext(AUDIT_MODULES.TENANT, AUDIT_ACTIONS.READ_TENANT),
  TenantController.listAllTenants
);

router.post('/', 
  checkPermission(PERMISSIONS.TENANTS_CREATE, [Roles.SUPER_ADMIN]), 
  withAuditContext(AUDIT_MODULES.TENANT, AUDIT_ACTIONS.CREATE_TENANT),
  validate(createTenantSchema), TenantController.createTenant
);

router.patch('/:id/status',
  checkPermission(PERMISSIONS.TENANTS_UPDATE, [Roles.SUPER_ADMIN]),    
  withAuditContext(AUDIT_MODULES.TENANT, AUDIT_ACTIONS.UPDATE_TENANT_STATUS),
  validate(updateTenantStatusSchema), TenantController.updateTenantStatus
);

router.patch('/:id',  
  checkPermission(PERMISSIONS.TENANTS_UPDATE, [Roles.SUPER_ADMIN]),  
  withAuditContext(AUDIT_MODULES.TENANT, AUDIT_ACTIONS.UPDATE_TENANT),
  validate(updateTenantSchema), TenantController.updateTenant
);



export default router;
