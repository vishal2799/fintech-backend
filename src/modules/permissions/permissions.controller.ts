import { Request, Response } from 'express';
import * as PermissionService from './permissions.service';
import { successHandler } from '../../utils/responseHandler';
import { asyncHandler } from '../../utils/asyncHandler';

/**
 * GET /admin/permissions
 */
export const getAllPermissions = asyncHandler(async (_req: Request, res: Response) => {
  const perms = await PermissionService.getAllPermissions();
  return successHandler(res, perms);
});

/**
 * POST /admin/permissions
 */
export const createPermission = asyncHandler(async (req: Request, res: Response) => {
  const { name, module, description } = req.body;
  const created = await PermissionService.createPermission({ name, module, description });
  return successHandler(res, created, 'Permission created', 201);
});

/**
 * PATCH /admin/permissions/:id
 */
export const updatePermission = asyncHandler(async (req: Request, res: Response) => {
  const updated = await PermissionService.updatePermission(req.params.id, req.body);
  return successHandler(res, updated, 'Permission updated');
});

/**
 * DELETE /admin/permissions/:id
 */
export const deletePermission = asyncHandler(async (req: Request, res: Response) => {
  await PermissionService.deletePermission(req.params.id);
  return successHandler(res, null, 'Permission deleted', 204);
});
