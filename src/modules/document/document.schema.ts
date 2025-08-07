import { z } from 'zod';

export const uploadDocumentSchema = z.object({
  type: z.string().min(1), // e.g., 'kyc', 'receipt'
});

export const deleteDocumentSchema = z.object({
  publicId: z.string().min(1),
});

export const signedUrlSchema = z.object({
  publicId: z.string().min(1),
  resourceType: z.enum(['image', 'video', 'raw', 'auto']).default('image'),
});
