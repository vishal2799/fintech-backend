// src/modules/tenantCommissions/tenantCommissions.service.ts
import { and, eq } from 'drizzle-orm';
import { db } from '../../db';
import { AppError } from '../../utils/AppError';
import { tenantCommissions } from '../../db/schema';
import { ERRORS } from '../../constants/errorCodes2';
import { ServiceTemplateService } from '../serviceTemplates/serviceTemplates.service';

// Default roles we always want in commission splits
const DEFAULT_ROLES = [
  { roleCode: 'wl_admin', commissionPercentage: 0, feePercentage: 0 },
  { roleCode: 'super_distributor', commissionPercentage: 0, feePercentage: 0 },
  { roleCode: 'distributor', commissionPercentage: 0, feePercentage: 0 },
  { roleCode: 'retailer', commissionPercentage: 0, feePercentage: 0 },
];

export const TenantCommissionsService = {

    getByServiceTemplate: async (tenantId: string, serviceTemplateId: string) => {
    const serviceTemplate = await ServiceTemplateService.getById(serviceTemplateId);
    const records = await db
      .select()
      .from(tenantCommissions)
      .where(eq(tenantCommissions.serviceTemplateId, serviceTemplateId));

    // If no records exist, return defaults
    if (!records || records.length === 0) {
      return {
        serviceTemplateId,
        tenantId,
        splits: DEFAULT_ROLES,
        serviceTemplate
      };
    }

    // Merge with defaults → ensures missing roles are filled with 0
    const existingMap = new Map(records.map(r => [r.roleCode, r]));
    const mergedSplits = DEFAULT_ROLES.map(role => {
      if (existingMap.has(role.roleCode)) {
        const rec = existingMap.get(role.roleCode)!;
        return {
          roleCode: rec.roleCode,
          commissionPercentage: rec.commissionPercentage,
          feePercentage: rec.feePercentage,
        };
      }
      return role;
    });

    return {
      serviceTemplateId,
      tenantId,
      splits: mergedSplits,
      serviceTemplate
    };
  },

  // Get all tenant commissions for current WL Admin
  getAll: async (tenantId: string) => {
    return await db.select().from(tenantCommissions).where(eq(tenantCommissions.tenantId, tenantId)).orderBy(tenantCommissions.createdAt);
  },

  // Get commissions for a specific service template
  getByServiceTemplate2: async (tenantId: string, serviceTemplateId: string) => {
    const commissions = await db.select().from(tenantCommissions)
    .where(and(eq(tenantCommissions.tenantId, tenantId), eq(tenantCommissions.serviceTemplateId, serviceTemplateId))) 
    .orderBy(eq(tenantCommissions.roleCode, 'asc'))
    // db.query.tenantCommissions.findMany({
    //   where: { tenantId, serviceTemplateId },
    //   orderBy: { roleCode: 'asc' },
    // });

    if (!commissions || commissions.length === 0) {
      throw new AppError(ERRORS.TENANT_COMMISSION.NOT_FOUND);
    }

    return commissions;
  },

  // Get commission for a specific role
  getByRole: async (
    tenantId: string,
    serviceTemplateId: string,
    roleCode: string
  ) => {
    const commission = await db.select().from(tenantCommissions)
    .where(and(eq(tenantCommissions.tenantId, tenantId), eq(tenantCommissions.serviceTemplateId, serviceTemplateId), eq(tenantCommissions.roleCode, roleCode))) 
    
    // await db.query.tenantCommissions.findFirst({
    //   where: { tenantId, serviceTemplateId, roleCode },
    // });

    if (!commission) {
      throw new AppError(ERRORS.TENANT_COMMISSION.NOT_FOUND_FOR_ROLE);
    }

    return commission;
  },

  upsert: async (
    tenantId: string,
    serviceTemplateId: string,
    splits: { roleCode: string; commissionPercentage: number; feePercentage: number }[]
  ) => {
    // Validate total ≤ 100%
    const totalCommission = splits.reduce((acc, s) => acc + s.commissionPercentage, 0);
    const totalFee = splits.reduce((acc, s) => acc + s.feePercentage, 0);

    if (totalCommission > 100) throw new AppError(ERRORS.TENANT_COMMISSION.COMMISSION_PERCENTAGE);
    if (totalFee > 100) throw new AppError(ERRORS.TENANT_COMMISSION.FEE_PERCENTAGE);

    // Delete existing commissions for this tenant + service
    await db.delete(tenantCommissions).where(
      and(
        eq(tenantCommissions.tenantId, tenantId),
        eq(tenantCommissions.serviceTemplateId, serviceTemplateId)
      )
    );

    // Insert new splits
    return db.insert(tenantCommissions).values(
      splits.map((s:any) => ({
        tenantId,
        serviceTemplateId,
        roleCode: s.roleCode,
        commissionPercentage: s.commissionPercentage,
        feePercentage: s.feePercentage,
      }))
    ).returning();
  },

  // Update tenant commissions for a service template
  update: async (
    tenantId: string,
    serviceTemplateId: string,
    splits: { roleCode: string; commissionPercentage: number; feePercentage: number }[]
  ) => {
    // Validate sum <= 100%
    const totalCommission = splits.reduce((acc, s) => acc + s.commissionPercentage, 0);
    const totalFee = splits.reduce((acc, s) => acc + s.feePercentage, 0);

    if (totalCommission > 100) {
      throw new AppError(ERRORS.TENANT_COMMISSION.COMMISSION_PERCENTAGE);
    }
    if (totalFee > 100) {
      throw new AppError(ERRORS.TENANT_COMMISSION.FEE_PERCENTAGE);
    }

    // Delete existing splits for this tenant + serviceTemplate
    await db.delete(tenantCommissions).where(and(eq(tenantCommissions.tenantId, tenantId), eq(tenantCommissions.serviceTemplateId, serviceTemplateId)))

    // await db.delete(tenantCommissions).where({
    //   tenantId,
    //   serviceTemplateId,
    // });

    // Insert new splits
    return db.insert(tenantCommissions).values(
      splits.map((s:any) => ({
        tenantId: tenantId,
        serviceTemplateId: serviceTemplateId,
        roleCode: s.roleCode,
        commissionPercentage: s.commissionPercentage,
        feePercentage: s.feePercentage,
      }))
    );
  },
};
