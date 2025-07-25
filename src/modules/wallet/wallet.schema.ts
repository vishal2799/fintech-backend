import { z } from 'zod';

// ✅ Credit Request by WL Admin
export const requestCreditSchema = z.object({
  tenantId: z.string(),
  requestedByUserId: z.string(),
  amount: z.number().positive(),
  remarks: z.string().optional(),
});
export type RequestCreditInput = z.infer<typeof requestCreditSchema>;

// ✅ Approve/Reject Credit Request by Super Admin
export const approveRejectSchema = z.object({
  requestId: z.string(),
  approvedByUserId: z.string(),
  remarks: z.string().optional(), // used for rejection
});
export type ApproveRejectInput = z.infer<typeof approveRejectSchema>;

// ✅ Manual Top-up by Super Admin
export const manualTopupSchema = z.object({
  tenantId: z.string(),
  amount: z.number().positive(),
  description: z.string().optional(),
  userId: z.string(), // super admin performing the top-up
});
export type ManualTopupInput = z.infer<typeof manualTopupSchema>;

// ✅ Debit Wallet
export const debitWalletSchema = z.object({
  tenantId: z.string(),
  amount: z.number().positive(),
  description: z.string().optional(),
  userId: z.string(), // admin performing the debit
});
export type DebitWalletInput = z.infer<typeof debitWalletSchema>;

// ✅ Hold Wallet Amount
export const holdWalletSchema = z.object({
  tenantId: z.string(),
  amount: z.number().positive(),
  description: z.string().optional(),
  userId: z.string(), // admin performing the hold
});
export type HoldWalletInput = z.infer<typeof holdWalletSchema>;

// ✅ Release Hold Amount
export const releaseWalletSchema = z.object({
  tenantId: z.string(),
  amount: z.number().positive(),
  description: z.string().optional(),
  userId: z.string(), // admin performing the release
});
export type ReleaseWalletInput = z.infer<typeof releaseWalletSchema>;
