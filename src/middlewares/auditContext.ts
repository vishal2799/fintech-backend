import type { Request, Response, NextFunction } from 'express';

type AuditContext = {
  module: string;
  resource: string;
};

declare module 'express-serve-static-core' {
  interface Request {
    auditContext?: AuditContext;
  }
}

export function withAuditContext(module: string, resource = 'Resource') {
  return (req: Request, _res: Response, next: NextFunction) => {
    req.auditContext = { module, resource };
    next();
  };
}
