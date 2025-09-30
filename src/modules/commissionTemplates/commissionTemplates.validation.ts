// 2. VALIDATION SCHEMAS
// src/modules/commissionTemplates/commissionTemplates.validation.ts
// ============================================

import { z } from 'zod';

const commissionTemplateBaseSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().optional(),
  
  hasCommission: z.boolean().default(false),
  commissionType: z.enum(['fixed', 'percentage']).optional(),
  commissionValue: z.string().optional(), // Decimal as string
  
  hasFee: z.boolean().default(false),
  feeType: z.enum(['fixed', 'percentage']).optional(),
  feeValue: z.string().optional(),
  
  isActive: z.boolean().optional().default(true),
});

export const createCommissionTemplateSchema = commissionTemplateBaseSchema
  .refine((data) => {
    // Must have at least commission or fee
    return data.hasCommission || data.hasFee;
  }, {
    message: 'Template must have either commission or fee enabled',
    path: ['hasCommission'],
  })
  .refine((data) => {
    // If hasCommission, must have type and value
    if (data.hasCommission) {
      return data.commissionType && data.commissionValue;
    }
    return true;
  }, {
    message: 'Commission type and value are required when commission is enabled',
    path: ['commissionType'],
  })
  .refine((data) => {
    // If hasFee, must have type and value
    if (data.hasFee) {
      return data.feeType && data.feeValue;
    }
    return true;
  }, {
    message: 'Fee type and value are required when fee is enabled',
    path: ['feeType'],
  });

export const updateCommissionTemplateSchema = commissionTemplateBaseSchema.partial();

export const getCommissionTemplateSchema = z.object({
  id: z.string().uuid('Invalid template ID'),
});

export const listCommissionTemplatesSchema = z.object({
  isActive: z.enum(['true', 'false']).optional().transform(val => val === 'true'),
  search: z.string().optional(),
  page: z.string().optional().transform(val => parseInt(val || '1')),
  limit: z.string().optional().transform(val => parseInt(val || '10')),
});