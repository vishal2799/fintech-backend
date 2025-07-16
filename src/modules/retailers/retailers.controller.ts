import { Request, Response } from 'express';
import * as UserService from '../users/users.service';
import { successHandler } from '../../utils/responseHandler';
import { asyncHandler } from '../../utils/asyncHandler';
import { Roles } from '../../constants/roles';
import { hashPassword } from '../../utils/hash';


export const listRetailers = asyncHandler(async (req: Request, res: Response) => {
  const tenantId = req.user?.tenantId!;
  const users = await UserService.getUsersByRole(tenantId, Roles.R);
  return successHandler(res, users);
});

export const createRetailer = asyncHandler(async (req: Request, res: Response) => {
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
    role: Roles.R,
  });

  return successHandler(res, result, 'Retailer created', 201);
});

export const updateRetailer = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = await UserService.updateUserBasic(id, req.body);
  return successHandler(res, updated, 'Retailer updated');
});

export const deleteRetailer = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = await UserService.deleteUser(id);
  return successHandler(res, deleted, 'Retailer deleted');
});