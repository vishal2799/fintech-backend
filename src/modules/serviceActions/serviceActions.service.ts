// ============================================
// 3. SERVICE
// src/modules/serviceActions/serviceActions.service.ts
// ============================================

import { eq, and, ilike, or, sql } from 'drizzle-orm';
import { AppError } from '../../utils/AppError';
import { db } from '../../db';
import { serviceActions } from '../../db/schema';
import { ERRORS } from '../../constants/errorCodes';

interface CreateServiceActionData {
  name: string;
  code: string;
  description?: string;
  isActive?: boolean;
}

interface UpdateServiceActionData {
  name?: string;
  code?: string;
  description?: string;
  isActive?: boolean;
}

interface GetAllFilters {
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export const ServiceActionService = {
  async create(data: CreateServiceActionData) {
    // Check if code already exists
    const existing = await db
      .select()
      .from(serviceActions)
      .where(eq(serviceActions.code, data.code))
      .limit(1);

    if (existing.length > 0) {
      throw new AppError(ERRORS.SERVICE_ACTION_CODE_EXISTS);
    }

    const [action] = await db
      .insert(serviceActions)
      .values({ ...data, createdAt: new Date(), updatedAt: new Date() })
      .returning();

    return action;
  },

  async getById(id: string) {
    const [action] = await db
      .select()
      .from(serviceActions)
      .where(eq(serviceActions.id, id))
      .limit(1);

    if (!action) {
      throw new AppError(ERRORS.SERVICE_ACTION_NOT_FOUND);
    }

    return action;
  },

  async getByCode(code: string) {
    const [action] = await db
      .select()
      .from(serviceActions)
      .where(eq(serviceActions.code, code))
      .limit(1);

    if (!action) {
      throw new AppError(ERRORS.SERVICE_ACTION_NOT_FOUND);
    }

    return action;
  },

  async getAll(filters: GetAllFilters = {}) {
    const { isActive, search, page = 1, limit = 10 } = filters;
    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [];
    
    if (isActive !== undefined) {
      conditions.push(eq(serviceActions.isActive, isActive));
    }

    if (search) {
      conditions.push(
        or(
          ilike(serviceActions.name, `%${search}%`),
          ilike(serviceActions.code, `%${search}%`),
          ilike(serviceActions.description, `%${search}%`)
        )
      );
    }

    // Get total count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(serviceActions)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    // Get paginated results
    const actions = await db
      .select()
      .from(serviceActions)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .limit(limit)
      .offset(offset)
      .orderBy(serviceActions.createdAt);

    return {
      data: actions,
      pagination: {
        total: Number(count),
        page,
        limit,
        totalPages: Math.ceil(Number(count) / limit),
      },
    };
  },

  async getAll2() {
      return await db.select()
        .from(serviceActions)
        .orderBy(serviceActions.createdAt);
    },

  async update(id: string, data: UpdateServiceActionData) {
    // Check if action exists
    await this.getById(id);

    // If updating code, check if new code already exists
    if (data.code) {
      const existing = await db
        .select()
        .from(serviceActions)
        .where(and(eq(serviceActions.code, data.code), sql`${serviceActions.id} != ${id}`))
        .limit(1);

      if (existing.length > 0) {
        throw new AppError(ERRORS.SERVICE_ACTION_CODE_EXISTS);
      }
    }

    const [action] = await db
      .update(serviceActions)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(serviceActions.id, id))
      .returning();

    return action;
  },

  async delete(id: string) {
    // Check if action exists
    await this.getById(id);

    // Soft delete by setting isActive to false
    await db
      .update(serviceActions)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(serviceActions.id, id));

    return true;
  },
};