// schemas/superAdmin/apiUser.schema.ts
import { z } from 'zod';

export const createApiUserSchema = z.object({
  tenantId: z.string().uuid(),
  clientName: z.string().min(3),
});

export const regenerateSecretSchema = z.object({
  apiClientId: z.string().uuid(),
});

export const toggleApiUserStatusSchema = z.object({
  apiClientId: z.string().uuid(),
  status: z.enum(['ACTIVE', 'REVOKED']),
});
