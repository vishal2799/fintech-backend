import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { successHandler } from '../../utils/responseHandler';
import * as OtpService from './otp.service';

export const sendOtp = asyncHandler(async (req: Request, res: Response) => {
  const data = (req as any).validated;
  const result = await OtpService.sendOtp(data);
  return successHandler(res, { data: result, message: 'OTP sent' });
});

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const data = (req as any).validated;
  const result = await OtpService.verifyOtp(data);
  return successHandler(res, { data: result, message: 'OTP verified' });
});
