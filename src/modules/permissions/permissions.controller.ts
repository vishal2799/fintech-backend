import { Request, Response } from 'express';
import * as PermissionService from './permissions.service';
import { successHandler } from '../../utils/responseHandler';
import { asyncHandler } from '../../utils/asyncHandler';
import { ERRORS } from '../../constants/errorCodes';

/**
 * GET /permissions
 */
export const getAllPermissions = asyncHandler(async (req: Request, res: Response) => {
  const scope = req.query.scope as 'PLATFORM' | 'TENANT' | 'BOTH' | undefined;
  const perms = await PermissionService.getAllPermissions(scope);
  return successHandler(res, {
    data: perms,
    ...{
      message: 'Permissions fetched successfully',
      status: 200,
    },
  });
});

/**
 * POST /permissions
 */
export const createPermission = asyncHandler(async (req: Request, res: Response) => {
  const data = (req as any).validated;
  const created = await PermissionService.createPermission(data);
  return successHandler(res, {
    data: created,
    ...{
      message: 'Permission created successfully',
      status: 201,
    },
  });
});

/**
 * PATCH /permissions/:id
 */
export const updatePermission = asyncHandler(async (req: Request, res: Response) => {
  const data = (req as any).validated;
  const updated = await PermissionService.updatePermission(req.params.id, data);
  return successHandler(res, {
    data: updated,
    ...{
      message: 'Permission updated successfully',
      status: 200,
    },
  });
});

/**
 * DELETE /permissions/:id
 */
export const deletePermission = asyncHandler(async (req: Request, res: Response) => {
  await PermissionService.deletePermission(req.params.id);
  return successHandler(res, {
    data: null,
    ...{
      message: 'Permission deleted successfully',
      status: 200,
    },
  });
});
