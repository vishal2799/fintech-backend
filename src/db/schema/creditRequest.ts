import { pgTable, uuid, numeric, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { companyBankAccounts } from './companyBankAccounts';

export const creditRequestStatus = pgEnum('credit_request_status', [
  'PENDING', 'APPROVED', 'REJECTED'
]);


export const creditRequestMethod = pgEnum('credit_request_method', [
  'PAYMENT_GATEWAY',
  'VIRTUAL_ACCOUNT',
  'MANUAL_BANK',
]);

export const creditRequest = pgTable('credit_request', {
  id: uuid('id').defaultRandom().primaryKey(),
  fromTenantId: uuid('from_tenant_id').notNull(),
  bankId: uuid('bank_id').notNull().references(() => companyBankAccounts.id),
  amount: numeric('amount').notNull(),
  status: creditRequestStatus('status').default('PENDING').notNull(),
  requestedByUserId: uuid('requested_by_user_id').notNull(),
  approvedByUserId: uuid('approved_by_user_id'),
  remarks: text('remarks'),
  proofUrl: text('proof_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// export const creditRequest = pgTable('credit_request', {
//   id: uuid('id').defaultRandom().primaryKey(),
//   fromTenantId: uuid('from_tenant_id').notNull(),
//   amount: numeric('amount').notNull(),
//   method: creditRequestMethod('method').notNull(),
//   status: creditRequestStatus('status').default('PENDING').notNull(),
//   requestedByUserId: uuid('requested_by_user_id').notNull(),
//   approvedByUserId: uuid('approved_by_user_id'),
//   remarks: text('remarks'),
//   createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
//   updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
// });

// export const manualCreditRequest = pgTable('manual_credit_request', {
//   id: uuid('id').defaultRandom().primaryKey(),
//   creditRequestId: uuid('credit_request_id')
//     .notNull()
//     .references(() => creditRequest.id),
//   bankAccountId: uuid('bank_account_id')
//     .notNull()
//     .references(() => companyBankAccounts.id),
//   utrNumber: text('utr_number').notNull(),
//   paymentDate: timestamp('payment_date', { withTimezone: true }).notNull(),
//   proofUrl: text('proof_url').notNull(),
//   remarks: text('remarks'),
//    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
//   updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
// });
