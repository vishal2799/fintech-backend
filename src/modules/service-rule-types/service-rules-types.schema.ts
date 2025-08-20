import { z } from 'zod';

export const serviceRuleTypeSchema = z.object({
  serviceId: z.string().uuid(),  // UUID of parent service
  code: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type ServiceRuleTypeInput = z.infer<typeof serviceRuleTypeSchema>;
