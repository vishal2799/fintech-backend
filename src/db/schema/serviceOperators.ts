import { pgTable, uuid, varchar, boolean, timestamp } from 'drizzle-orm/pg-core';
import { services } from './services';

export const serviceOperators = pgTable('service_operators', {
  id: uuid('id').primaryKey().defaultRandom(),
  serviceId: uuid('service_id').notNull().references(() => services.id),
  name: varchar('name', { length: 100 }).notNull(), // e.g., Airtel, SBI, IRCTC
  code: varchar('code', { length: 50 }).notNull(),  // e.g., AIRTEL_PRE, SBI_IMPS
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
