// db/schema/serviceTemplates.ts  
import { pgTable, uuid, boolean, timestamp } from 'drizzle-orm/pg-core';
import { commissionTemplates } from './commissionTemplates';
import { serviceActions } from './serviceActions';

export const serviceTemplates = pgTable('service_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  serviceActionId: uuid('service_action_id').notNull().references(() => serviceActions.id),
  templateId: uuid('template_id').notNull().references(() => commissionTemplates.id),
  
  // Is this the default template for the service?
  isDefault: boolean('is_default').notNull().default(false),
  
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
