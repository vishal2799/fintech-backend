// db/schema/services.ts

import { pgTable, text, boolean, uuid, timestamp } from 'drizzle-orm/pg-core'

export const services = pgTable('services', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  code: text("code").notNull().unique(), // e.g., 'dmt', 'bbps'
  description: text('description'),
  isGlobalEnabled: boolean("is_global_enabled").default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
})
