import { z } from 'zod';

export const ticketCategoryOptions = [
  'technical',
  'financial',
  'kyc',
  'transaction',
  'other',
] as const;

export const createTicketSchema = z.object({
  category: z.enum(ticketCategoryOptions),
  subject: z.string().min(3).max(100),
  description: z.string().min(5),
  attachment: z.string().optional(), // publicId or URL from Cloudinary
});

export const replyToTicketSchema = z.object({
  message: z.string().min(1),
  attachment: z.string().optional(),
});

export const assignTicketSchema = z.object({
  assignedToId: z.string().uuid(),
});

export const updateTicketStatusSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REOPENED']),
});

export const deleteTicketSchema = z.object({
  ticketId: z.string().uuid(),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type ReplyToTicketInput = z.infer<typeof replyToTicketSchema>;
export type AssignTicketInput = z.infer<typeof assignTicketSchema>;
export type UpdateTicketStatusInput = z.infer<typeof updateTicketStatusSchema>;
