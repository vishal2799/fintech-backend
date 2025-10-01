import { pgTable, uuid, decimal, text, timestamp } from 'drizzle-orm/pg-core';
import { serviceTemplates } from './serviceTemplates';
import { userLevels } from './userLevels';

export const tenantCommissions = pgTable('tenant_commissions', {
  id: uuid('id').primaryKey().defaultRandom(),

  tenantId: uuid('tenant_id').notNull(), // WL Admin ID

  serviceTemplateId: uuid('service_template_id')
    .notNull()
    .references(() => serviceTemplates.id),

  roleCode: text('role_code')
    .notNull()
    .references(() => userLevels.code), // SD / D / Retailer

  commissionPercentage: decimal('commission_percentage', { precision: 5, scale: 2 }).notNull(),
  // % of WL Admin base commission for this role

  feePercentage: decimal('fee_percentage', { precision: 5, scale: 2 }).notNull(),
  // % of WL Admin base fee for this role

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
