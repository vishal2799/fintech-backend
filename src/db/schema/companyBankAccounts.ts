import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';

export const companyBankAccounts = pgTable('company_bank_accounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  bankName: varchar('bank_name', { length: 255 }).notNull(),
  accountNumber: varchar('account_number', { length: 50 }).notNull(),
  accountHolderName: varchar('account_holder_name', { length: 255 }).notNull(),
  ifscCode: varchar('ifsc_code', { length: 20 }).notNull(),
  branchName: varchar('branch_name', { length: 255 }),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
