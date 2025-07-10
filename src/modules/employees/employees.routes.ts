// src/routes/employees.routes.ts
import { Router } from 'express';
import * as EmployeeController from './employees.controller';
import { Roles } from '../../constants/roles';
import { PERMISSIONS } from '../../constants/permissions';
import { roleCheck } from '../../middlewares/roleCheck';
import { requireAuth } from '../../middlewares/requireAuth';
import { checkPermission } from '../../middlewares/permissions';

const router = Router();

router.post(
  '/admin/employees',
  requireAuth,
  roleCheck([Roles.WL_ADMIN]),
  checkPermission(PERMISSIONS.EMPLOYEES_CREATE),
  EmployeeController.createEmployee
);

router.get(
  '/admin/employees',
  requireAuth,
  roleCheck([Roles.WL_ADMIN]),
  checkPermission(PERMISSIONS.EMPLOYEES_READ),
  EmployeeController.listEmployees
);

router.put(
  '/admin/employees/:id',
  requireAuth,
  roleCheck([Roles.WL_ADMIN]),
  checkPermission(PERMISSIONS.EMPLOYEES_UPDATE),
  EmployeeController.updateEmployee
);

router.delete(
  '/admin/employees/:id',
  requireAuth,
  roleCheck([Roles.WL_ADMIN]),
  checkPermission(PERMISSIONS.EMPLOYEES_DELETE),
  EmployeeController.deleteEmployee
);



export default router;
