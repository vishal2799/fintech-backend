import { and, eq } from "drizzle-orm";
import { db } from "../../db";
import { serviceRuleTypes, services } from "../../db/schema";
import { AppError } from "../../utils/AppError";
import { ServiceRuleTypeInput } from "./service-rules-types.schema";
import { ERRORS } from "../../constants/errorCodes";


export const ServiceRuleTypeService = {
  create: async (input: ServiceRuleTypeInput) => {
    // Check if service exists
    const serviceExists = await db.select().from(services).where(eq(services.id, input.serviceId));
    if (!serviceExists) throw new AppError(ERRORS.PARENT_SERVICE_NOT_FOUND);

    // Prevent duplicate code for same service
    const existing = await db.select()
      .from(serviceRuleTypes)
      .where(and(eq(serviceRuleTypes.serviceId, input.serviceId), eq(serviceRuleTypes.code, input.code)));

    console.log('exist', existing)  
    if (existing.length < 0) throw new AppError(ERRORS.SERVICE_RULE_ALREADY_EXISTS);

    const [ruleType] = await db.insert(serviceRuleTypes).values(input).returning();
    return ruleType;
  },

  update: async (id: string, input: Partial<ServiceRuleTypeInput>) => {
    if (input.serviceId) {
      const serviceExists = await db.select().from(services).where(eq(services.id, input.serviceId));
      if (!serviceExists) throw new AppError(ERRORS.PARENT_SERVICE_NOT_FOUND);
    }

    const updated = await db.update(serviceRuleTypes)
      .set(input)
      .where(eq(serviceRuleTypes.id, id))
      .returning();

    if (!updated.length) throw new AppError(ERRORS.SERVICE_RULE_NOT_FOUND);
    return updated[0];
  },

  delete: async (id: string) => {
    const deleted = await db.delete(serviceRuleTypes).where(eq(serviceRuleTypes.id, id)).returning();
    if (!deleted.length) throw new AppError(ERRORS.SERVICE_RULE_NOT_FOUND);
    return deleted[0];
  },

  // getAll: async () => {
  //   return db.select().from(serviceRuleTypes);
  // },

   getAll: async () => {
    return db
      .select({
        id: serviceRuleTypes.id,
        name: serviceRuleTypes.name,
        code: serviceRuleTypes.code,
        description: serviceRuleTypes.description,
        serviceId: serviceRuleTypes.serviceId,
        serviceName: services.name,
        isActive: serviceRuleTypes.isActive
      })
      .from(serviceRuleTypes)
      .leftJoin(services, eq(serviceRuleTypes.serviceId, services.id));
  },

  getById: async (id: string) => {
    const ruleType = await db.select().from(serviceRuleTypes).where(eq(serviceRuleTypes.id, id));
    if (!ruleType) throw new AppError(ERRORS.SERVICE_RULE_NOT_FOUND);
    return ruleType;
  },

  getByServiceId: async (serviceId: string) => {
    return db.select().from(serviceRuleTypes).where(eq(serviceRuleTypes.serviceId, serviceId));
  },
};
