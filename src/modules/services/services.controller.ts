// src/modules/services/services.controller.ts

import { Request, Response } from 'express';
import * as ServiceService from './services.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { successHandler } from '../../utils/responseHandler';

export const getAll = asyncHandler(async (_req: Request, res: Response) => {
  const result = await ServiceService.getAllServices();
  return successHandler(res, result);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const service = await ServiceService.getServiceById(req.params.id);
  if (!service) throw new Error('Service not found');
  return successHandler(res, service);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const created = await ServiceService.createService(req.body);
  return successHandler(res, created, 'Service created', 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const updated = await ServiceService.updateService(req.params.id, req.body);
  if (!updated) throw new Error('Service not found');
  return successHandler(res, updated, 'Service updated');
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const deleted = await ServiceService.deleteService(req.params.id);
  if (!deleted) throw new Error('Service not found');
  return successHandler(res, null, 'Service deleted');
});


// ========== Super Admin ==========
export const listServicesGlobal = asyncHandler(async (_req: Request, res: Response) => {
  const services = await ServiceService.getAllGlobalServices();
  return successHandler(res, services);
});

export const updateGlobalService = asyncHandler(async (req: Request, res: Response) => {
  const updated = await ServiceService.updateGlobalService(req.params.id, req.body);
  return successHandler(res, updated, 'Global service updated');
});

// ========== White Label Admin ==========
export const listTenantServices = asyncHandler(async (req: Request, res: Response) => {
  const tenantId = req?.user?.tenantId!;
  const list = await ServiceService.getTenantServices(tenantId);
  return successHandler(res, list);
});

export const updateTenantService = asyncHandler(async (req: Request, res: Response) => {
  const tenantId = req?.user?.tenantId!;
  const result = await ServiceService.updateTenantService(tenantId, req.params.id, req.body);
  return successHandler(res, result, 'Tenant service updated');
});

// ========== WL Admin – User Level ==========
export const listUserServices = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const list = await ServiceService.getUserServices(userId);
  return successHandler(res, list);
});

export const updateUserService = asyncHandler(async (req: Request, res: Response) => {
  const { userId, serviceId } = req.params;
  const result = await ServiceService.updateUserService(userId, serviceId, req.body);
  return successHandler(res, result, 'User service updated');
});

// ========== Retailer ==========
export const listMyServices = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const tenantId = req.user?.tenantId;
  if (!userId || !tenantId) throw new Error('Missing userId or tenantId');
  const list = await ServiceService.getEffectiveServicesForUser(userId, tenantId);
  return successHandler(res, list);
});
