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
  '/',
  requireAuth,
  // roleCheck([Roles.WL_ADMIN]),
  // checkPermission(PERMISSIONS.EMPLOYEES_CREATE),
  EmployeeController.createEmployee
);

router.get(
  '/',
  requireAuth,
  // roleCheck([Roles.WL_ADMIN]),
  // checkPermission(PERMISSIONS.EMPLOYEES_READ),
  EmployeeController.listEmployees
);

router.put(
  '/:id',
  requireAuth,
  // roleCheck([Roles.WL_ADMIN]),
  // checkPermission(PERMISSIONS.EMPLOYEES_UPDATE),
  EmployeeController.updateEmployee
);

router.delete(
  '/:id',
  requireAuth,
  // roleCheck([Roles.WL_ADMIN]),
  // checkPermission(PERMISSIONS.EMPLOYEES_DELETE),
  EmployeeController.deleteEmployee
);



export default router;
