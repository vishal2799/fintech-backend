// db/schema/auditLogs.ts
import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

// db/schema/auditLogs.ts
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: text('tenant_id'),
  actorId: text('actor_id'),            // ✅ new
  actorType: text('actor_type'),        // ✅ new
  url: text('url'),
  method: text('method'),
  module: text('module'),
  activity: text('activity'),
  params: text('params'),
  query: text('query'),
  payload: text('payload'),
  response: text('response'),
  createdAt: timestamp('created_at').defaultNow(),
});

