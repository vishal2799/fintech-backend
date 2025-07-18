// types/express/index.d.ts or any global declaration file

import 'express';

declare module 'express' {
  interface Request {
    user?: {
      id: string;
      tenantId: string;
      roleNames: string[];
      permissions: string[];
    };
    auditContext?: {
      module?: string;
      resource?: string;
      [key: string]: any;
    };
  }
}
