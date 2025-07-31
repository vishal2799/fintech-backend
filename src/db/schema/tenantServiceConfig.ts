import { pgTable, boolean, uuid } from 'drizzle-orm/pg-core'
import { tenants } from './tenants';
import { services } from './services';

export const tenantServiceConfig = pgTable('tenant_service_config', {
  id: uuid('id').primaryKey().defaultRandom(),

  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  serviceId: uuid('service_id').notNull().references(() => services.id),

  // Super Admin's override for tenant (defaults to inherit from isGlobalEnabled)
  isTenantGloballyEnabled: boolean('is_tenant_globally_enabled').default(true),

  // WL Admin's own portal-level toggle for this service
  isTenantPortalEnabled: boolean('is_tenant_portal_enabled').default(true),
});
