import { z } from 'zod';

// STEP 1: Login (Email + Password)
export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
export type LoginInput = z.infer<typeof loginSchema>;

// STEP 2: OTP Verification
export const verifyOtpSchema = z.object({
  identifier: z.string().min(1, 'Identifier is required'), // UUID or similar
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
});
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;

// Refresh Token
export const refreshSchema = z.object({
  token: z.string().min(10, 'Token is required'),
});
export type RefreshInput = z.infer<typeof refreshSchema>;

// Logout
export const logoutSchema = z.object({
  token: z.string().min(10, 'Token is required'),
});
export type LogoutInput = z.infer<typeof logoutSchema>;
