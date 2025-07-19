import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

// ==================== PERMISSIONS =====================
export const permissions = pgTable('permissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }),
  module: varchar('module', { length: 50 }),
  description: text('description'),
  scope: varchar('scope', { enum: ['PLATFORM', 'TENANT', 'BOTH'] }).notNull().default('BOTH'),
  createdAt: timestamp('created_at').defaultNow()
});