import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const resetTokens = pgTable("reset_tokens", {
  token: text("token").primaryKey(),
  identifier: text("identifier").notNull(), // email or phone
  expiresAt: timestamp("expires_at").notNull(),
});
