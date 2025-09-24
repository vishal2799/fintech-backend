// routes/wlAdmin/distributors.controller.ts
import { Request, Response } from 'express';
import * as UserService from '../users/users.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { successHandler } from '../../utils/responseHandler';
import { Roles } from '../../constants/roles';
import { hashPassword } from '../../utils/hash';
import { generateUsername } from '../../utils/generateUsername';

export const listDistributors = asyncHandler(async (req: Request, res: Response) => {
  const tenantId = req.user?.tenantId!;
  const users = await UserService.getUsersByStaticRole(tenantId, Roles.D);
  return successHandler(res, {data: users, message: 'Distributor Fetched successfully', status: 200});
});

export const listDistributors2 = asyncHandler(async (req: Request, res: Response) => {
  const tenantId = req.user?.tenantId!;
  const superDistributorId = req.user?.id as string | undefined;

    const users = await UserService.getUsersByStaticRole(
    tenantId,
    Roles.D,
    false,
    superDistributorId
  );

  // const users = await UserService.getUsersByStaticRole(tenantId, Roles.D);
  return successHandler(res, {data: users, message: 'Distributor 2 Fetched successfully', status: 200});
});

export const createDistributor = asyncHandler(async (req: Request, res: Response) => {
  const tenantId = req.user?.tenantId!;
    const subdomain = (req as any).tenant;
  const { name, email, mobile, password, parentId } = req.body;

  const passwordHash = await hashPassword(password);
    const username = generateUsername("DISTRIBUTOR", subdomain);

  const result = await UserService.createUserWithStaticRole({
    tenantId,
    parentId,
    username,
    name,
    email,
    mobile,
    passwordHash,
    staticRole: Roles.D,
  });

  return successHandler(res, {data: result, message: 'Distributor Created successfully', status: 201});
});

export const updateDistributor = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = await UserService.updateUserBasic(id, req.body);
  return successHandler(res, {data: updated, message: 'Distributor Updated successfully', status: 200});
});

export const deleteDistributor = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = await UserService.deleteUser(id);
  return successHandler(res, {data: deleted, message: 'Distributor Deleted successfully', status: 200});
});

