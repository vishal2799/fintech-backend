import { pgTable, uuid, varchar, numeric, boolean, timestamp } from 'drizzle-orm/pg-core';
import { services } from './services';
import { serviceOperators } from './serviceOperators';

export const serviceCharges = pgTable('service_charges', {
  id: uuid('id').primaryKey().defaultRandom(),
  serviceId: uuid('service_id').notNull().references(() => services.id),
  operatorId: uuid('operator_id').references(() => serviceOperators.id), // NULL if generic service
  value: numeric('value', { precision: 10, scale: 2 }).notNull(), // charge value
  valueType: varchar('value_type', { length: 20 }).notNull(), // PERCENTAGE | FIXED
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
