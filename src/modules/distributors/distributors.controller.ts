// routes/wlAdmin/distributors.controller.ts
import { Request, Response } from 'express';
import * as UserService from '../users/users.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { successHandler } from '../../utils/responseHandler';
import { Roles } from '../../constants/roles';
import { hashPassword } from '../../utils/hash';

export const listDistributors = asyncHandler(async (req: Request, res: Response) => {
  const tenantId = req.user?.tenantId!;
  const users = await UserService.getUsersByRole(tenantId, Roles.D);
  return successHandler(res, users);
});

export const createDistributor = asyncHandler(async (req: Request, res: Response) => {
  const tenantId = req.user?.tenantId!;
  const { name, email, mobile, password, parentId } = req.body;

  const passwordHash = await hashPassword(password);
  const result = await UserService.createUserWithRole({
    tenantId,
    parentId,
    name,
    email,
    mobile,
    passwordHash,
    role: Roles.D,
  });

  return successHandler(res, result, 'Distributor created', 201);
});

export const updateDistributor = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = await UserService.updateUserBasic(id, req.body);
  return successHandler(res, updated, 'Distributor updated');
});

export const deleteDistributor = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = await UserService.deleteUser(id);
  return successHandler(res, deleted, 'Distributor deleted');
});
