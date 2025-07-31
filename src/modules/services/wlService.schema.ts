import { z } from "zod";

export const updateTenantServiceSchema = z.object({
  overrides: z.array(z.object({
    serviceId: z.string().uuid(),
    isEnabled: z.boolean(),
  })),
});
