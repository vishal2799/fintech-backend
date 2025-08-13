import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { users } from './users';

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').references(() => tenants.id, {
  onDelete: 'set null',
}),
  actorId: uuid('actor_id').references(() => users.id, {
  onDelete: 'set null',
}),
  // tenantId: text('tenant_id'),
  // actorId: text('actor_id'),            
  actorType: text('actor_type'),        
  url: text('url'),
  method: text('method'),
  module: text('module'),
  activity: text('activity'),
  createdAt: timestamp('created_at').defaultNow(),
});

  // params: text('params'),
  // query: text('query'),
  // payload: text('payload'),
  // response: text('response'),