// schema/userWalletTransaction.ts

import { pgTable, uuid, numeric, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const userTransactionType = pgEnum('user_transaction_type', [
  'CREDIT', 'DEBIT', 'TRANSFER', 'HOLD', 'UNHOLD'
]);

export const userWalletTransaction = pgTable('user_wallet_transaction', {
  id: uuid('id').defaultRandom().primaryKey(),
  fromUserId: uuid('from_user_id'),
  toUserId: uuid('to_user_id').notNull(),
  type: userTransactionType('type').notNull(),
  amount: numeric('amount').notNull(),
  description: text('description'),
  status: text('status').default('SUCCESS'),
  initiatedBy: uuid('initiated_by').notNull(),
  tenantId: uuid('tenant_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
