import { and, eq } from "drizzle-orm";
import { db } from "../../db";
import { services, tenantServiceConfig } from "../../db/schema";

export const getServicesForWLAdmin = async (tenantId: string) => {
  const configs = await db
    .select({
      serviceId: services.id,
      name: services.name,
      code: services.code,
      description: services.description,
      isTenantPortalEnabled: tenantServiceConfig.isTenantPortalEnabled,
      isTenantGloballyEnabled: tenantServiceConfig.isTenantGloballyEnabled,
    })
    .from(tenantServiceConfig)
    .innerJoin(services, eq(tenantServiceConfig.serviceId, services.id))
    .where(
  and(
    eq(tenantServiceConfig.tenantId, tenantId),
    eq(services.isGlobalEnabled, true)
  )
);


  return configs
    .filter((c) => c.isTenantGloballyEnabled) // Only globally allowed
    .map((c) => ({
      serviceId: c.serviceId,
      name: c.name,
      code: c.code,
      description: c.description,
      isEnabled: c.isTenantPortalEnabled,
    }));
};

export const setTenantServiceOverrides = async (
  tenantId: string,
  overrides: { serviceId: string; isEnabled: boolean }[]
) => {
  for (const { serviceId, isEnabled } of overrides) {
    // Check if config exists
    const existing = await db.query.tenantServiceConfig.findFirst({
      where: and(
        eq(tenantServiceConfig.tenantId, tenantId),
        eq(tenantServiceConfig.serviceId, serviceId)
      ),
    });

    if (existing) {
      // Just update portal-level flag
      await db
        .update(tenantServiceConfig)
        .set({ isTenantPortalEnabled: isEnabled })
        .where(
          and(
            eq(tenantServiceConfig.tenantId, tenantId),
            eq(tenantServiceConfig.serviceId, serviceId)
          )
        );
    } else {
      // Get default from services table
      const svc = await db.query.services.findFirst({
        where: eq(services.id, serviceId),
      });

      const isGloballyEnabled = svc?.isGlobalEnabled ?? true; // fallback true

      await db.insert(tenantServiceConfig).values({
        tenantId,
        serviceId,
        isTenantGloballyEnabled: isGloballyEnabled,
        isTenantPortalEnabled: isEnabled,
      });
    }
  }
};


// export const updateTenantPortalOverrides = async (
//   tenantId: string,
//   overrides: { serviceId: string; isEnabled: boolean }[]
// ) => {
//   for (const { serviceId, isEnabled } of overrides) {
//     await db
//       .insert(tenantServiceConfig)
//       .values({
//         tenantId,
//         serviceId,
//         isTenantPortalEnabled: isEnabled,
//       })
//       .onConflictDoUpdate({
//         target: [tenantServiceConfig.tenantId, tenantServiceConfig.serviceId],
//         set: { isTenantPortalEnabled: isEnabled },
//       });
//   }
// };

