import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

// ==================== TENANTS =====================
export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }),
  slug: varchar('slug', { length: 100 }),
  logoUrl: text('logo_url'),
  themeColor: varchar('theme_color', { length: 20 }),
  domainCname: varchar('domain_cname', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  status: varchar('status', { enum: ['ACTIVE', 'DISABLED'] }).default('ACTIVE')
});