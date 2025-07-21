// db/schema/walletTransactions.ts
import { pgTable, uuid, varchar, decimal, timestamp, text, numeric } from "drizzle-orm/pg-core";
import { wallets } from "./wallets";

export const walletTransactions = pgTable("wallet_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  walletId: uuid("wallet_id").notNull().references(() => wallets.id),
  type: text("type").notNull(), // 'CREDIT' | 'DEBIT'
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  balanceBefore: numeric("balance_before", { precision: 12, scale: 2 }).notNull(),
  balanceAfter: numeric("balance_after", { precision: 12, scale: 2 }).notNull(),
  remarks: text("remarks"),
  createdBy: uuid("created_by"), // Who performed it (maybe admin/user)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

