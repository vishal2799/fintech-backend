import { RESPONSE } from "../../constants/responseMessages";
import { asyncHandler } from "../../utils/asyncHandler";
import { successHandler } from "../../utils/responseHandler";
import { getAllAuditLogss, getTenantAuditLogss } from "./clientAuditLogs.service";

export const getAllAuditLogs = asyncHandler(async (req, res) => {
  const logs = await getAllAuditLogss();
  return successHandler(res, {data:logs, ...RESPONSE.AUDIT_LOGS.FETCHED});
});

export const getTenantAuditLogs = asyncHandler(async (req, res) => {
  const tenantId = req.user?.tenantId!;
  const logs = await getTenantAuditLogss(tenantId);
  return successHandler(res, {data:logs, ...RESPONSE.AUDIT_LOGS.FETCHED});
});
