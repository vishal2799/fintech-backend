import { z } from 'zod';

export const sendOtpSchema = z.object({
  identifier: z.string().min(3), // email or mobile
  type: z.enum(['LOGIN', 'SIGNUP', 'FORGOT_PASSWORD']),
});

export const verifyOtpSchema = z.object({
  identifier: z.string(),
  otp: z.string().length(6),
  type: z.enum(['LOGIN', 'SIGNUP', 'FORGOT_PASSWORD']),
});

export type SendOtpInput = z.infer<typeof sendOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
