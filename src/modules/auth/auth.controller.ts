import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { successHandler } from '../../utils/responseHandler';
import * as AuthService from './auth.service';
import {
  LoginInput,
  RefreshInput,
  LogoutInput,
  VerifyOtpInput,
} from './auth.schema';
import { AUTH_RESPONSE } from '../../constants/responseMessages';

/**
 * POST /auth/login
 * Accepts email & password, and initiates OTP verification
 */
// export const login = asyncHandler(async (req: Request<{}, {}, LoginInput>, res: Response) => {
export const login = asyncHandler(async (req: Request, res: Response) => {
  const data = (req as any).validated;
  //use in prod
  // const ipAddress =
  // req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
  // req.socket.remoteAddress;

  const ipInfo = {
    ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress || undefined,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    accuracy: req.body.accuracy,
    userAgent: req.headers['user-agent'],
  };

  const result = await AuthService.login({ ...data, ipInfo });
  return successHandler(res, { data: result, ...AUTH_RESPONSE.OTP_SENT });
});

/**
 * POST /auth/verify-otp
 * Verifies OTP and logs in user (returns tokens)
 */
// export const verifyOtpLogin = asyncHandler(async (req: Request<{}, {}, VerifyOtpInput>, res: Response) => {
export const verifyOtpLogin = asyncHandler(async (req: Request, res: Response) => {
  const data = (req as any).validated;
   const ipInfo = {
    ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress || undefined,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    accuracy: req.body.accuracy,
    userAgent: req.headers['user-agent'],
  };

  const result = await AuthService.verifyOtpLogin({ ...data, ipInfo });
  // const result = await AuthService.verifyOtpLogin(data); // returns accessToken, refreshToken
  return successHandler(res, { data: result, ...AUTH_RESPONSE.LOGIN_SUCCESS });
});

/**
 * POST /auth/refresh
 * Issues new accessToken using refreshToken
 */
export const refresh = asyncHandler(async (req: Request<{}, {}, RefreshInput>, res: Response) => {
  const data = (req as any).validated;
  const result = await AuthService.refreshTokens(data);
  return successHandler(res, { data: result, ...AUTH_RESPONSE.REFRESH_SUCCESS });
});

/**
 * POST /auth/logout
 * Revokes refreshToken (deletes session)
 */
export const logout = asyncHandler(async (req: Request<{}, {}, LogoutInput>, res: Response) => {
  const data = (req as any).validated;
  await AuthService.logout(data);
  return successHandler(res, { data: null, ...AUTH_RESPONSE.LOGOUT_SUCCESS });
});


// import { Request, Response } from 'express';
// import { asyncHandler } from '../../utils/asyncHandler';
// import { successHandler } from '../../utils/responseHandler';
// import * as AuthService from './auth.service';
// import {
//   LoginInput,
//   RefreshInput,
//   LogoutInput,
// } from './auth.schema';
// import { AUTH_RESPONSE } from '../../constants/responseMessages';

// export const login = asyncHandler(async (req: Request<{}, {}, LoginInput>, res: Response) => {
//   const result = await AuthService.login(req.body);
//   return successHandler(res, { data: result, ...AUTH_RESPONSE.LOGIN_SUCCESS });
// });

// export const verifyOtpLogin = asyncHandler(async (req: Request, res: Response) => {
//   const { identifier, otp } = req.body;
//   const result = await AuthService.verifyOtpLogin({ identifier, otp });
//   return successHandler(res, { data: result, ...AUTH_RESPONSE.LOGIN_SUCCESS });
// });

// export const refresh = asyncHandler(async (req: Request<{}, {}, RefreshInput>, res: Response) => {
//   const result = await AuthService.refreshTokens(req.body);
//   return successHandler(res, { data: result, ...AUTH_RESPONSE.REFRESH_SUCCESS });
// });

// export const logout = asyncHandler(async (req: Request<{}, {}, LogoutInput>, res: Response) => {
//   await AuthService.logout(req.body);
//   return successHandler(res, { data: null, ...AUTH_RESPONSE.LOGOUT_SUCCESS });
// });
