// src/controllers/roles.controller.ts
import { Request, Response } from 'express';
import { successHandler } from '../../utils/responseHandler';
import { asyncHandler } from '../../utils/asyncHandler';
import * as RoleService from './roles.service';

export const createTenantRoleWithPermissions = asyncHandler(async (req: Request, res: Response) => {
  const result = await RoleService.createTenantRoleWithPermissions(req);
  return successHandler(res, {data: result, message: 'Role Created successfully', status: 201});
});

export const listTenantRoles = asyncHandler(async (req: Request, res: Response) => {
  const roles = await RoleService.listTenantRoles(req);
  return successHandler(res, {data: roles, message: 'Roles Fetched successfully', status: 200});
});

export const getPermissionsForRole = asyncHandler(async (req: Request, res: Response) => {
  const permissions = await RoleService.getPermissionsForRole(req.params.roleId);
  return successHandler(res, {data: permissions, message: 'Permissions Fetched successfully', status: 200});

});

export const updateRole = asyncHandler(async (req: Request, res: Response) => {
  await RoleService.updateRole(req.params.id, req.body);
  return successHandler(res, {data: null, message: 'Role Updated successfully', status: 200});
});

export const deleteRole = asyncHandler(async (req: Request, res: Response) => {
  await RoleService.deleteRole(req.params.id);
  return successHandler(res, {data: null, message: 'Role Deleted successfully', status: 200});
});

export const updateRolePermissions = asyncHandler(async (req: Request, res: Response) => {
  await RoleService.updateRolePermissions(req.params.roleId, req.body.permissionIds);
  return successHandler(res, {data: null, message: 'Permissions Updated successfully', status: 200});
});
