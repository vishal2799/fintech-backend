import { Request, Response } from 'express';
import * as EmployeeService from './employees.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { successHandler } from '../../utils/responseHandler';

export const createEmployee = asyncHandler(async (req: Request, res: Response) => {
  const result = await EmployeeService.createEmployee(req);
  return successHandler(res, result, 'Employee created');
});

export const listEmployees = asyncHandler(async (req: Request, res: Response) => {
  const result = await EmployeeService.listEmployees(req);
  return successHandler(res, result);
});

export const updateEmployee = asyncHandler(async (req: Request, res: Response) => {
  await EmployeeService.updateEmployee(req);
  return successHandler(res, null, 'Employee updated');
});

export const deleteEmployee = asyncHandler(async (req: Request, res: Response) => {
  await EmployeeService.deleteEmployee(req);
  return successHandler(res, null, 'Employee deleted');
});
