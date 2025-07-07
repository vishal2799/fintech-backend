import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

// ==================== PERMISSIONS =====================
export const permissions = pgTable('permissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }),
  module: varchar('module', { length: 50 }),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow()
});