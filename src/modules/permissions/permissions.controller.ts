import { Request, Response } from 'express';
import * as PermissionService from './permissions.service';
import { successHandler } from '../../utils/responseHandler';
import { asyncHandler } from '../../utils/asyncHandler';

/**
 * GET /admin/permissions
 */
export const getAllPermissions = asyncHandler(async (_req: Request, res: Response) => {
  const perms = await PermissionService.getAllPermissions();
    return successHandler(res, {data: perms, message: 'Permissions Fetched successfully', status: 200});
});

/**
 * POST /admin/permissions
 */
export const createPermission = asyncHandler(async (req: Request, res: Response) => {
  const { name, module, description, scope } = req.body;

  if (!name || !module || !scope) {
    return res.status(400).json({ success: false, message: 'name, module, and scope are required' });
  }

  const created = await PermissionService.createPermission({ name, module, description, scope });
    return successHandler(res, {data: created, message: 'Permission Created successfully', status: 201});
});

/**
 * PATCH /admin/permissions/:id
 */
export const updatePermission = asyncHandler(async (req: Request, res: Response) => {
  const updated = await PermissionService.updatePermission(req.params.id, req.body);
  return successHandler(res, {data: updated, message: 'Permission Updated successfully', status: 200});
});

/**
 * DELETE /admin/permissions/:id
 */
export const deletePermission = asyncHandler(async (req: Request, res: Response) => {
  await PermissionService.deletePermission(req.params.id);
  return successHandler(res, {data: null, message: 'Permission Deleted successfully', status: 200});
});
