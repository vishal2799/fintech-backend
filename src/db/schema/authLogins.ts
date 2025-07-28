// db/schema/authLogins.ts
import { pgTable, uuid, varchar, timestamp, text, real } from 'drizzle-orm/pg-core';

export const authLogins = pgTable('auth_logins', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id'),
  email: varchar('email', { length: 255 }).notNull(),
  status: varchar('status', { length: 20 }).notNull(), // 'SUCCESS' | 'FAILED'
  reason: text('reason'),
  ipAddress: varchar('ip_address', { length: 64 }),
  latitude: real('latitude'),
  longitude: real('longitude'),
  accuracy: real('accuracy'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow(),
});
