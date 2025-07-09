import 'express';

declare module 'express' {
  interface Request {
    user?: {
      id: string;
      tenantId: string;
      roleNames: string[];
      permissions: string[];
    };
  }
}
