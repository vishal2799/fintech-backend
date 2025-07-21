// schema/creditRequest.ts

import { pgTable, uuid, numeric, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const creditRequestStatus = pgEnum('credit_request_status', [
  'PENDING', 'APPROVED', 'REJECTED'
]);

export const creditRequest = pgTable('credit_request', {
  id: uuid('id').defaultRandom().primaryKey(),
  fromTenantId: uuid('from_tenant_id').notNull(),
  toUserId: uuid('to_user_id').notNull(),           // super admin approver
  amount: numeric('amount').notNull(),
  status: creditRequestStatus('status').default('PENDING').notNull(),
  requestedByUserId: uuid('requested_by_user_id').notNull(),
  approvedByUserId: uuid('approved_by_user_id'),
  remarks: text('remarks'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
