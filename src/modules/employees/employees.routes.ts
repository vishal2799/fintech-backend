// src/routes/employees.routes.ts
import { Router } from 'express';
import * as EmployeeController from './employees.controller';
import { Roles } from '../../constants/roles';
import { PERMISSIONS } from '../../constants/permissions';
import { roleCheck } from '../../middlewares/roleCheck';
import { requireAuth } from '../../middlewares/requireAuth';
import { checkPermission } from '../../middlewares/permissions';
import { withAuditContext } from '../../middlewares/auditContext';
import { AUDIT_ACTIONS, AUDIT_MODULES } from '../../constants/audit.constants';
import { createEmployeeSchema, updateEmployeeSchema } from './employees.schema';
import { validate } from '../../middlewares/validate';

const router = Router();

router.use(requireAuth, roleCheck([Roles.SUPER_ADMIN, Roles.WL_ADMIN, Roles.EMPLOYEE]))

router.post(
  '/',
  checkPermission(PERMISSIONS.EMPLOYEES_CREATE, [Roles.SUPER_ADMIN, Roles.WL_ADMIN]), 
  withAuditContext(AUDIT_MODULES.EMPLOYEE, AUDIT_ACTIONS.CREATE_EMPLOYEE),
  validate(createEmployeeSchema), EmployeeController.createEmployee
);

router.get(
  '/',
  checkPermission(PERMISSIONS.EMPLOYEES_READ, [Roles.SUPER_ADMIN, Roles.WL_ADMIN]), 
  withAuditContext(AUDIT_MODULES.EMPLOYEE, AUDIT_ACTIONS.VIEW_EMPLOYEE),
  EmployeeController.listEmployees
);

router.put(
  '/:id',
  checkPermission(PERMISSIONS.EMPLOYEES_UPDATE, [Roles.SUPER_ADMIN, Roles.WL_ADMIN]), 
  withAuditContext(AUDIT_MODULES.EMPLOYEE, AUDIT_ACTIONS.UPDATE_EMPLOYEE),
  validate(updateEmployeeSchema), EmployeeController.updateEmployee
);

router.delete(
  '/:id',
  checkPermission(PERMISSIONS.EMPLOYEES_DELETE, [Roles.SUPER_ADMIN, Roles.WL_ADMIN]), 
  withAuditContext(AUDIT_MODULES.EMPLOYEE, AUDIT_ACTIONS.DELETE_EMPLOYEE),
  EmployeeController.deleteEmployee
);



export default router;
