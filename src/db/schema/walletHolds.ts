// db/schema/walletHolds.ts

import { pgTable, uuid, varchar, numeric, timestamp, text } from "drizzle-orm/pg-core";
import { wallets } from "./wallets";

export const walletHolds = pgTable("wallet_holds", {
  id: uuid("id").primaryKey().defaultRandom(),
  walletId: uuid("wallet_id").notNull().references(() => wallets.id),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  reason: text("reason"),
  createdBy: uuid("created_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

