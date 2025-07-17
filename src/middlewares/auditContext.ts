import { NextFunction, Request, Response } from "express";

// middleware/auditContext.ts
export function withAuditContext(moduleName: string) {
  return function (req:Request, _res:Response, next:NextFunction) {
    req.auditContext = { module: moduleName };
    next();
  };
}
