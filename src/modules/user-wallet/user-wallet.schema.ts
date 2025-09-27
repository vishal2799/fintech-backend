import { z } from 'zod';

// ✅ Credit Request by User
export const requestCreditSchema = z.object({
  // tenantId: z.string(),
  // requestedByUserId: z.string(),
  amount: z.number().positive(),
  remarks: z.string().optional(),
  bankId: z.string()
});
export type RequestCreditInput = z.infer<typeof requestCreditSchema>;

export const uploadProofSchema = z.object({
  creditRequestId: z.string().uuid(),
  fileName: z.string(),
  mimeType: z.string()
});

export const updateProofSchema = z.object({
  creditRequestId: z.string().uuid(),
  fileKey: z.string()
});


// ✅ Manual Top-up by WL Admin
export const manualTopupSchema = z.object({
  memberId: z.string(),
  amount: z.number().positive(),
  description: z.string().optional(),
  // userId: z.string(), // admin performing the top-up
});
export type ManualTopupInput = z.infer<typeof manualTopupSchema>;

// ✅ Debit Wallet
export const debitWalletSchema = z.object({
  memberId: z.string(),
  amount: z.number().positive(),
  description: z.string().optional(),
  // userId: z.string(), // admin performing the debit
});
export type DebitWalletInput = z.infer<typeof debitWalletSchema>;

// ✅ Hold Wallet Amount
export const holdWalletSchema = z.object({
  memberId: z.string(),
  amount: z.number().positive(),
  description: z.string().optional(),
  // userId: z.string(), // admin performing the hold
});
export type HoldWalletInput = z.infer<typeof holdWalletSchema>;

// ✅ Release Hold Amount
export const releaseWalletSchema = z.object({
  memberId: z.string(),
  amount: z.number().positive(),
  description: z.string().optional(),
  // userId: z.string(), // admin performing the release
});
export type ReleaseWalletInput = z.infer<typeof releaseWalletSchema>;