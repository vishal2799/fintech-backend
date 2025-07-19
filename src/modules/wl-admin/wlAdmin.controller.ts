import { Request, Response } from 'express';
import * as UserService from '../users/users.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { successHandler } from '../../utils/responseHandler';
import { hashPassword } from '../../utils/hash';

export const listWLAdmins = asyncHandler(async (req: Request, res: Response) => {
  const tenantId = req.user?.tenantId!;
  const users = await UserService.getUsersByStaticRole(tenantId, 'WL_ADMIN');
  return successHandler(res, users);
});

export const createWLAdmin = asyncHandler(async (req: Request, res: Response) => {
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
    staticRole: 'WL_ADMIN',
  });

  return successHandler(res, result, 'WL Admin created', 201);
});

export const updateWLAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = await UserService.updateUserBasic(id, req.body);
  return successHandler(res, updated, 'WL Admin updated');
});

export const deleteWLAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = await UserService.deleteUser(id);
  return successHandler(res, deleted, 'WL Admin deleted');
});
