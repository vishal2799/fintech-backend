// src/controllers/adminUsers.controller.ts
import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { successHandler } from '../../utils/responseHandler';
import * as AdminUserService from './users.service';

export const createWLAdminUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await AdminUserService.createWLAdminUser(req.body);
  return successHandler(res, result, result.message);
});
