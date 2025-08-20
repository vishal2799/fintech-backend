import { and, eq } from 'drizzle-orm';
import { db } from '../../db';
import { serviceOperators, services } from '../../db/schema';
import { AppError } from '../../utils/AppError';
import { ERRORS } from '../../constants/errorCodes';
import { CreateServiceOperatorInput } from './serviceOperator.schema';

export const ServiceOperatorService = {
  getAll: async () => {
    return db
      .select({
        id: serviceOperators.id,
        name: serviceOperators.name,
        code: serviceOperators.code,
        isActive: serviceOperators.isActive,
        serviceId: serviceOperators.serviceId,
        serviceName: services.name,
      })
      .from(serviceOperators)
      .leftJoin(services, eq(serviceOperators.serviceId, services.id));
  },

  getById: async (id: string) => {
    const operator = await db.query.serviceOperators.findFirst({
      where: eq(serviceOperators.id, id),
    });
    if (!operator) throw new AppError(ERRORS.OPERATOR_NOT_FOUND);
    return operator;
  },

  create: async (input: CreateServiceOperatorInput) => {
      // Check if service exists
      const serviceExists = await db.select().from(services).where(eq(services.id, input.serviceId));
      if (!serviceExists) throw new AppError(ERRORS.PARENT_SERVICE_NOT_FOUND);
  
      // Prevent duplicate code for same service
      const existing = await db.select()
        .from(serviceOperators)
        .where(and(eq(serviceOperators.serviceId, input.serviceId), eq(serviceOperators.code, input.code)));
  
      console.log('exist', existing)  
      if (existing.length < 0) throw new AppError(ERRORS.SERVICE_OPERATOR_ALREADY_EXISTS);
  
      const [ruleType] = await db.insert(serviceOperators).values(input).returning();
      return ruleType;
    },

  update: async (id: string, data: Partial<{ name: string; code: string; isActive: boolean }>) => {
    const [updated] = await db
      .update(serviceOperators)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(serviceOperators.id, id))
      .returning();
    if (!updated) throw new AppError(ERRORS.OPERATOR_NOT_FOUND);
    return updated;
  },

  delete: async (id: string) => {
    const [deleted] = await db
      .delete(serviceOperators)
      .where(eq(serviceOperators.id, id))
      .returning();
    if (!deleted) throw new AppError(ERRORS.OPERATOR_NOT_FOUND);
    return deleted;
  },
};
