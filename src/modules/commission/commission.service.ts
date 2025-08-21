import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { serviceCommissions, serviceOperators, services } from '../../db/schema';

export interface ServiceCommissionInput {
  serviceId: string;
  operatorId?: string;
  level: 'TENANT' | 'SUPER_DISTRIBUTOR' | 'DISTRIBUTOR' | 'RETAILER';
  value: number; // pass as number, converted internally to string
  valueType: 'PERCENTAGE' | 'FIXED';
  isActive?: boolean;
}

// CREATE
export const createServiceCommission = async (data: ServiceCommissionInput) => {
    const operatorIdValue = data.operatorId || null;

  const inserted = await db
    .insert(serviceCommissions)
    .values({
      serviceId: data.serviceId,
      operatorId: operatorIdValue,
      level: data.level,
      value: data.value.toString(),
      valueType: data.valueType,
      isActive: data.isActive ?? true,
    })
    .returning();

  return inserted[0];
};

// UPDATE
export const updateServiceCommission = async (
  id: string,
  data: Partial<ServiceCommissionInput>
) => {
  const updated = await db
    .update(serviceCommissions)
    .set({
      ...(data.serviceId && { serviceId: data.serviceId }),
      ...(data.operatorId !== undefined && { operatorId: data.operatorId }),
      ...(data.level && { level: data.level }),
      ...(data.value !== undefined && { value: data.value.toString() }),
      ...(data.valueType && { valueType: data.valueType }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
      updatedAt: new Date(),
    })
    .where(eq(serviceCommissions.id, id))
    .returning();

  return updated[0];
};

// DELETE
export const deleteServiceCommission = async (id: string) => {
  return await db.delete(serviceCommissions).where(eq(serviceCommissions.id, id));
};

// GET ALL
// export const getAllServiceCommissions = async () => {
//   return await db.select().from(serviceCommissions);
// };

export const getAllServiceCommissions = async () => {
  return db
    .select({
      id: serviceCommissions.id,
      serviceId: serviceCommissions.serviceId,
      serviceName: services.name,
      operatorId: serviceCommissions.operatorId,
      operatorName: serviceOperators.name,
      level: serviceCommissions.level,
      value: serviceCommissions.value,
      valueType: serviceCommissions.valueType,
      isActive: serviceCommissions.isActive,
      createdAt: serviceCommissions.createdAt,
      updatedAt: serviceCommissions.updatedAt,
    })
    .from(serviceCommissions)
    .leftJoin(services, eq(serviceCommissions.serviceId, services.id))
    .leftJoin(
      serviceOperators,
      eq(serviceCommissions.operatorId, serviceOperators.id)
    );
};

// GET BY ID
export const getServiceCommissionById = async (id: string) => {
  return await db.select().from(serviceCommissions).where(eq(serviceCommissions.id, id));
};


// // src/modules/commission/commission.service.ts
// import { eq } from 'drizzle-orm';
// import { db } from '../../db';
// import { serviceCommissions } from '../../db/schema';
// import { CreateServiceCommissionInput } from './commission.schema';
// import { v4 as uuidv4 } from 'uuid';

// export const createServiceCommission = async (data: CreateServiceCommissionInput) => {
//   const [commission] = await db.insert(serviceCommissions).values({
//   id: uuidv4(),
//   serviceId: data.serviceId,
//   operatorId: data.operatorId,
//   level: data.level,
//   value: data.value.toString(),
//   valueType: data.valueType,
//   isActive: data.isActive ?? true,
// }).returning();

//   return commission;
// };

// export const getServiceCommissions = async () => {
//   return db.select().from(serviceCommissions);
// };

// export const getServiceCommissionById = async (id: string) => {
//   return db.select().from(serviceCommissions).where(eq(serviceCommissions.id,id)).limit(1).then(res => res[0] || null);
// };

// export const updateServiceCommission = async (id: string, data: {
//   value?: number;
//   valueType?: 'PERCENTAGE' | 'FIXED';
//   level?: 'TENANT' | 'SUPER_DISTRIBUTOR' | 'DISTRIBUTOR' | 'RETAILER';
//   isActive?: boolean;
//   operatorId?: string;
// }) => {
//   const updated = await db
//     .update(serviceCommissions)
//     .set({
//       ...(data.value !== undefined ? { value: data.value.toString() } : {}),
//       valueType: data.valueType,
//       level: data.level,
//       isActive: data.isActive,
//       operatorId: data.operatorId,
//       updatedAt: new Date(),
//     })
//     .where(eq(serviceCommissions.id, id))
//     .returning();

//   return updated;
// };


// export const deleteServiceCommission = async (id: string) => {
//   await db.delete(serviceCommissions).where(eq(serviceCommissions.id,id));
//   return { success: true };
// };
