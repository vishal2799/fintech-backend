// ============================================
// 2. CONTROLLER
// src/modules/serviceTemplates/serviceTemplates.controller.ts
// ============================================

import { RESPONSE } from '../../constants/responseMessages';
import { asyncHandler } from '../../utils/asyncHandler';
import { successHandler } from '../../utils/responseHandler';
import { ServiceTemplateService } from './serviceTemplates.service';

export const ServiceTemplatesController = {
  create: asyncHandler(async (req, res) => {
    const serviceTemplate = await ServiceTemplateService.create(req.validated);
    return successHandler(res, { data: serviceTemplate, ...RESPONSE.SERVICE_TEMPLATE.CREATED });
  }),

  getById: asyncHandler(async (req, res) => {
    const serviceTemplate = await ServiceTemplateService.getById(req.params.id);
    return successHandler(res, { data: serviceTemplate, ...RESPONSE.SERVICE_TEMPLATE.FETCHED });
  }),

  getAll: asyncHandler(async (req, res) => {
    const result = await ServiceTemplateService.getAll();
    return successHandler(res, { data: result, ...RESPONSE.SERVICE_TEMPLATE.FETCHED });
  }),

  getAll2: asyncHandler(async (req, res) => {
    const { serviceActionId, templateId, isActive, page, limit } = req.validated;
    const result = await ServiceTemplateService.getAll2({ serviceActionId, templateId, isActive, page, limit });
    return successHandler(res, { data: result, ...RESPONSE.SERVICE_TEMPLATE.FETCHED });
  }),

  getByServiceAction: asyncHandler(async (req, res) => {
    const serviceTemplate = await ServiceTemplateService.getByServiceAction(req.params.serviceActionId);
    return successHandler(res, { data: serviceTemplate, ...RESPONSE.SERVICE_TEMPLATE.FETCHED });
  }),

  update: asyncHandler(async (req, res) => {
    const serviceTemplate = await ServiceTemplateService.update(req.params.id, req.validated);
    return successHandler(res, { data: serviceTemplate, ...RESPONSE.SERVICE_TEMPLATE.UPDATED });
  }),

  delete: asyncHandler(async (req, res) => {
    await ServiceTemplateService.delete(req.params.id);
    return successHandler(res, { data: null, ...RESPONSE.SERVICE_TEMPLATE.DELETED });
  }),
};
