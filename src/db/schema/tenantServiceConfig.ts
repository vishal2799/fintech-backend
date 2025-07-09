import { pgTable, boolean, uuid } from 'drizzle-orm/pg-core'
import { tenants } from './tenants';
import { services } from './services';

export const tenantServiceConfig = pgTable('tenant_service_config', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  serviceId: uuid('service_id').notNull().references(() => services.id),
  isEnabled: boolean('is_enabled').default(true),
});
