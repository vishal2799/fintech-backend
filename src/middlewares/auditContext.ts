// middleware/auditContext.ts
import { Request, Response, NextFunction } from 'express';

export function withAuditContext(module: string, resource?: string) {
  return function (req: Request, _res: Response, next: NextFunction) {
    req.auditContext = {
      module,
      resource: resource || 'Resource',
    };
    next();
  };
}
