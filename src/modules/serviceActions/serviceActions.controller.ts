
// ============================================
// 2. CONTROLLER
// src/modules/serviceActions/serviceActions.controller.ts
// ============================================

import { RESPONSE } from '../../constants/responseMessages';
import { asyncHandler } from '../../utils/asyncHandler';
import { successHandler } from '../../utils/responseHandler';
import { ServiceActionService } from './serviceActions.service';

export const ServiceActionsController = {
  create: asyncHandler(async (req, res) => {
    const action = await ServiceActionService.create(req.validated);
    return successHandler(res, { data: action, ...RESPONSE.SERVICE_ACTION.CREATED });
  }),

  getById: asyncHandler(async (req, res) => {
    const action = await ServiceActionService.getById(req.params.id);
    return successHandler(res, { data: action, ...RESPONSE.SERVICE_ACTION.FETCHED });
  }),

  getAll: asyncHandler(async (req, res) => {
    const { isActive, search, page, limit } = req.validated;
    const result = await ServiceActionService.getAll({ isActive, search, page, limit });
    return successHandler(res, { data: result, ...RESPONSE.SERVICE_ACTION.FETCHED });
  }),

  getAll2: asyncHandler(async (req, res) => {
    const result = await ServiceActionService.getAll2();
    return successHandler(res, { data: result, ...RESPONSE.SERVICE_ACTION.FETCHED });
  }),

  update: asyncHandler(async (req, res) => {
    const action = await ServiceActionService.update(req.params.id, req.validated);
    return successHandler(res, { data: action, ...RESPONSE.SERVICE_ACTION.UPDATED });
  }),

  delete: asyncHandler(async (req, res) => {
    await ServiceActionService.delete(req.params.id);
    return successHandler(res, { data: null, ...RESPONSE.SERVICE_ACTION.DELETED });
  }),

  getByCode: asyncHandler(async (req, res) => {
    const action = await ServiceActionService.getByCode(req.params.code);
    return successHandler(res, { data: action, ...RESPONSE.SERVICE_ACTION.FETCHED });
  }),
};