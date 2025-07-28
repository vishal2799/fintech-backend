import { pgTable, text, timestamp, boolean, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const otp = pgTable('otp', {
  id: uuid('id').defaultRandom().primaryKey(),
  identifier: text('identifier').notNull(), // email or mobile
  otp: text('otp').notNull(),
  type: text('type').notNull(), // LOGIN, SIGNUP, etc.
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  isUsed: boolean('is_used').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
