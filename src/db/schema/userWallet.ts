import { numeric, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

export const userWallet = pgTable('user_wallet', {
  userId: uuid('user_id').primaryKey().references(() => users.id),
  balance: numeric('balance', { precision: 18, scale: 2 }).default('0').notNull(),
  heldAmount: numeric('held_amount', { precision: 18, scale: 2 }).default('0').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
