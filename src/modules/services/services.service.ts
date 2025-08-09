// src/modules/services/services.service.ts
import { db } from '../../db'
import { and, eq } from 'drizzle-orm'
import { services } from '../../db/schema'
import { tenantServiceConfig } from '../../db/schema/tenantServiceConfig'
import { userServiceConfig } from '../../db/schema/userServiceConfig'

export const getAllServices = async () => {
  return await db.select().from(services)
}

export const getServiceById = async (id: string) => {
  const rows = await db.select().from(services).where(eq(services.id, id))
  return rows[0]
}

export const createService = async (data: { name: string; code: string; isGlobalEnabled: boolean }) => {
  const [created] = await db.insert(services).values(data).returning()
  return created
}

export const updateService = async (id: string, data: Partial<{ name: string; code: string; isGlobalEnabled: boolean }>) => {
  const [updated] = await db.update(services).set(data).where(eq(services.id, id)).returning()
  return updated
}

export const deleteService = async (id: string) => {
  const [deleted] = await db.delete(services).where(eq(services.id, id)).returning()
  return deleted
}

// // Super Admin
// export const getAllGlobalServices = () => db.select().from(services);

// export const updateGlobalService = async (serviceId: string, data: Partial<typeof services.$inferInsert>) => {
//   const [updated] = await db.update(services)
//     .set(data)
//     .where(eq(services.id, serviceId))
//     .returning();
//   return updated;
// };


// // White-Label Admin
// export const getTenantServices = (tenantId: string) =>
//   db.select().from(tenantServiceConfig).where(eq(tenantServiceConfig.tenantId, tenantId));

// export const updateTenantService = async (tenantId: string, serviceId: string, data: { isEnabled: boolean }) => {
//   const exists = await db
//     .select()
//     .from(tenantServiceConfig)
//     .where(and(eq(tenantServiceConfig.tenantId, tenantId), eq(tenantServiceConfig.serviceId, serviceId)));

//   if (exists.length) {
//     return db
//       .update(tenantServiceConfig)
//       .set({ isEnabled: data.isEnabled })
//       .where(and(eq(tenantServiceConfig.tenantId, tenantId), eq(tenantServiceConfig.serviceId, serviceId)))
//       .returning();
//   } else {
//     return db
//       .insert(tenantServiceConfig)
//       .values({ tenantId, serviceId, isEnabled: data.isEnabled })
//       .returning();
//   }
// };

// // User-specific
// export const getUserServices = (userId: string) =>
//   db.select().from(userServiceConfig).where(eq(userServiceConfig.userId, userId));

// export const updateUserService = async (userId: string, serviceId: string, data: { isEnabled: boolean }) => {
//   const exists = await db
//     .select()
//     .from(userServiceConfig)
//     .where(and(eq(userServiceConfig.userId, userId), eq(userServiceConfig.serviceId, serviceId)));

//   if (exists.length) {
//     return db
//       .update(userServiceConfig)
//       .set({ isEnabled: data.isEnabled })
//       .where(and(eq(userServiceConfig.userId, userId), eq(userServiceConfig.serviceId, serviceId)))
//       .returning();
//   } else {
//     return db
//       .insert(userServiceConfig)
//       .values({ userId, serviceId, isEnabled: data.isEnabled })
//       .returning();
//   }
// };

// // Retailer self
// export const getEffectiveServicesForUser = async (userId: string, tenantId: string) => {
//   const all = await db.select().from(services).where(eq(services.isGlobalEnabled, true));

//   const tenantConfig = await db
//     .select()
//     .from(tenantServiceConfig)
//     .where(eq(tenantServiceConfig.tenantId, tenantId));

//   const userConfig = await db
//     .select()
//     .from(userServiceConfig)
//     .where(eq(userServiceConfig.userId, userId));

//   return all
//     .filter(service => {
//       const tenantSetting = tenantConfig.find(t => t.serviceId === service.id);
//       const userSetting = userConfig.find(u => u.serviceId === service.id);
//       return (
//         (!tenantSetting || tenantSetting.isEnabled) &&
//         (!userSetting || userSetting.isEnabled)
//       );
//     });
// };