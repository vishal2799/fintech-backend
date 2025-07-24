import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { successHandler } from '../../utils/responseHandler';
import * as RoleService from './roles.service';
import { AppError } from '../../utils/AppError';
import { ERRORS } from '../../constants/errorCodes';

/**
 * GET /roles
 * List all roles for the current tenant
 */
export const listRoles = asyncHandler(async (req: Request, res: Response) => {
  const tenantId = req.user?.tenantId;
  if (!tenantId) throw new AppError(ERRORS.INVALID_TENANT);

  const roles = await RoleService.listRoles(tenantId);
  return successHandler(res, {
    data: roles,
    message: 'Roles fetched successfully',
    status: 200,
  });
});

/**
 * GET /roles/:id/permissions
 * Get all permissions for a role
 */
export const getRolePermissions = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const permissions = await RoleService.getPermissionsForRole(id);
  return successHandler(res, {
    data: permissions,
    message: 'Role permissions fetched successfully',
    status: 200,
  });
});

/**
 * POST /roles
 * Create a new role with permissionIds
 */
export const createRole = asyncHandler(async (req: Request, res: Response) => {
  const tenantId = req.user?.tenantId;
  if (!tenantId) throw new AppError(ERRORS.INVALID_TENANT);

  const data = (req as any).validated;
  const result = await RoleService.createRole(tenantId, data);

  return successHandler(res, {
    data: result,
    message: 'Role created successfully',
    status: 201,
  });
});

/**
 * PATCH /roles/:id
 * Update role info and/or permissions
 */
export const updateRole = asyncHandler(async (req: Request, res: Response) => {
  const tenantId = req.user?.tenantId;
  if (!tenantId) throw new AppError(ERRORS.INVALID_TENANT);

  const { id } = req.params;
  const data = (req as any).validated;

  const result = await RoleService.updateRole(tenantId, id, data);

  return successHandler(res, {
    data: result,
    message: 'Role updated successfully',
    status: 200,
  });
});

/**
 * DELETE /roles/:id
 * Delete a role and its permissions
 */
export const deleteRole = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = await RoleService.deleteRole(id);

  return successHandler(res, {
    data: deleted,
    message: 'Role deleted successfully',
    status: 200,
  });
});

export const getRoleById = asyncHandler(async (req: Request, res: Response) => {
  const role = await RoleService.getRoleById(req.params.id);
  return successHandler(res, {
    data: role,
    message: 'Role fetched successfully',
    status: 200,
  });
});