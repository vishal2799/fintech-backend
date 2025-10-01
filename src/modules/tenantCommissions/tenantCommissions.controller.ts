// src/modules/tenantCommissions/tenantCommissions.controller.ts
import { Request, Response } from 'express';
import { TenantCommissionsService } from './tenantCommissions.service';
import { successHandler } from '../../utils/responseHandler';
import { asyncHandler } from '../../utils/asyncHandler';
import { RESPONSE } from '../../constants/responseMessages';

export const TenantCommissionsController = {
  // Get all tenant commissions for current WL Admin
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const tenantId = (req as any).user.id; // current tenant
    const commissions = await TenantCommissionsService.getAll(tenantId);
    return successHandler(res, {data: commissions, ...RESPONSE.TENANT_COMMISSION.FETCHED});
  }),

  // Get commissions for a specific service template
  getByServiceTemplate: asyncHandler(async (req: Request, res: Response) => {
    const tenantId = (req as any).user.id;
    const { serviceTemplateId } = (req as any).validated;
    const commissions = await TenantCommissionsService.getByServiceTemplate(
      tenantId,
      serviceTemplateId
    );
    return successHandler(res, {data: commissions, ...RESPONSE.TENANT_COMMISSION.FETCHED});
  }),

  // Get commission for a specific role
  getByRole: asyncHandler(async (req: Request, res: Response) => {
    const tenantId = (req as any).user.id;
    const { serviceTemplateId, roleCode } = (req as any).validated;
    const commission = await TenantCommissionsService.getByRole(
      tenantId,
      serviceTemplateId,
      roleCode
    );
    return successHandler(res, {data: commission, ...RESPONSE.TENANT_COMMISSION.FETCHED});
  }),

  // Update tenant commissions for a service template
  update: asyncHandler(async (req: Request, res: Response) => {
    const tenantId = (req as any).user.id;
    const { serviceTemplateId, splits } = (req as any).validated;
    const updated = await TenantCommissionsService.upsert(
      tenantId,
      serviceTemplateId,
      splits
    );
    return successHandler(res, {data: updated, ...RESPONSE.TENANT_COMMISSION.UPDATED});
  }),
};
