import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { tenantServiceConfig } from '../../db/schema';

export const TenantServiceConfigService = {
  // Get all services with tenant-level overrides
  async getServicesForTenant(tenantId: string) {
    const allServices = await db.query.services.findMany();

    const overrides = await db.query.tenantServiceConfig.findMany({
      where: eq(tenantServiceConfig.tenantId, tenantId),
    });

    const overrideMap = new Map(overrides.map(o => [o.serviceId, o.isEnabled]));

    return allServices.map(service => ({
      ...service,
      isEnabled: overrideMap.has(service.id)
        ? overrideMap.get(service.id)
        : service.isGlobalEnabled,
      isOverridden: overrideMap.has(service.id),
    }));
  },

  // Save overrides for tenant
  async updateTenantServiceConfig(tenantId: string, config: { serviceId: string; isEnabled: boolean }[]) {
    // Delete existing overrides for tenant
    await db.delete(tenantServiceConfig).where(eq(tenantServiceConfig.tenantId, tenantId));

    // Insert new ones
    if (config.length > 0) {
      await db.insert(tenantServiceConfig).values(
        config.map(c => ({
          tenantId,
          serviceId: c.serviceId,
          isEnabled: c.isEnabled,
        }))
      );
    }

    return true;
  }
};
