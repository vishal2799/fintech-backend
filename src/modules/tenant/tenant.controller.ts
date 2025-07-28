import { asyncHandler } from '../../utils/asyncHandler';
import { successHandler } from '../../utils/responseHandler';
import * as TenantService from './tenant.service';
import { Request, Response } from 'express';
import { RESPONSE } from '../../constants/responseMessages';
import { AppError } from '../../utils/AppError';
import { ERRORS } from '../../constants/errorCodes';
import { db } from '../../db';
import { eq } from 'drizzle-orm';
import { tenants } from '../../db/schema';

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

// controllers/tenant.controller.ts
export const getTenantDetails = asyncHandler(async (req, res) => {
  const subdomain = (req as any).subdomain;
  if (!subdomain || subdomain === 'superadmin') throw new AppError(ERRORS.INVALID_TENANT);

  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.slug, subdomain),
  });

  if (!tenant) throw new AppError(ERRORS.TENANT_NOT_FOUND);
  return successHandler(res, {data: tenant, message: 'Tenant Details'});
});
