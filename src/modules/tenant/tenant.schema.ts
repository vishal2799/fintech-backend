import { z } from 'zod';

export const createTenantSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  logoUrl: z.string().optional(),
  themeColor: z.string().optional(),
});

export const updateTenantSchema = createTenantSchema.partial();

export const updateTenantStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'DISABLED'], {
    errorMap: () => ({ message: 'Status must be ACTIVE or DISABLED' }),
  }),
});

export type CreateTenantInput = z.infer<typeof createTenantSchema>;
export type UpdateTenantInput = z.infer<typeof updateTenantSchema>;
export type UpdateTenantStatusInput = z.infer<typeof updateTenantStatusSchema>;

export const uploadLogoSchema = z.object({
  tenantId: z.string().uuid(),
  fileName: z.string(),
  mimeType: z.string()
});

export const updateLogoSchema = z.object({
  tenantId: z.string().uuid(),
  fileKey: z.string()
});