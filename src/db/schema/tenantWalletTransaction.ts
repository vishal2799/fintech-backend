// schema/tenantWalletTransaction.ts

import { pgTable, uuid, numeric, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { tenantWallet } from './tenantWallet';

export const tenantTransactionType = pgEnum('tenant_transaction_type', [
  'CREDIT', 'DEBIT', 'HOLD', 'UNHOLD'
]);

export const tenantTransactionMetaType = pgEnum('tenant_transaction_meta_type', [
  'FUND_TOPUP',         
  'FUND_TRANSFER',      
  'COMMISSION_PAYOUT',
  'SERVICE_PURCHASE',
  'KYC_FEE',
  'REVERSAL',
  'MANUAL_ADJUSTMENT',
  'MANUAL_DEBIT',
  'HOLD_FUNDS',
  'RELEASE_FUNDS'
]);

export const tenantWalletTransaction = pgTable('tenant_wallet_transaction', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').notNull().references(() => tenantWallet.tenantId),
  type: tenantTransactionType('type').notNull(),
  metaType: tenantTransactionMetaType('meta_type').notNull(), 
  amount: numeric('amount').notNull(),
  description: text('description'),
  referenceUserId: uuid('reference_user_id'),     
  relatedUserId: uuid('related_user_id'),         
  linkedTxnId: uuid('linked_txn_id'),             
  status: text('status').default('SUCCESS'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
