import { Request } from "express";

export function getTenantIdFromRequest(req: Request): string {
  if (!req.user || !req.user.tenantId) {
    throw new Error('❌ Tenant ID not found in authenticated request');
  }
  return req.user.tenantId;
}