import { asyncHandler } from '../../utils/asyncHandler';
import { successHandler } from '../../utils/responseHandler';
import * as TenantService from './tenant.service';
import { Request, Response } from 'express';
import { RESPONSE } from '../../constants/responseMessages';

export const createTenant = asyncHandler(async (req: Request, res: Response) => {
  const data = (req as any).validated;
  const created = await TenantService.createTenant(data);
  return successHandler(res, { data: created, ...RESPONSE.TENANT.CREATED });
});

export const updateTenant = asyncHandler(async (req: Request, res: Response) => {
  const data = (req as any).validated;
  const updated = await TenantService.updateTenant(req.params.id, data);
  return successHandler(res, { data: updated, ...RESPONSE.TENANT.UPDATED });
});

export const updateTenantStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = (req as any).validated;
  const result = await TenantService.updateTenantStatus(req.params.id, status);
  return successHandler(res, { data: result, ...RESPONSE.TENANT.STATUS_UPDATED });
});

export const listAllTenants = asyncHandler(async (_req: Request, res: Response) => {
  const data = await TenantService.listAllTenants();
  return successHandler(res, { data, ...RESPONSE.TENANT.LISTED });
});
