import { z } from "zod";

export const createServiceOperatorSchema = z.object({
  serviceId: z.string().uuid(),
  name: z.string().min(2, "Operator name is required"),
  code: z.string().min(2, "Operator code is required"), // e.g. AIRTEL_PREPAID
  isActive: z.boolean().optional(),
});

export const updateServiceOperatorSchema = createServiceOperatorSchema.partial();

export const serviceOperatorIdSchema = z.object({
  id: z.string().uuid(),
});

export type CreateServiceOperatorInput = z.infer<typeof createServiceOperatorSchema>;
export type UpdateServiceOperatorInput = z.infer<typeof updateServiceOperatorSchema>;
