// src/controllers/adminUsers.controller.ts
import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { successHandler } from '../../utils/responseHandler';
import * as WLAdminService from './users.service';

export const getWLAdmins = asyncHandler(async (req, res) => {
  const tenantId = req.query.tenantId as string | undefined;
  const result = await WLAdminService.getWLAdmins(tenantId);
  return successHandler(res, result);
});

export const getWLAdminById = asyncHandler(async (req, res) => {
  const result = await WLAdminService.getWLAdminById(req.params.id);
  return successHandler(res, result);
});

export const createWLAdminUser = asyncHandler(async (req, res) => {
  const result = await WLAdminService.createWLAdminUser(req.body);
  return successHandler(res, result, 'WL Admin created');
});

export const updateWLAdmin = asyncHandler(async (req, res) => {
  const result = await WLAdminService.updateWLAdmin(req.params.id, req.body);
  return successHandler(res, result, 'WL Admin updated');
});

export const updateWLAdminStatus = asyncHandler(async (req, res) => {
  const result = await WLAdminService.updateWLAdminStatus(req.params.id, req.body.status);
  return successHandler(res, result, 'Status updated');
});

export const deleteWLAdmin = asyncHandler(async (req, res) => {
  const result = await WLAdminService.deleteWLAdmin(req.params.id);
  return successHandler(res, result, 'WL Admin deleted');
});


