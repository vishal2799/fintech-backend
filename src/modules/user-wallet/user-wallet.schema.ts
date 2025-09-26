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