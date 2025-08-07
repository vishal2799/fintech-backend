// src/modules/services/services.controller.ts

import { Request, Response } from 'express';
import * as ServiceService from './services.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { successHandler } from '../../utils/responseHandler';
import { AppError } from '../../utils/AppError';
import { ERRORS } from '../../constants/errorCodes';

export const getAll = asyncHandler(async (_req: Request, res: Response) => {
  const result = await ServiceService.getAllServices();
  return successHandler(res, {data: result, message: 'Services Fetched successfully', status: 200});
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const service = await ServiceService.getServiceById(req.params.id);
  if (!service) throw new AppError(ERRORS.SERVICE_NOT_FOUND);
  return successHandler(res, {data: service, message: 'Service Fetched successfully', status: 200});
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const created = await ServiceService.createService(req.body);
  return successHandler(res, {data: created, message: 'Service Created successfully', status: 201});
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const updated = await ServiceService.updateService(req.params.id, req.body);
  if (!updated) throw new AppError(ERRORS.SERVICE_NOT_FOUND);
  return successHandler(res, {data: updated, message: 'Service Updated successfully', status: 200});
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const deleted = await ServiceService.deleteService(req.params.id);
  if (!deleted) throw new AppError(ERRORS.SERVICE_NOT_FOUND);
  return successHandler(res, {data: null, message: 'Service Deleted successfully', status: 200});
});
