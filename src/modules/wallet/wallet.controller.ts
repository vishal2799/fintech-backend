import { Request, Response } from 'express';
import * as WalletService from './wallet.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { successHandler } from '../../utils/responseHandler';
import { AppError } from '../../utils/AppError';

// Super Admin

export const createTenantWallet = asyncHandler(async (req: Request, res: Response) => {
  const { tenantId } = req.body;

  if (!tenantId) throw new AppError('Tenant ID is required', 400);

  await WalletService.ensureTenantWalletExists(tenantId);

  return successHandler(res, {data: null, message: 'Tenant wallet created or already exists'});
});


export const getAllCreditRequests = asyncHandler(async (_req: Request, res: Response) => {
  const data = await WalletService.getAllCreditRequests();
  return successHandler(res, { data });
});

export const approveCreditRequest = asyncHandler(async (req: Request, res: Response) => {
  const requestId = req.params.id;
  const approvedByUserId = req.user?.id;

  if (!approvedByUserId) throw new AppError('Invalid Approved By User ID', 403);
  
  const result = await WalletService.approveCreditRequest({ requestId, approvedByUserId });
  return successHandler(res, { data: result, message: 'Request approved' });
});

export const rejectCreditRequest = asyncHandler(async (req: Request, res: Response) => {
  const requestId = req.params.id;
  const { remarks } = req.body;
  const approvedByUserId = req.user?.id;

  if (!approvedByUserId) throw new AppError('Invalid Approved By User ID', 403);


  const result = await WalletService.rejectCreditRequest({ requestId, approvedByUserId, remarks });
  return successHandler(res, { data: result, message: 'Request rejected' });
});

export const manualTopupTenantWallet = asyncHandler(async (req: Request, res: Response) => {
  const { tenantId, amount, description } = req.body;
  const userId = req.user?.id;

  if (!userId) throw new AppError('Invalid User ID', 403);

  const result = await WalletService.manualTopupTenantWallet({ tenantId, amount, userId, description });
  return successHandler(res, { data: result, message: 'Tenant wallet credited successfully' });
});


// WL Admin 
export const getWalletBalance = asyncHandler(async (req: Request, res: Response) => {
  const tenantId = req.user?.tenantId;

  if (!tenantId) throw new AppError('Invalid Tenant', 403);

  const balance = await WalletService.getTenantWalletBalance(tenantId);
  return successHandler(res, { data: balance });
});

export const getWalletLedger = asyncHandler(async (req: Request, res: Response) => {
  const tenantId = req.user?.tenantId;

  if (!tenantId) throw new AppError('Invalid Tenant', 403);

  const txns = await WalletService.getTenantWalletLedger(tenantId);
  return successHandler(res, { data: txns });
});

export const requestCredit = asyncHandler(async (req: Request, res: Response) => {
  const { amount, remarks } = req.body;
  const tenantId = req.user?.tenantId;

  if (!tenantId) throw new AppError('Invalid Tenant', 403);

  const requestedByUserId = req.user?.id;

  if (!requestedByUserId) throw new AppError('Invalid Requested By User ID', 403);

  const result = await WalletService.requestCredit({
    tenantId,
    amount,
    // toUserId,
    requestedByUserId,
    remarks,
  });

  return successHandler(res, { data: result, message: 'Request submitted' });
});