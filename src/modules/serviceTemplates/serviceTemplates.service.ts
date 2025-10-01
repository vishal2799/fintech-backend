// ============================================
// 3. SERVICE
// src/modules/serviceTemplates/serviceTemplates.service.ts
// ============================================

import { eq, and, sql } from 'drizzle-orm';
import { AppError } from '../../utils/AppError';
import { db } from '../../db';
import { serviceTemplates, serviceActions, commissionTemplates } from '../../db/schema';
import { ERRORS } from '../../constants/errorCodes2';

interface CreateServiceTemplateData {
  serviceActionId: string;
  templateId: string;
  isDefault?: boolean;
  isActive?: boolean;
}

interface UpdateServiceTemplateData {
  templateId?: string;
  isDefault?: boolean;
  isActive?: boolean;
}

interface GetAllFilters {
  serviceActionId?: string;
  templateId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export const ServiceTemplateService = {
  async create(data: CreateServiceTemplateData) {
    // Verify service action exists
    const [action] = await db
      .select()
      .from(serviceActions)
      .where(eq(serviceActions.id, data.serviceActionId))
      .limit(1);

    if (!action) {
      throw new AppError(ERRORS.SERVICE_ACTION.NOT_FOUND);
    }

    // Verify template exists
    const [template] = await db
      .select()
      .from(commissionTemplates)
      .where(eq(commissionTemplates.id, data.templateId))
      .limit(1);

    if (!template) {
      throw new AppError(ERRORS.COMMISSION_TEMPLATE.NOT_FOUND);
    }

    // Check if mapping already exists
    const [existing] = await db
      .select()
      .from(serviceTemplates)
      .where(
        and(
          eq(serviceTemplates.serviceActionId, data.serviceActionId),
          eq(serviceTemplates.templateId, data.templateId)
        )
      )
      .limit(1);

    if (existing) {
      throw new AppError(
        ERRORS.SERVICE_TEMPLATE.ALREADY_EXISTS
      );
    }

    // If setting as default, unset other defaults for this service action
    if (data.isDefault) {
      await db
        .update(serviceTemplates)
        .set({ isDefault: false, updatedAt: new Date() })
        .where(eq(serviceTemplates.serviceActionId, data.serviceActionId));
    }

    const [serviceTemplate] = await db
      .insert(serviceTemplates)
      .values({ ...data, createdAt: new Date(), updatedAt: new Date() })
      .returning();

    return this.getById(serviceTemplate.id);
  },

  async getById(id: string) {
    const [result] = await db
      .select({
        id: serviceTemplates.id,
        serviceActionId: serviceTemplates.serviceActionId,
        templateId: serviceTemplates.templateId,
        isDefault: serviceTemplates.isDefault,
        isActive: serviceTemplates.isActive,
        createdAt: serviceTemplates.createdAt,
        updatedAt: serviceTemplates.updatedAt,
        serviceAction: {
          id: serviceActions.id,
          name: serviceActions.name,
          code: serviceActions.code,
        },
        template: {
          id: commissionTemplates.id,
          name: commissionTemplates.name,
          hasCommission: commissionTemplates.hasCommission,
          commissionType: commissionTemplates.commissionType,
          commissionValue: commissionTemplates.commissionValue,
          hasFee: commissionTemplates.hasFee,
          feeType: commissionTemplates.feeType,
          feeValue: commissionTemplates.feeValue,
        },
      })
      .from(serviceTemplates)
      .innerJoin(serviceActions, eq(serviceTemplates.serviceActionId, serviceActions.id))
      .innerJoin(commissionTemplates, eq(serviceTemplates.templateId, commissionTemplates.id))
      .where(eq(serviceTemplates.id, id))
      .limit(1);

    if (!result) {
      throw new AppError(ERRORS.SERVICE_TEMPLATE.NOT_FOUND);
    }

    return result;
  },

  async getByServiceAction(serviceActionId: string) {
    // Get default template for service action
    const [result] = await db
      .select({
        id: serviceTemplates.id,
        serviceActionId: serviceTemplates.serviceActionId,
        templateId: serviceTemplates.templateId,
        isDefault: serviceTemplates.isDefault,
        isActive: serviceTemplates.isActive,
        createdAt: serviceTemplates.createdAt,
        updatedAt: serviceTemplates.updatedAt,
        serviceAction: {
          id: serviceActions.id,
          name: serviceActions.name,
          code: serviceActions.code,
        },
        template: {
          id: commissionTemplates.id,
          name: commissionTemplates.name,
          hasCommission: commissionTemplates.hasCommission,
          commissionType: commissionTemplates.commissionType,
          commissionValue: commissionTemplates.commissionValue,
          hasFee: commissionTemplates.hasFee,
          feeType: commissionTemplates.feeType,
          feeValue: commissionTemplates.feeValue,
        },
      })
      .from(serviceTemplates)
      .innerJoin(serviceActions, eq(serviceTemplates.serviceActionId, serviceActions.id))
      .innerJoin(commissionTemplates, eq(serviceTemplates.templateId, commissionTemplates.id))
      .where(
        and(
          eq(serviceTemplates.serviceActionId, serviceActionId),
          eq(serviceTemplates.isDefault, true),
          eq(serviceTemplates.isActive, true)
        )
      )
      .limit(1);

    if (!result) {
      throw new AppError(
        ERRORS.SERVICE_TEMPLATE.NOT_FOUND_FOR_ACTION
      );
    }

    return result;
  },

  async getAll2(filters: GetAllFilters = {}) {
    const { serviceActionId, templateId, isActive, page = 1, limit = 10 } = filters;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (serviceActionId) {
      conditions.push(eq(serviceTemplates.serviceActionId, serviceActionId));
    }

    if (templateId) {
      conditions.push(eq(serviceTemplates.templateId, templateId));
    }

    if (isActive !== undefined) {
      conditions.push(eq(serviceTemplates.isActive, isActive));
    }

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(serviceTemplates)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const results = await db
      .select({
        id: serviceTemplates.id,
        serviceActionId: serviceTemplates.serviceActionId,
        templateId: serviceTemplates.templateId,
        isDefault: serviceTemplates.isDefault,
        isActive: serviceTemplates.isActive,
        createdAt: serviceTemplates.createdAt,
        updatedAt: serviceTemplates.updatedAt,
        serviceAction: {
          id: serviceActions.id,
          name: serviceActions.name,
          code: serviceActions.code,
        },
        template: {
          id: commissionTemplates.id,
          name: commissionTemplates.name,
          hasCommission: commissionTemplates.hasCommission,
          commissionType: commissionTemplates.commissionType,
          commissionValue: commissionTemplates.commissionValue,
          hasFee: commissionTemplates.hasFee,
          feeType: commissionTemplates.feeType,
          feeValue: commissionTemplates.feeValue,
        },
      })
      .from(serviceTemplates)
      .innerJoin(serviceActions, eq(serviceTemplates.serviceActionId, serviceActions.id))
      .innerJoin(commissionTemplates, eq(serviceTemplates.templateId, commissionTemplates.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .limit(limit)
      .offset(offset)
      .orderBy(serviceTemplates.createdAt);

    return {
      data: results,
      pagination: {
        total: Number(count),
        page,
        limit,
        totalPages: Math.ceil(Number(count) / limit),
      },
    };
  },

  async getAll() {
    const results = await db
      .select({
        id: serviceTemplates.id,
        serviceActionId: serviceTemplates.serviceActionId,
        templateId: serviceTemplates.templateId,
        isDefault: serviceTemplates.isDefault,
        isActive: serviceTemplates.isActive,
        createdAt: serviceTemplates.createdAt,
        updatedAt: serviceTemplates.updatedAt,
        serviceAction: {
          id: serviceActions.id,
          name: serviceActions.name,
          code: serviceActions.code,
        },
        template: {
          id: commissionTemplates.id,
          name: commissionTemplates.name,
          hasCommission: commissionTemplates.hasCommission,
          commissionType: commissionTemplates.commissionType,
          commissionValue: commissionTemplates.commissionValue,
          hasFee: commissionTemplates.hasFee,
          feeType: commissionTemplates.feeType,
          feeValue: commissionTemplates.feeValue,
        },
      })
      .from(serviceTemplates)
      .innerJoin(serviceActions, eq(serviceTemplates.serviceActionId, serviceActions.id))
      .innerJoin(commissionTemplates, eq(serviceTemplates.templateId, commissionTemplates.id))
      .orderBy(serviceTemplates.createdAt);

    return results
  },

  async update(id: string, data: UpdateServiceTemplateData) {
    const existing = await this.getById(id);

    // If changing to default, unset other defaults
    if (data.isDefault) {
      await db
        .update(serviceTemplates)
        .set({ isDefault: false, updatedAt: new Date() })
        .where(eq(serviceTemplates.serviceActionId, existing.serviceActionId));
    }

    // If changing template, verify it exists
    if (data.templateId) {
      const [template] = await db
        .select()
        .from(commissionTemplates)
        .where(eq(commissionTemplates.id, data.templateId))
        .limit(1);

      if (!template) {
        throw new AppError(ERRORS.COMMISSION_TEMPLATE.NOT_FOUND);
      }
    }

    await db
      .update(serviceTemplates)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(serviceTemplates.id, id));

    return this.getById(id);
  },

  async delete(id: string) {
    await this.getById(id);

    await db
      .update(serviceTemplates)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(serviceTemplates.id, id));

    return true;
  },
};