// schema/userWallet.ts

import { pgTable, uuid, numeric, timestamp } from 'drizzle-orm/pg-core';

export const userWallet = pgTable('user_wallet', {
  userId: uuid('user_id').primaryKey(),  // matches user table
  tenantId: uuid('tenant_id').notNull(), // for scoping
  balance: numeric('balance').default('0').notNull(),
  heldAmount: numeric('held_amount').default('0').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
