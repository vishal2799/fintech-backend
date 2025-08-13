import { RESPONSE } from "../../constants/responseMessages";
import { asyncHandler } from "../../utils/asyncHandler";
import { successHandler } from "../../utils/responseHandler";
import { getAllAuditLogss } from "./clientAuditLogs.service";

export const getAllAuditLogs = asyncHandler(async (req, res) => {
  const logs = await getAllAuditLogss();
  return successHandler(res, {data:logs, ...RESPONSE.AUDIT_LOGS.FETCHED});
});
