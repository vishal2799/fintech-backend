// ============================================
// 3. CONTROLLER
// src/modules/commissionTemplates/commissionTemplates.controller.ts
// ============================================

import { RESPONSE } from '../../constants/responseMessages';
import { asyncHandler } from '../../utils/asyncHandler';
import { successHandler } from '../../utils/responseHandler';
import { CommissionTemplateService } from './commissionTemplates.service';

export const CommissionTemplatesController = {
  create: asyncHandler(async (req, res) => {
    const template = await CommissionTemplateService.create(req.validated);
    return successHandler(res, { data: template, ...RESPONSE.COMMISSION_TEMPLATE.CREATED });
  }),

  getById: asyncHandler(async (req, res) => {
    const template = await CommissionTemplateService.getById(req.params.id);
    return successHandler(res, { data: template, ...RESPONSE.COMMISSION_TEMPLATE.FETCHED });
  }),

  getAll: asyncHandler(async (req, res) => {
    const result = await CommissionTemplateService.getAll();
    return successHandler(res, { data: result, ...RESPONSE.COMMISSION_TEMPLATE.FETCHED });
  }),

  getAll2: asyncHandler(async (req, res) => {
    const { isActive, search, page, limit } = req.validated;
    const result = await CommissionTemplateService.getAll2({ isActive, search, page, limit });
    return successHandler(res, { data: result, ...RESPONSE.COMMISSION_TEMPLATE.FETCHED });
  }),

  update: asyncHandler(async (req, res) => {
    const template = await CommissionTemplateService.update(req.params.id, req.validated);
    return successHandler(res, { data: template, ...RESPONSE.COMMISSION_TEMPLATE.UPDATED });
  }),

  delete: asyncHandler(async (req, res) => {
    await CommissionTemplateService.delete(req.params.id);
    return successHandler(res, { data: null, ...RESPONSE.COMMISSION_TEMPLATE.DELETED });
  }),
};
