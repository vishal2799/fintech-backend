import { pgTable, text, uuid, timestamp, varchar, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users';
import { tenants } from './tenants';

export const ticketStatusEnum = pgEnum('ticket_status', ['OPEN', 'IN_PROGRESS', 'CLOSED']);
export const ticketPriorityEnum = pgEnum('ticket_priority', ['LOW', 'MEDIUM', 'HIGH']);

export const supportTickets = pgTable('support_tickets', {
  id: uuid('id').primaryKey().defaultRandom(),
  subject: varchar('subject', { length: 255 }).notNull(),
  description: text('description').notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  status: ticketStatusEnum('status').notNull().default('OPEN'),
  priority: ticketPriorityEnum('priority').default('MEDIUM'),
  attachmentUrl: text('attachment_url'),

  userId: uuid('user_id').references(() => users.id).notNull(),
  tenantId: uuid('tenant_id').references(() => tenants.id).notNull(),
  assignedTo: uuid('assigned_to').references(() => users.id), // optional assignment

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const supportReplies = pgTable('support_replies', {
  id: uuid('id').primaryKey().defaultRandom(),
  ticketId: uuid('ticket_id').references(() => supportTickets.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  message: text('message').notNull(),
  attachmentUrl: text('attachment_url'),

  createdAt: timestamp('created_at').defaultNow(),
});

export const supportTicketLogs = pgTable('support_ticket_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  ticketId: uuid('ticket_id').references(() => supportTickets.id).notNull(),
  action: varchar('action', { length: 100 }).notNull(), // e.g. 'ASSIGNED', 'STATUS_CHANGED'
  performedBy: uuid('performed_by').references(() => users.id).notNull(),
  previousValue: text('previous_value'),
  newValue: text('new_value'),
  createdAt: timestamp('created_at').defaultNow(),
});
