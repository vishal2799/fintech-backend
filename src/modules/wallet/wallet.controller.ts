import { Request, Response } from 'express';
import * as WalletService from './wallet.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { successHandler } from '../../utils/responseHandler';
import { AppError } from '../../utils/AppError';
import {
  manualTopupSchema,
  requestCreditSchema,
  approveRejectSchema,
  debitWalletSchema,
  holdWalletSchema,
  releaseWalletSchema,
  RequestCreditInput,
  ReleaseWalletInput,
  HoldWalletInput,
  DebitWalletInput,
  ManualTopupInput,
} from './wallet.schema';
import { ERRORS } from '../../constants/errorCodes';

// ✅ Super Admin APIs

export const createTenantWallet = asyncHandler(async (req: Request, res: Response) => {
  const { tenantId } = req.body;
  if (!tenantId) throw new AppError(ERRORS.INVALID_TENANT);

  await WalletService.ensureTenantWalletExists(tenantId);
  return successHandler(res, {data: null, message: 'Wallet ensured' });
});

export const getAllCreditRequests = asyncHandler(async (_req: Request, res: Response) => {
  const data = await WalletService.getAllCreditRequests();
  return successHandler(res, { data, message: 'Fetched All Credit Requests Successfully' });
});

export const approveCreditRequest = asyncHandler(async (req: Request, res: Response) => {
  const input = approveRejectSchema.parse({
    requestId: req.params.id,
    approvedByUserId: req.user?.id,
  });

  const result = await WalletService.approveCreditRequest(input);
  return successHandler(res, { data: result, message: 'Request approved' });
});

export const rejectCreditRequest = asyncHandler(async (req: Request, res: Response) => {
  const input = approveRejectSchema.parse({
    requestId: req.params.id,
    approvedByUserId: req.user?.id,
    remarks: req.body.remarks,
  });

  const result = await WalletService.rejectCreditRequest(input);
  return successHandler(res, { data: result, message: 'Request rejected' });
});

export const manualTopupTenantWallet = asyncHandler(async (req: Request, res: Response) => {
  const input = (req as any).validated as ManualTopupInput;

  const userId = req.user?.id;

  if (!userId) {
  throw new AppError(ERRORS.USER_NOT_FOUND);
}

const fullInput = {
  ...input,
  userId
};

  const result = await WalletService.manualTopupTenantWallet(fullInput);
  return successHandler(res, { data: result, message: 'Wallet credited' });
});

export const debitTenantWallet = asyncHandler(async (req: Request, res: Response) => {
  const input = (req as any).validated as DebitWalletInput;

  const userId = req.user?.id;

  if (!userId) {
  throw new AppError(ERRORS.USER_NOT_FOUND);
}

const fullInput = {
  ...input,
  userId
};

  const result = await WalletService.debitTenantWallet(fullInput);
  return successHandler(res, { data: result, message: 'Wallet debited' });
});

export const holdTenantWalletAmount = asyncHandler(async (req: Request, res: Response) => {
  const input = (req as any).validated as HoldWalletInput;

  const userId = req.user?.id;

  if (!userId) {
  throw new AppError(ERRORS.USER_NOT_FOUND);
}

const fullInput = {
  ...input,
  userId
};

  const result = await WalletService.holdTenantFunds(fullInput);
  return successHandler(res, { data: result, message: 'Amount held' });
});

export const releaseTenantWalletHold = asyncHandler(async (req: Request, res: Response) => {
  const input = (req as any).validated as ReleaseWalletInput;

const userId = req.user?.id;

if (!userId) {
  throw new AppError(ERRORS.USER_NOT_FOUND);
}

const fullInput = {
  ...input,
  userId
};

  const result = await WalletService.releaseHeldFunds(fullInput);
  return successHandler(res, { data: result, message: 'Hold released' });
});

// ✅ WL Admin APIs

export const getWalletBalance = asyncHandler(async (req: Request, res: Response) => {
  const tenantId = req.user?.tenantId;
  if (!tenantId) throw new AppError(ERRORS.INVALID_TENANT);

  const balance = await WalletService.getTenantWalletBalance(tenantId);
  return successHandler(res, { data: balance, message: 'Fetched wallet balance successfully' });
});

export const getWalletLedger = asyncHandler(async (req: Request, res: Response) => {
  const tenantId = req.user?.tenantId;
  if (!tenantId) throw new AppError(ERRORS.INVALID_TENANT);

  const ledger = await WalletService.getTenantWalletLedger(tenantId);
  return successHandler(res, { data: ledger, message: 'Fetched wallet ledger successfully' });
});

export const requestCredit = asyncHandler(async (req: Request, res: Response) => {

  const input = (req as any).validated as RequestCreditInput;
  
const tenantId = req.user?.tenantId;
const requestedByUserId = req.user?.id;

if (!tenantId || !requestedByUserId) {
  throw new AppError(ERRORS.INVALID_TENANT);
}

const fullInput = {
  ...input,
  tenantId,
  requestedByUserId,
};


  const result = await WalletService.requestCredit(fullInput);
  return successHandler(res, { data: result, message: 'Credit request submitted' });
});

export const getMyCreditRequests = asyncHandler(async (req: Request, res: Response) => {
  const tenantId = req.user?.tenantId;
  if (!tenantId) throw new AppError(ERRORS.INVALID_TENANT);

  const data = await WalletService.getCreditRequestsByTenant(tenantId);
  return successHandler(res, { data, message: 'Credit Requests Fetched Successfully' });
});

export const listTenantWallets = asyncHandler(async (_req, res) => {
  const data = await WalletService.getAllTenantWallets();
  return successHandler(res, {
    data,
    message: 'Tenant wallet list fetched successfully',
    status: 200,
  });
});
