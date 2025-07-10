import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';

// ==================== ROLES =====================
export const roles = pgTable('roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).notNull(), // SUPER_ADMIN, KYC_OFFICER, etc.
  scope: varchar('scope', { enum: ['PLATFORM', 'TENANT'] }).notNull(),
  tenantId: uuid('tenant_id').references(() => tenants.id), // Null for platform-level roles
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow()
});
