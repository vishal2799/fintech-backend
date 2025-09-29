import { pgTable, text, boolean, uuid, timestamp } from 'drizzle-orm/pg-core'

export const serviceActions = pgTable('service_actions', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  code: text("code").notNull().unique(), // e.g., 'pan-verify'
  description: text('description'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
})
