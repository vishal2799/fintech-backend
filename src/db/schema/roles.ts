import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';

// ==================== ROLES =====================
export const roles = pgTable('roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }), // SUPER_ADMIN, WL_ADMIN, etc.
  scope: varchar('scope', { enum: ['PLATFORM', 'TENANT'] }),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow()
});