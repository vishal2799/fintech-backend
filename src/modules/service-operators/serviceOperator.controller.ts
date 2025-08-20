import { asyncHandler } from '../../utils/asyncHandler';
import { successHandler } from '../../utils/responseHandler';
import { ServiceOperatorService } from './serviceOperator.service';

export const ServiceOperatorController = {
  getAll: asyncHandler(async (_req, res) => {
    const operators = await ServiceOperatorService.getAll();
    return successHandler(res, {data: operators, message: 'Operators fetched successfully'});
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const operator = await ServiceOperatorService.getById(id);
    return successHandler(res, {data: operator, message: 'Operator fetched successfully'});
  }),

  create: asyncHandler(async (req, res) => {
    // const data = (req as any).validated;
    const operator = await ServiceOperatorService.create(req.body);
    return successHandler(res, {data: operator, message: 'Operator created successfully'});
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    // const data = (req as any).validated;
    const operator = await ServiceOperatorService.update(id, req.body);
    return successHandler(res, {data: operator, message: 'Operator updated successfully'});
  }),

  delete: asyncHandler(async (req, res) => {
    const { id } = req.params;
    await ServiceOperatorService.delete(id);
    return successHandler(res, {data: null, message: 'Operator deleted successfully'});
  }),
};
