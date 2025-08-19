import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { successHandler } from '../../utils/responseHandler';
import * as UserService from '../users/users.service';
import { hashPassword } from '../../utils/hash';
import { AppError } from '../../utils/AppError';
import type { CreateEmployeeInput, UpdateEmployeeInput } from './employees.schema';
import { ERRORS } from '../../constants/errorCodes';
import { generateUsername } from '../../utils/generateUsername';

/**
 * GET /admin/employees
 */
export const listEmployees = asyncHandler(async (req: Request, res: Response) => {
  const tenantId = req.user?.tenantId;
  if (!tenantId) throw new AppError(ERRORS.INVALID_TENANT);

  const employees = await UserService.getUsersByStaticRole(tenantId, 'EMPLOYEE');
  return successHandler(res, { data: employees, message: 'Employees fetched successfully', status: 200 });
});

/**
 * POST /admin/employees
 */
export const createEmployee = asyncHandler(async (req: Request, res: Response) => {
  const data = (req as any).validated as CreateEmployeeInput;
  const tenantId = req.user?.tenantId;
  const parentId = req.user?.id;
  const subdomain = (req as any).tenant;

  if (!tenantId) throw new AppError(ERRORS.INVALID_TENANT);

  const passwordHash = await hashPassword(data.password);
  const username = generateUsername("EMPLOYEE", subdomain);

  await UserService.createUserWithRole({
    tenantId,
    parentId,
    username,
    name: data.name,
    email: data.email,
    mobile: data.mobile,
    passwordHash,
    isEmployee: true,
    roleId: data.roleId,
  });

  return successHandler(res, { data: null, message: 'Employee created successfully', status: 201 });
});

/**
 * PATCH /admin/employees/:id
 */
export const updateEmployee = asyncHandler(async (req: Request, res: Response) => {
  const data = (req as any).validated as UpdateEmployeeInput;
  const { id } = req.params;

  const updated = await UserService.updateUserWithRole({
    id,
    name: data.name,
    email: data.email,
    mobile: data.mobile,
    roleId: data.roleId,
    isEmployee: true,
  });

  return successHandler(res, { data: updated, message: 'Employee updated successfully', status: 200 });
});

/**
 * DELETE /admin/employees/:id
 */
export const deleteEmployee = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  await UserService.deleteUser(id);
  return successHandler(res, { data: null, message: 'Employee deleted successfully', status: 200 });
});
