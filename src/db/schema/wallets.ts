import { pgTable, uuid, text, numeric, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const wallets = pgTable("wallets", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerId: uuid("owner_id").notNull(), // Could be tenantId or userId
  ownerType: text("owner_type").notNull(), // 'TENANT' | 'USER'
  balance: numeric("balance", { precision: 12, scale: 2 }).notNull().default("0.00"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
