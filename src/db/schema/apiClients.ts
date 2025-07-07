import { integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { tenants } from "./tenants";

// ==================== API CLIENTS =====================
export const apiClients = pgTable('api_clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  clientName: varchar('client_name', { length: 100 }),
  clientKey: varchar('client_key', { length: 64 }),
  clientSecret: text('client_secret'),
  allowedIps: text('allowed_ips').array(),
  rateLimitPerMinute: integer('rate_limit_per_minute').default(60),
  status: varchar('status', { enum: ['ACTIVE', 'REVOKED'] }).default('ACTIVE'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});