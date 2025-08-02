import { z } from 'zod'

export const getAuditLogsSchema = z.object({
  pageIndex: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  sortBy: z.string().optional(), // `${string}.asc` or `.desc`
  activity: z.string().optional(),
  module: z.string().optional(),
  method: z.string().optional(),
  url: z.string().optional(),
  actorId: z.string().optional(),
})
