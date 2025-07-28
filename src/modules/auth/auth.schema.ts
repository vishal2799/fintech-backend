import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Email is invalid' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export const refreshSchema = z.object({
  token: z.string().min(1, { message: 'Refresh token is required' }),
});

export const logoutSchema = z.object({
  token: z.string().min(1, { message: 'Token is required' }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
export type LogoutInput = z.infer<typeof logoutSchema>;

