import { sql } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

export const tenantTypeEnum = pgEnum("tenant_type", ["GLOBAL", "TENANT"]);

// ==================== TENANTS =====================
export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }),
  slug: varchar('slug', { length: 100 }).unique(),
  logoUrl: text('logo_url'),
  themeColor: varchar('theme_color', { length: 20 }),
  domainCname: varchar('domain_cname', { length: 100 }).unique(),
  type: tenantTypeEnum("type").default("TENANT").notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  status: varchar('status', { enum: ['ACTIVE', 'DISABLED'] }).default('ACTIVE')
}, (table) => ({
   // ✅ enforce only one GLOBAL tenant
  onlyOneGlobalTenant: uniqueIndex("only_one_global_tenant_idx")
    .on(table.type)
    .where(sql`${table.type} = 'GLOBAL'`),
}));

