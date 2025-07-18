import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { listAuditLogs } from './auditLogs.service';
import { successHandler } from '../../utils/responseHandler';

export const listLogs = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = '1',
    limit = '10',
    sortBy = 'createdAt',
    sortOrder = 'desc',
    search = '',
    module = '',
  } = req.query;

  const user = req.user!;
  const isSuperAdmin = user.roleNames.includes('SUPER_ADMIN');

  const result = await listAuditLogs({
    page: Number(page),
    limit: Number(limit),
    sortBy: String(sortBy),
    sortOrder: toSortOrder(sortOrder),
    search: String(search),
    module: String(module),
    tenantId: isSuperAdmin ? undefined : user.tenantId,
  });

  return successHandler(res, result);
});

function toSortOrder(value: any): 'asc' | 'desc' {
  return value === 'asc' || value === 'desc' ? value : 'desc';
}