// modules/services/services.schema.ts

import { z } from 'zod'

export const createServiceSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2),
  description: z.string().optional(),
})

export const updateServiceSchema = z.object({
  name: z.string().min(2).optional(),
  code: z.string().optional(),
  description: z.string().optional(),
  isGlobalEnabled: z.boolean().optional(),
})
