// src/controllers/roles.controller.ts
import { Request, Response } from 'express';
import { successHandler } from '../../utils/responseHandler';
import { asyncHandler } from '../../utils/asyncHandler';
import * as RoleService from './roles.service';

export const createRole = asyncHandler(async (req: Request, res: Response) => {
  const role = await RoleService.createRoleWithPermissions(req);
  return successHandler(res, {data: role, message: 'Role Created successfully', status: 201});
});

export const listRoles = asyncHandler(async (req: Request, res: Response) => {
  const roles = await RoleService.listRoles(req);
  return successHandler(res, {data: roles, message: 'Roles Fetched successfully', status: 200});
});

export const getRolePermissions = asyncHandler(async (req: Request, res: Response) => {
  const { roleId } = req.params;
  const perms = await RoleService.getPermissionsForRole(roleId);
  return successHandler(res, {data: perms, message: 'Role Permissions Fetched successfully', status: 200});
});

export const updateBasicRole = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await RoleService.updateBasicRole(id, req.body);
  return successHandler(res, {data: null, message: 'Role Updated successfully', status: 200});
});

export const deleteRole = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await RoleService.deleteRole(id);
  return successHandler(res, {data: null, message: 'Role Deleted successfully', status: 200});
});


export const updateRolePermissions = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { permissionIds } = req.body;
  await RoleService.updateRolePermissions(req, id, permissionIds);
  return successHandler(res, {data: null, message: 'Role Permissions Updated successfully', status: 200});
});

export const updateRole = asyncHandler(async (req: Request, res: Response) => {
  const roleId = req.params.id;
  const updated = await RoleService.updateRole(req, roleId, req.body);

  return successHandler(res, {
    data: updated,
    message: 'Role updated successfully',
    status: 200
  });
});
