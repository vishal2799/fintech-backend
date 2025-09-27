import { numeric, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { userWallet } from "./userWallet";
import { users } from "./users";

export const userTransactionType = pgEnum('user_transaction_type', [
  'CREDIT', 'DEBIT', 'HOLD', 'UNHOLD'
]);

export const userTransactionMetaType = pgEnum('user_transaction_meta_type', [
  'FUND_REQUEST',
  'FUND_TRANSFER',
  'COMMISSION_PAYOUT',
  'SERVICE_PURCHASE',
  'KYC_FEE',
  'REVERSAL',
  'MANUAL_ADJUSTMENT',
  'MANUAL_CREDIT',
  'MANUAL_DEBIT',
  'HOLD_FUNDS',
  'RELEASE_FUNDS'
]);

export const userTransactionStatus = pgEnum('user_transaction_status', [
  'PENDING', 'SUCCESS', 'FAILED', 'REVERSED'
]);

export const userWalletTransaction = pgTable('user_wallet_transaction', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => userWallet.userId),
  initiatedByUserId: uuid('initiated_by_user_id').notNull().references(() => users.id),
  type: userTransactionType('type').notNull(),
  metaType: userTransactionMetaType('meta_type').notNull(), 
  amount: numeric('amount', { precision: 18, scale: 2 }).notNull(),
  description: text('description'),
  linkedTxnId: uuid('linked_txn_id'),
  status: userTransactionStatus('status').default('SUCCESS').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
