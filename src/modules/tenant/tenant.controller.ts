import { asyncHandler } from '../../utils/asyncHandler';
import { successHandler } from '../../utils/responseHandler';
import * as TenantService from './tenant.service';
import { Request, Response } from 'express';
import { RESPONSE } from '../../constants/responseMessages';
import { AppError } from '../../utils/AppError';
import { ERRORS } from '../../constants/errorCodes';
import { db } from '../../db';
import { eq, or } from 'drizzle-orm';
import { tenants } from '../../db/schema';
import * as storageService from "../../services/storage.service";

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

export const getTenantDetails = asyncHandler(async (req: Request, res: Response) => {
  const subdomain = (req as any).subdomain;
  const host = req.headers.host?.split(':')[0] ?? ''; // ensures string

  if (subdomain === 'superadmin' || host === 'superadmin.localhost') {
    throw new AppError(ERRORS.INVALID_TENANT);
  }

  const tenant = await db.query.tenants.findFirst({
    where: or(
      eq(tenants.slug, subdomain ?? ''),             // for subdomain-based tenants
      eq(tenants.domainCname, host)                 // for custom domain tenants
    )
  });

  if (!tenant) {
    throw new AppError(ERRORS.TENANT_NOT_FOUND);
  }

  return successHandler(res, {
    data: tenant,
    message: 'Tenant Details'
  });
});


export const getTenantLogoUploadUrl = asyncHandler(async (req, res) => {
  const { tenantId, fileName, mimeType } = (req as any).validated;

  const tenant = await db.query.tenants.findFirst({ where: eq(tenants.id, tenantId) });
  if (!tenant) throw new AppError(ERRORS.TENANT_NOT_FOUND);

  // specify docType = 'logo' explicitly
  const { uploadUrl, fileKey } = await storageService.generateUploadUrl(tenantId, fileName, mimeType, 'logo');
  return successHandler(res, { data: { uploadUrl, fileKey } });
});


export const updateTenantLogoKey = asyncHandler(async (req, res) => {
  const { tenantId, fileKey } = (req as any).validated;

  const tenant = await db.query.tenants.findFirst({ where: eq(tenants.id, tenantId) });
  if (!tenant) throw new AppError(ERRORS.TENANT_NOT_FOUND);

  await db.update(tenants)
    .set({ logoUrl: fileKey, updatedAt: new Date() })
    .where(eq(tenants.id, tenantId));

  return successHandler(res, { data: fileKey });
});

// Returns a fresh presigned GET URL for the tenant's stored logo key (if present)
export const getTenantLogoUrl = asyncHandler(async (req, res) => {
  const { tenantId } = req.params;
  const tenant = await db.query.tenants.findFirst({ where: eq(tenants.id, tenantId) });
  if (!tenant) throw new AppError(ERRORS.TENANT_NOT_FOUND);

  if (!tenant.logoUrl) return successHandler(res, { data: {downloadUrl: null} });

  const downloadUrl = await storageService.generateDownloadUrl(tenant.logoUrl);
  return successHandler(res, { data: {downloadUrl, fileKey: tenant.logoUrl} });
});


// export const getTenantDetails = asyncHandler(async (req, res) => {
//   const subdomain = (req as any).subdomain;
//   if (!subdomain || subdomain === 'superadmin') throw new AppError(ERRORS.INVALID_TENANT);

//   const tenant = await db.query.tenants.findFirst({
//     where: eq(tenants.slug, subdomain),
//   });

//   if (!tenant) throw new AppError(ERRORS.TENANT_NOT_FOUND);
//   return successHandler(res, {data: tenant, message: 'Tenant Details'});
// });
