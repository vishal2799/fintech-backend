// ============================================
// 1. VALIDATION SCHEMAS
// src/modules/serviceTemplates/serviceTemplates.validation.ts
// ============================================

import { z } from 'zod';

export const createServiceTemplateSchema = z.object({
  serviceActionId: z.string().uuid('Invalid service action ID'),
  templateId: z.string().uuid('Invalid template ID'),
  isDefault: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
});

export const updateServiceTemplateSchema = z.object({
  templateId: z.string().uuid('Invalid template ID').optional(),
  isDefault: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const getServiceTemplateSchema = z.object({
  id: z.string().uuid('Invalid service template ID'),
});

export const listServiceTemplatesSchema = z.object({
  serviceActionId: z.string().uuid().optional(),
  templateId: z.string().uuid().optional(),
  isActive: z.enum(['true', 'false']).optional().transform(val => val === 'true'),
  page: z.string().optional().transform(val => parseInt(val || '1')),
  limit: z.string().optional().transform(val => parseInt(val || '10')),
});

export const getByServiceActionSchema = z.object({
  serviceActionId: z.string().uuid('Invalid service action ID'),
});