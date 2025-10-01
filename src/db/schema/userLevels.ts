// db/schema/userLevels.ts
import { pgTable, text, integer } from 'drizzle-orm/pg-core';

export const userLevels = pgTable('user_levels', {
  code: text('code').primaryKey(),       // e.g., 'company', 'super_distributor'
  name: text('name').notNull(),          // Display name
  level: integer('level').notNull(),     // 1 = highest, increasing downward
  description: text('description'),      // Optional description
});
