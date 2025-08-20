import { Request, Response } from 'express';
import { ServiceRuleTypeService } from './service-rule-types.service';
import { serviceRuleTypeSchema } from './service-rules-types.schema';
import { asyncHandler } from '../../utils/asyncHandler';
import { successHandler } from '../../utils/responseHandler';

export const ServiceRuleTypeController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    // const validated = serviceRuleTypeSchema.parse(req.body);
    const ruleType = await ServiceRuleTypeService.create(req.body);
    successHandler(res, {data: ruleType, message:'Service rule type created successfully'});
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const validated = serviceRuleTypeSchema.partial().parse(req.body);
    const ruleType = await ServiceRuleTypeService.update(id, validated);
    successHandler(res, {data: ruleType, message:'Service rule type updated successfully'});
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const ruleType = await ServiceRuleTypeService.delete(id);
    successHandler(res, {data: ruleType, message: 'Service rule type deleted successfully'});
  }),

  getAll: asyncHandler(async (_req: Request, res: Response) => {
    const ruleTypes = await ServiceRuleTypeService.getAll();
    successHandler(res, {data:ruleTypes});
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const ruleType = await ServiceRuleTypeService.getById(id);
    successHandler(res, {data:ruleType});
  }),

  getByServiceId: asyncHandler(async (req: Request, res: Response) => {
    const serviceId = req.params.serviceId;
    const ruleTypes = await ServiceRuleTypeService.getByServiceId(serviceId);
    successHandler(res, {data: ruleTypes});
  }),
};
