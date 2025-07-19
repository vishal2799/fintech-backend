// types/express/index.d.ts or any global declaration file

import 'express';

declare module 'express' {
  interface Request {
    user?: {
      id: string;
      tenantId: string;
      roleNames: string[];
      permissions: string[];
      staticRole?: 'SUPER_ADMIN' | 'WL_ADMIN' | 'SD' | 'D' | 'R' | 'EMPLOYEE';
      isEmployee?: boolean;
    };
    auditContext?: {
      module?: string;
      resource?: string;
      [key: string]: any;
    };
  }
}
