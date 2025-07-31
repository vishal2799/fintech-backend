import { and, eq } from 'drizzle-orm';
import { db } from '../../db';
import { services, tenantServiceConfig } from '../../db/schema';

export const TenantServiceConfigService = {
  // Get services for Super Admin management

  async getServicesForTenant(tenantId: string) {
  // Step 1: Get globally enabled services
  const globalServices = await db.query.services.findMany({
    where: eq(services.isGlobalEnabled, true),
  });

  // Step 2: Get tenant-specific overrides
  const tenantConfigs = await db.query.tenantServiceConfig.findMany({
    where: eq(tenantServiceConfig.tenantId, tenantId),
  });

  const configMap = new Map(tenantConfigs.map(c => [c.serviceId, c]));

  // Step 3: Merge global services with tenant config
  return globalServices.map(service => {
    const config = configMap.get(service.id);
    return {
      id: service.id,
      name: service.name,
      code: service.code,
      description: service.description,
      isTenantGloballyEnabled: config?.isTenantGloballyEnabled ?? false,
      isTenantPortalEnabled: config?.isTenantPortalEnabled ?? false,
      isOverridden: !!config,
    };
  });
},

  // Super Admin updates tenant-level global service toggles
  async updateTenantServiceConfig(
  tenantId: string,
  config: { serviceId: string; isTenantGloballyEnabled: boolean }[]
) {
  for (const { serviceId, isTenantGloballyEnabled } of config) {
    const existing = await db.query.tenantServiceConfig.findFirst({
      where: and(
        eq(tenantServiceConfig.tenantId, tenantId),
        eq(tenantServiceConfig.serviceId, serviceId)
      ),
    });

    if (existing) {
      // Only update global override from Super Admin
      await db
        .update(tenantServiceConfig)
        .set({ isTenantGloballyEnabled })
        .where(
          and(
            eq(tenantServiceConfig.tenantId, tenantId),
            eq(tenantServiceConfig.serviceId, serviceId)
          )
        );
    } else {
      await db.insert(tenantServiceConfig).values({
        tenantId,
        serviceId,
        isTenantGloballyEnabled,
        isTenantPortalEnabled: true, // can default to true or false
      });
    }
  }

  return true;
}

// async updateTenantServiceConfig(
//   tenantId: string,
//   config: { serviceId: string; isTenantGloballyEnabled: boolean }[]
// ) {
//   // Delete old configs for fresh insert
//   await db.delete(tenantServiceConfig).where(eq(tenantServiceConfig.tenantId, tenantId));

//   if (config.length > 0) {
//     await db.insert(tenantServiceConfig).values(
//       config.map(c => ({
//         tenantId,
//         serviceId: c.serviceId,
//         isTenantGloballyEnabled: c.isTenantGloballyEnabled,
//         isTenantPortalEnabled: true, // default enabled for WL Admin
//       }))
//     );
//   }

//   return true;
// }

};
