// schema/tenantWalletTransaction.ts

import { pgTable, uuid, numeric, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { tenantWallet } from './tenantWallet';

export const tenantTransactionType = pgEnum('tenant_transaction_type', [
  'CREDIT', 'DEBIT', 'HOLD', 'UNHOLD'
]);

export const tenantTransactionMetaType = pgEnum('tenant_transaction_meta_type', [
  'FUND_TOPUP',         // SA to tenant
  'FUND_TRANSFER',      // tenant to SD/D/R
  'COMMISSION_PAYOUT',
  'SERVICE_PURCHASE',
  'KYC_FEE',
  'REVERSAL',
  'MANUAL_ADJUSTMENT',
  'MANUAL_DEBIT'
]);

export const tenantWalletTransaction = pgTable('tenant_wallet_transaction', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').notNull().references(() => tenantWallet.tenantId),
  type: tenantTransactionType('type').notNull(),
  metaType: tenantTransactionMetaType('meta_type').notNull(), // real-world reason
  amount: numeric('amount').notNull(),
  description: text('description'),
  referenceUserId: uuid('reference_user_id'),     // who triggered it
  relatedUserId: uuid('related_user_id'),         // e.g., SD/Distributor wallet receiver
  linkedTxnId: uuid('linked_txn_id'),             // Optional: link to user_wallet txn
  status: text('status').default('SUCCESS'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
