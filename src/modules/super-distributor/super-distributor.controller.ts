import { Request, Response } from 'express';
import * as UserService from '../users/users.service';
import { Roles } from '../../constants/roles';
import { successHandler } from '../../utils/responseHandler';
import { hashPassword } from '../../utils/hash';
import { asyncHandler } from '../../utils/asyncHandler';

export const listSuperDistributors = asyncHandler(async (req: Request, res: Response) => {
  const tenantId = req.user?.tenantId!;
  const users = await UserService.getUsersByStaticRole(tenantId, Roles.SD);
  return successHandler(res, {data: users, message: 'SD Fetched successfully', status: 200});
});

export const createSuperDistributor = asyncHandler(async (req: Request, res: Response) => {
  const tenantId = req.user?.tenantId!;
  const { name, email, mobile, password } = req.body;

  const passwordHash = await hashPassword(password);
  const result = await UserService.createUserWithStaticRole({
    tenantId,
    parentId: null,
    name,
    email,
    mobile,
    passwordHash,
    staticRole: Roles.SD,
  });

  return successHandler(res, {data: result, message: 'SD Created successfully', status: 201});
});

export const updateSuperDistributor = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = await UserService.updateUserBasic(id, req.body);
    return successHandler(res, {data: updated, message: 'SD Updated successfully', status: 200});
});

export const deleteSuperDistributor = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = await UserService.deleteUser(id);
  return successHandler(res, {data: deleted, message: 'SD Deleted successfully', status: 200});
});
