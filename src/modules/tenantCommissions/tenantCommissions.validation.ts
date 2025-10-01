// src/modules/tenantCommissions/tenantCommissions.validation.ts
import { z } from 'zod';

export const getTenantCommissionsSchema = z.object({
  serviceTemplateId: z.string().uuid('Invalid service template ID'),
});

export const getRoleTenantCommissionSchema = z.object({
  serviceTemplateId: z.string().uuid('Invalid service template ID'),
  roleCode: z.string().min(1, 'Role code is required'),
});

export const updateTenantCommissionsSchema = z.object({
  serviceTemplateId: z.string().uuid('Invalid service template ID'),
  splits: z.array(
    z.object({
      roleCode: z.string().min(1, 'Role code is required'),
      commissionPercentage: z.number().min(0, 'Commission % cannot be negative').max(100),
      feePercentage: z.number().min(0, 'Fee % cannot be negative').max(100),
    })
  ).min(1, 'At least one split is required'),
});
