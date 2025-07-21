// schema/tenantWallet.ts

import { pgTable, uuid, numeric, timestamp } from 'drizzle-orm/pg-core';

export const tenantWallet = pgTable('tenant_wallet', {
  tenantId: uuid('tenant_id').primaryKey(),  // same as tenant table ID
  balance: numeric('balance').default('0').notNull(),
  heldAmount: numeric('held_amount').default('0').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
