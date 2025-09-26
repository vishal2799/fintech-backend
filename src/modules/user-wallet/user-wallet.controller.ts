import { Request, Response } from "express";
import { AppError } from "../../utils/AppError";
import { asyncHandler } from "../../utils/asyncHandler";
import { ERRORS } from "../../constants/errorCodes";
import { successHandler } from "../../utils/responseHandler";
import * as WalletService from './user-wallet.service';
import { RequestCreditInput } from "./user-wallet.schema";
import { db } from "../../db";
import { eq } from "drizzle-orm";
import { fundRequest, tenants } from "../../db/schema";
import * as storageService from "../../services/storage.service";

export const getWalletBalance = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new AppError(ERRORS.USER_NOT_FOUND);

  const balance = await WalletService.getUserWalletBalance(userId);
  return successHandler(res, { data: balance, message: 'Fetched wallet balance successfully' });
});

export const getWalletLedger = asyncHandler(async (req: Request, res: Response) => {
   const userId = req.user?.id;
  if (!userId) throw new AppError(ERRORS.USER_NOT_FOUND);

  const ledger = await WalletService.getUserWalletLedger(userId);
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
   const userId = req.user?.id;
  if (!userId) throw new AppError(ERRORS.USER_NOT_FOUND);

  const data = await WalletService.getCreditRequestsByUser(userId);
  return successHandler(res, { data, message: 'Credit Requests Fetched Successfully' });
});

export const getProofUploadUrl = asyncHandler(async (req, res) => {
    const tenantId = req.user?.tenantId;
    if (!tenantId) throw new AppError(ERRORS.TENANT_NOT_FOUND);

    const tenant = await db.query.tenants.findFirst({ where: eq(tenants.id, tenantId) });

    if (!tenant) throw new AppError(ERRORS.TENANT_NOT_FOUND);
    const { creditRequestId, fileName, mimeType } = (req as any).validated;

  const creditRequestt = await db.query.fundRequest.findFirst({ where: eq(fundRequest?.id, creditRequestId) });
  if (!creditRequestt) throw new AppError(ERRORS.CREDIT_REQUEST_NOT_FOUND);

  const { uploadUrl, fileKey } = await storageService.generateUploadUrl(tenantId, fileName, mimeType, 'receipt', '', creditRequestId);
  return successHandler(res, { data: { uploadUrl, fileKey } });
});


export const updateProofKey = asyncHandler(async (req, res) => {
  const { creditRequestId, fileKey } = (req as any).validated;

  const creditRequestt = await db.query.fundRequest.findFirst({ where: eq(fundRequest.id, creditRequestId) });
  if (!creditRequestt) throw new AppError(ERRORS.CREDIT_REQUEST_NOT_FOUND);

  await db.update(fundRequest)
    .set({ proofUrl: fileKey, updatedAt: new Date() })
    .where(eq(fundRequest.id, creditRequestId));

  return successHandler(res, { data: fileKey });
});

export const getProofUrl = asyncHandler(async (req, res) => {
  const { creditRequestId } = req.params;
  const creditRequestt = await db.query.fundRequest.findFirst({ where: eq(fundRequest.id, creditRequestId) });
  if (!creditRequestt) throw new AppError(ERRORS.CREDIT_REQUEST_NOT_FOUND);

  if (!creditRequestt.proofUrl) return successHandler(res, { data: {downloadUrl: null} });

  const downloadUrl = await storageService.generateDownloadUrl(creditRequestt.proofUrl);
  return successHandler(res, { data: {downloadUrl, fileKey: creditRequestt.proofUrl} });
});