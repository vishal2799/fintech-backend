// ============================================
// 1. VALIDATION SCHEMAS
// src/modules/serviceActions/serviceActions.validation.ts
// ============================================

import { z } from 'zod';

export const createServiceActionSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  code: z.string().min(2, 'Code is required').regex(/^[a-z0-9-]+$/, 'Code must be lowercase with hyphens only'),
  description: z.string().optional(),
  isActive: z.boolean().optional().default(true),
});

export const updateServiceActionSchema = createServiceActionSchema.partial();

export const getServiceActionSchema = z.object({
  id: z.string().uuid('Invalid service action ID'),
});

export const listServiceActionsSchema = z.object({
  isActive: z.enum(['true', 'false']).optional().transform(val => val === 'true'),
  search: z.string().optional(),
  page: z.string().optional().transform(val => parseInt(val || '1')),
  limit: z.string().optional().transform(val => parseInt(val || '10')),
});