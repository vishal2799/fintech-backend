// ============================================
// 4. SERVICE
// src/modules/commissionTemplates/commissionTemplates.service.ts
// ============================================

import { eq, and, ilike, or, sql } from 'drizzle-orm';
import { AppError } from '../../utils/AppError';
import { db } from '../../db';
import { commissionTemplates } from '../../db/schema';
import { ERRORS } from '../../constants/errorCodes';

interface CreateCommissionTemplateData {
  name: string;
  description?: string;
  hasCommission: boolean;
  commissionType?: 'fixed' | 'percentage';
  commissionValue?: string;
  hasFee: boolean;
  feeType?: 'fixed' | 'percentage';
  feeValue?: string;
  isActive?: boolean;
}

interface UpdateCommissionTemplateData {
  name?: string;
  description?: string;
  hasCommission?: boolean;
  commissionType?: 'fixed' | 'percentage';
  commissionValue?: string;
  hasFee?: boolean;
  feeType?: 'fixed' | 'percentage';
  feeValue?: string;
  isActive?: boolean;
}

interface GetAllFilters {
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export const CommissionTemplateService = {
    async create(data: CreateCommissionTemplateData) {
    const cleanData = {
      ...data,
      commissionType: data.hasCommission ? data.commissionType : null,
      commissionValue: data.hasCommission ? data.commissionValue : null,
      feeType: data.hasFee ? data.feeType : null,
      feeValue: data.hasFee ? data.feeValue : null, 
    };

    const [template] = await db
      .insert(commissionTemplates)
      .values({ ...cleanData, createdAt: new Date(), updatedAt: new Date() })
      .returning();

    return template;
  },

  async getById(id: string) {
    const [template] = await db
      .select()
      .from(commissionTemplates)
      .where(eq(commissionTemplates.id, id))
      .limit(1);

    if (!template) {
      throw new AppError(
        ERRORS.COMMISSION_TEMPLATE_NOT_FOUND
      );
    }

    return template;
  },

  async getAll() {
    return await db.select()
            .from(commissionTemplates)
            .orderBy(commissionTemplates.createdAt);
  },

    async getAll2(filters: GetAllFilters = {}) {
    const { isActive, search, page = 1, limit = 10 } = filters;
    const offset = (page - 1) * limit;

    const conditions = [];
    
    if (isActive !== undefined) {
      conditions.push(eq(commissionTemplates.isActive, isActive));
    }

    if (search) {
      conditions.push(
        or(
          ilike(commissionTemplates.name, `%${search}%`),
          ilike(commissionTemplates.description, `%${search}%`)
        )
      );
    }

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(commissionTemplates)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const templates = await db
      .select()
      .from(commissionTemplates)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .limit(limit)
      .offset(offset)
      .orderBy(commissionTemplates.createdAt);

    return {
      data: templates,
      pagination: {
        total: Number(count),
        page,
        limit,
        totalPages: Math.ceil(Number(count) / limit),
      },
    };
  },

  async update(id: string, data: UpdateCommissionTemplateData) {
    await this.getById(id);

    const cleanData = {
      ...data,
      commissionType: data.hasCommission === false ? null : data.commissionType,
      commissionValue: data.hasCommission === false ? null : data.commissionValue,
      feeType: data.hasFee === false ? null : data.feeType,
      feeValue: data.hasFee === false ? null : data.feeValue,
    };

    const [template] = await db
      .update(commissionTemplates)
      .set({ ...cleanData, updatedAt: new Date() })
      .where(eq(commissionTemplates.id, id))
      .returning();

    return template;
  },

  async delete(id: string) {
    await this.getById(id);

    await db
      .update(commissionTemplates)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(commissionTemplates.id, id));

    return true;
  },
};

