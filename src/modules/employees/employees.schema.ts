import { z } from 'zod';

export const createEmployeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  mobile: z.string().min(6, 'Mobile number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  roleId: z.string().uuid('Role is required'),
});

export const updateEmployeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  mobile: z.string().min(6, 'Mobile number is required'),
  roleId: z.string().uuid('Role is required'),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
