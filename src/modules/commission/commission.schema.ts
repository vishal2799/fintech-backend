// src/modules/commission/commission.schema.ts
import { z } from 'zod';

export const createServiceCommissionSchema = z.object({
  serviceId: z.string().uuid(),
  operatorId: z.string().uuid().optional(), // optional for generic service
  level: z.enum(['TENANT','SUPER_DISTRIBUTOR', 'DISTRIBUTOR', 'RETAILER']),
  value: z.number().nonnegative(),
  valueType: z.enum(['PERCENTAGE', 'FIXED']),
  isActive: z.boolean().optional().default(true),
});

export type CreateServiceCommissionInput = z.infer<typeof createServiceCommissionSchema>;
