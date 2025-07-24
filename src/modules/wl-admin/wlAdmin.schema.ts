import { z } from 'zod';

export const createWLAdminSchema = z.object({
  tenantId: z.string().min(1, 'Tenant ID is required'),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  mobile: z
    .string()
    .min(10, 'Mobile must be at least 10 digits')
    .max(15, 'Mobile can be at most 15 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const updateWLAdminSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email').optional(),
  mobile: z
    .string()
    .min(10, 'Mobile must be at least 10 digits')
    .max(15, 'Mobile can be at most 15 digits')
    .optional(),
});

export const updateWLAdminStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'LOCKED', 'BLOCKED']),
});

export type CreateWLAdminInput = z.infer<typeof createWLAdminSchema>;
export type UpdateWLAdminInput = z.infer<typeof updateWLAdminSchema>;
export type UpdateWLAdminStatusInput = z.infer<typeof updateWLAdminStatusSchema>;
