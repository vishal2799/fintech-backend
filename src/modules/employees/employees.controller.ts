import { Request, Response } from 'express';
import * as EmployeeService from './employees.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { successHandler } from '../../utils/responseHandler';

export const createEmployee = asyncHandler(async (req: Request, res: Response) => {
  const result = await EmployeeService.createEmployee(req);
  return successHandler(res, {data: result, message: 'Employee Created successfully', status: 201});
});

export const listEmployees = asyncHandler(async (req: Request, res: Response) => {
  const result = await EmployeeService.listEmployees(req);
  return successHandler(res, {data: result, message: 'Employee Fetched successfully', status: 200});
});

export const updateEmployee = asyncHandler(async (req: Request, res: Response) => {
  await EmployeeService.updateEmployee(req);
  return successHandler(res, {data: null, message: 'Employee Updated successfully', status: 200});
});

export const deleteEmployee = asyncHandler(async (req: Request, res: Response) => {
  await EmployeeService.deleteEmployee(req);
  return successHandler(res, {data: null, message: 'Employee Deleted successfully', status: 200});
});
