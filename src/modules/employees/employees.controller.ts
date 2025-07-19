import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { successHandler } from '../../utils/responseHandler';
import * as UserService from '../users/users.service';
import { hashPassword } from '../../utils/hash';
import { AppError } from '../../utils/AppError';

/**
 * GET /admin/employees
 */
export const listEmployees = asyncHandler(async (req: Request, res: Response) => {
  const tenantId = req.user?.tenantId;
  if (!tenantId) throw new AppError('Invalid tenant context', 403);

  const employees = await UserService.getUsersByStaticRole(tenantId, 'EMPLOYEE');
  return successHandler(res, {data: employees, message: 'Employee Fetched successfully', status: 200});
});

/**
 * POST /admin/employees
 */
export const createEmployee = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, mobile, password, roleId } = req.body;
  const tenantId = req.user?.tenantId;
  const parentId = req.user?.id;

  if (!tenantId) {
    return res.status(403).json({ message: 'Invalid tenant context' });
  }

  const passwordHash = await hashPassword(password);

  await UserService.createUserWithRole({
    tenantId,
    parentId,
    name,
    email,
    mobile,
    passwordHash,
    isEmployee: true,
    roleId,
  });

  return successHandler(res, {
    message: 'Employee created successfully',
    status: 201,
    data: null,
  });
});

/**
 * PATCH /admin/employees/:id
 */
// export const updateEmployee = asyncHandler(async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const { name, email, mobile } = req.body;

//   const updated = await UserService.updateUserBasic(id, { name, email, mobile });
//   return successHandler(res, {data: updated, message: 'Employee Updated successfully', status: 200});
// });

export const updateEmployee = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, mobile, roleId } = req.body;

  const updated = await UserService.updateUserWithRole({
    id,
    name,
    email,
    mobile,
    roleId,
    isEmployee: true,
  });

  return successHandler(res, {
    message: 'Employee updated successfully',
    status: 200,
    data: updated,
  });
});


/**
 * DELETE /admin/employees/:id
 */
export const deleteEmployee = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const deleted = await UserService.deleteUser(id);
  return successHandler(res, {data: null, message: 'Employee Deleted successfully', status: 200});
});
