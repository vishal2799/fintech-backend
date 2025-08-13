import { z } from 'zod';

export const createCompanyBankAccountSchema = z.object({
  bankName: z.string().min(2, 'Bank name is required'),
  accountNumber: z.string().min(5, 'Account number is required'),
  accountHolderName: z.string().min(2, 'Account holder name is required'),
  ifscCode: z.string().min(5, 'IFSC code is required'),
  branchName: z.string().optional(),
});

export const updateCompanyBankAccountSchema = createCompanyBankAccountSchema.partial();
