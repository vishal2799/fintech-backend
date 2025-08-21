// src/modules/commission/commission.controller.ts
import { Request, Response } from 'express';
import * as CommissionService from './commission.service';
import { successHandler } from '../../utils/responseHandler';
import { CreateServiceCommissionInput, createServiceCommissionSchema } from './commission.schema';
import { asyncHandler } from '../../utils/asyncHandler';

export const createCommissionHandler = asyncHandler(async (req: Request, res: Response) => {
//   const validated: CreateServiceCommissionInput = createServiceCommissionSchema.parse(req.body);
  const commission = await CommissionService.createServiceCommission(req.body);
  return successHandler(res, {data: commission, message: 'Commission created successfully'});
});

export const getCommissionsHandler = asyncHandler(async (req: Request, res: Response) => {
  const commissions = await CommissionService.getAllServiceCommissions();
  return successHandler(res, {data: commissions});
});

export const getCommissionByIdHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const commission = await CommissionService.getServiceCommissionById(id);
  return successHandler(res, {data: commission});
});

export const updateCommissionHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
//   const data = createServiceCommissionSchema.partial().parse(req.body);
  const updated = await CommissionService.updateServiceCommission(id, req.body);
  return successHandler(res, {data: updated, message: 'Commission updated successfully'});
});

export const deleteCommissionHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CommissionService.deleteServiceCommission(id);
  return successHandler(res, {data: result, message: 'Commission deleted successfully'});
});
