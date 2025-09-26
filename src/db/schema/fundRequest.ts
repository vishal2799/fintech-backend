import { numeric, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
import { tenants } from "./tenants";
import { companyBankAccounts } from "./companyBankAccounts";

export const fundRequestStatus = pgEnum('fund_request_status', [
  'PENDING', 'APPROVED', 'REJECTED'
]);

export const fundRequest = pgTable('fund_request', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id), // WL Admin tenant
  bankId: uuid('bank_id').notNull().references(() => companyBankAccounts.id),
  amount: numeric('amount', { precision: 18, scale: 2 }).notNull(),
  status: fundRequestStatus('status').default('PENDING').notNull(),
  requestedByUserId: uuid('requested_by_user_id').notNull().references(() => users.id),
  approvedByUserId: uuid('approved_by_user_id'),
  remarks: text('remarks'),
  proofUrl: text('proof_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
