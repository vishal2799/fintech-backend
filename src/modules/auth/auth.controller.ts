import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { successHandler } from '../../utils/responseHandler';
import * as AuthService from './auth.service';
import {
  LoginInput,
  RefreshInput,
  LogoutInput,
} from './auth.schema';
import { AUTH_RESPONSE } from '../../constants/responseMessages';

export const login = asyncHandler(async (req: Request<{}, {}, LoginInput>, res: Response) => {
  const result = await AuthService.login(req.body);
  return successHandler(res, { data: result, ...AUTH_RESPONSE.LOGIN_SUCCESS });
});

export const refresh = asyncHandler(async (req: Request<{}, {}, RefreshInput>, res: Response) => {
  const result = await AuthService.refreshTokens(req.body);
  return successHandler(res, { data: result, ...AUTH_RESPONSE.REFRESH_SUCCESS });
});

export const logout = asyncHandler(async (req: Request<{}, {}, LogoutInput>, res: Response) => {
  await AuthService.logout(req.body);
  return successHandler(res, { data: null, ...AUTH_RESPONSE.LOGOUT_SUCCESS });
});
