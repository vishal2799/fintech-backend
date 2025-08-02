import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { successHandler } from '../../utils/responseHandler';
import { RESPONSE } from '../../constants/responseMessages';
import { listAuditLogs } from './auditLogs2.service';

// export const listLogs = asyncHandler(async (req: Request, res: Response) => {
//   const {
//     page = '1',
//     limit = '10',
//     sortBy = 'createdAt',
//     sortOrder = 'desc',
//     search = '',
//     module = '',
//   } = req.query;

//   const user = req.user!;
//   const isSuperAdmin = user.roleNames.includes('SUPER_ADMIN');

//   const result = await listAuditLogs({
//     page: Number(page),
//     limit: Number(limit),
//     sortBy: String(sortBy),
//     sortOrder: toSortOrder(sortOrder),
//     search: String(search),
//     module: String(module),
//     tenantId: isSuperAdmin ? undefined : user.tenantId,
//   });

//   return successHandler(res, {data: result, message: 'Audit Logs Fetched successfully', status: 200});
// });

// function toSortOrder(value: any): 'asc' | 'desc' {
//   return value === 'asc' || value === 'desc' ? value : 'desc';
// }

export const getAuditLogs = asyncHandler(async (req: Request, res: Response) => {
  // const filters = (req as any).validated
  const filters = req.query
  const data = await listAuditLogs(filters)
  return successHandler(res, { data, ...RESPONSE.AUDIT_LOGS.FETCHED })
})

export const exportAuditLogs = asyncHandler(async (req: Request, res: Response) => {
  const filters = req.query as any; // or use validated if zod used
  const exportAll = req.query.exportAll === 'true';

  const data = await listAuditLogs(filters, { exportAll });
  return successHandler(res, { data: data.result, ...RESPONSE.AUDIT_LOGS.FETCHED });
});
