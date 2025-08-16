// schema/prewarmLogs.ts
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const prewarmLogs = pgTable("prewarm_logs", {
  id: serial("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  status: text("status").default("pending"), // pending / done
});
