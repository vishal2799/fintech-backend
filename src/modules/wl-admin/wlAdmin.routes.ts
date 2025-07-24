import { Router } from 'express';
import * as Controller from './wlAdmin.controller';
import { Roles } from '../../constants/roles';
import { roleCheck } from '../../middlewares/roleCheck';
import { requireAuth } from '../../middlewares/requireAuth';
import { validate } from '../../middlewares/validate';
import { createWLAdminSchema, updateWLAdminSchema, updateWLAdminStatusSchema } from './wlAdmin.schema';
import { checkPermission } from '../../middlewares/permissions';
import { PERMISSIONS } from '../../constants/permissions';
import { withAuditContext } from '../../middlewares/auditContext';
import { AUDIT_ACTIONS, AUDIT_MODULES } from '../../constants/audit.constants';

const router = Router();

router.use(requireAuth, roleCheck([Roles.SUPER_ADMIN, Roles.EMPLOYEE]))

router.get('/', 
    checkPermission(PERMISSIONS.WLADMIN_READ, [Roles.SUPER_ADMIN]), 
    withAuditContext(AUDIT_MODULES.WL_ADMIN, AUDIT_ACTIONS.WLADMIN_VIEW),
    Controller.listWLAdmins
);

router.post('/', 
    checkPermission(PERMISSIONS.WLADMIN_CREATE, [Roles.SUPER_ADMIN]), 
    withAuditContext(AUDIT_MODULES.WL_ADMIN, AUDIT_ACTIONS.WLADMIN_CREATE),
    validate(createWLAdminSchema), Controller.createWLAdmin
);

router.get('/:id', 
    checkPermission(PERMISSIONS.WLADMIN_READ, [Roles.SUPER_ADMIN]), 
    withAuditContext(AUDIT_MODULES.WL_ADMIN, AUDIT_ACTIONS.WLADMIN_VIEW),
    Controller.getWLAdmin
);


router.patch('/:id/status',
  checkPermission(PERMISSIONS.WLADMIN_UPDATE, [Roles.SUPER_ADMIN]),    
  withAuditContext(AUDIT_MODULES.WL_ADMIN, AUDIT_ACTIONS.WLADMIN_STATUS_UPDATE),
  validate(updateWLAdminStatusSchema), Controller.updateWLAdminStatus
);

router.patch('/:id', 
    checkPermission(PERMISSIONS.WLADMIN_UPDATE, [Roles.SUPER_ADMIN]), 
    withAuditContext(AUDIT_MODULES.WL_ADMIN, AUDIT_ACTIONS.WLADMIN_UPDATE),
    validate(updateWLAdminSchema), Controller.updateWLAdmin
);

router.delete('/:id', 
    checkPermission(PERMISSIONS.WLADMIN_DELETE, [Roles.SUPER_ADMIN]), 
    withAuditContext(AUDIT_MODULES.WL_ADMIN, AUDIT_ACTIONS.WLADMIN_DELETE),
    Controller.deleteWLAdmin
);

export default router;