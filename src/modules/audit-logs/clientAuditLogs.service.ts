import { desc, eq, sql } from "drizzle-orm";
import { db } from "../../db";
import { tenants, users } from "../../db/schema";
import { auditLogs } from "../../db/schema/auditLogs";


export async function getAllAuditLogss() {
  const logs = await db
  .select({
    id: auditLogs.id,
    tenantId: auditLogs.tenantId,
    tenantName: tenants.name,
    actorName: users.name,
    actorId: auditLogs.actorId,
    actorType: auditLogs.actorType,
    url: auditLogs.url,
    method: auditLogs.method,
    module: auditLogs.module,
    activity: auditLogs.activity,
    createdAt: auditLogs.createdAt
  })
  .from(auditLogs)
  .leftJoin(tenants, eq(auditLogs.tenantId, tenants.id))
  .leftJoin(users, eq(auditLogs.actorId, users.id))
  .orderBy(desc(auditLogs.createdAt));

  return logs
}
