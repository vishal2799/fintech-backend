import { AnyPgColumn, boolean, integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { tenants } from "./tenants";

// ==================== USERS =====================
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  parentId: uuid("parent_id").references((): AnyPgColumn => users.id),
  name: varchar('name', { length: 100 }),
  email: varchar('email', { length: 150 }),
  mobile: varchar('mobile', { length: 20 }),
  passwordHash: text('password_hash'),
  isEmployee: boolean('is_employee').default(false), // true for employee users
staticRole: varchar('static_role', {
  enum: ['SUPER_ADMIN', 'WL_ADMIN', 'SD', 'D', 'R','EMPLOYEE'],
}),
  isVerified: boolean('is_verified').default(false),
  status: varchar('status', { enum: ['ACTIVE', 'BLOCKED', 'LOCKED'] }).default('ACTIVE'),
  loginAttempts: integer('login_attempts').default(0),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});