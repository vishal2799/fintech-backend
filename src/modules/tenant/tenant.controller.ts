// src/controllers/tenant.controller.ts
import { Request, Response } from 'express';
import * as TenantService from './tenant.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { successHandler } from '../../utils/responseHandler';

export const createTenant = asyncHandler(async (req: Request, res: Response) => {
  const created = await TenantService.createTenant(req.body);
  return successHandler(res, created, 'Tenant created');
});

export const listTenants = asyncHandler(async (req: Request, res: Response) => {
  const page    = parseInt(req.query.page as string)    || 1;
  const perPage = parseInt(req.query.perPage as string) || 10;

  const result = await TenantService.listTenants({ page, perPage });
  return successHandler(res, result);
});

export const updateTenant = asyncHandler(async (req: Request, res: Response) => {
  const result = await TenantService.updateTenant(req.params.id, req.body);
  console.log('⇢ update payload', result, req.body);
  if (!result) throw new Error('Tenant not found');
  return successHandler(res, result, 'Tenant updated');
    // return successHandler(res, result, 'Tenant updated');
  // return successHandler(res, result, 'Tenant updated');
});

export const listAllTenants = asyncHandler(async (req:Request, res:Response) => {
  const data = await TenantService.listAllTenants();
  return successHandler(res, data);
});

type TenantSortKey = 'name' | 'slug' | 'status' | 'createdAt';

export const listTenantsAdvanced = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const perPage = parseInt(req.query.perPage as string) || 10;
  const q = (req.query.q as string) || '';
  const sortBy = (req.query.sortBy as TenantSortKey) || 'name';
  const sortDir = (req.query.sortDir as string) === 'desc' ? 'desc' : 'asc';

  const result = await TenantService.listTenantsAdvanced({
    page,
    perPage,
    q,
    sortBy,
    sortDir
  });

  return successHandler(res, result);
});