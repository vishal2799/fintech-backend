// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { successHandler } from '../../utils/responseHandler';
import * as AuthService from './auth.service';

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await AuthService.login(email, password);
  return successHandler(res, result, 'Logged in');
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;
  const result = await AuthService.refreshTokens(token);
  return successHandler(res, result, 'Token refreshed');
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;
  await AuthService.logout(token);
  return successHandler(res, null, 'Logged out');
});

