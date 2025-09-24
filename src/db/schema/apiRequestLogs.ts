// db/apiRequestLogs.ts
import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { apiClients } from './apiClients';

export const apiRequestLogs = pgTable('api_request_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  apiClientId: uuid('api_client_id').notNull().references(() => apiClients.id),
  endpoint: text('endpoint').notNull(),
  method: text('method').notNull(),
  statusCode: integer('status_code').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});
