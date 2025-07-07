// src/drizzle/schema/userRoles.ts
import { pgTable, uuid, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';
import { roles } from './roles';

// ==================== USER ROLES =====================
export const userRoles = pgTable('user_roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  roleId: uuid('role_id').notNull().references(() => roles.id),
  assignedBy: uuid('assigned_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow()
});