// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { successHandler } from '../../utils/responseHandler';
import * as AuthService from './auth.service';

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await AuthService.login(email, password);
  return successHandler(res, {data: result, message: 'Logged-In successfully', status: 200});
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;
  const result = await AuthService.refreshTokens(token);
  return successHandler(res, {data: result, message: 'Token refreshed successfully', status: 200});
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;
  await AuthService.logout(token);
  return successHandler(res, {data: null, message: 'Logged-Out successfully', status: 200});
});

