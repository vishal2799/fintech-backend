// db/schema/commissionTemplates.ts
import { pgTable, uuid, varchar, boolean, decimal, timestamp, text, integer } from 'drizzle-orm/pg-core';

export const commissionTemplates = pgTable('commission_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description'),
  
  // Commission Configuration
  hasCommission: boolean('has_commission').notNull().default(false),
  commissionType: varchar('commission_type', { length: 20 }), // 'fixed', 'percentage'
  commissionValue: decimal('commission_value', { precision: 10, scale: 4 }), // For fixed/percentage only
  
  // Fee Configuration  
  hasFee: boolean('has_fee').notNull().default(false),
  feeType: varchar('fee_type', { length: 20 }), // 'fixed', 'percentage'
  feeValue: decimal('fee_value', { precision: 10, scale: 4 }), // For fixed/percentage only
  
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});