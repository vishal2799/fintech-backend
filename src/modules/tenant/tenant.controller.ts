// src/controllers/tenant.controller.ts
import { eq } from 'drizzle-orm';
import { Request, Response } from 'express';
import { db } from '../../db';
import { tenants } from '../../db/schema';

export const createTenant = async (req: Request, res: Response) => {
  const { name, slug, logoUrl, themeColor } = req.body;

  const exists = await db.query.tenants.findFirst({ where: eq(tenants.slug, slug) });
  if (exists) {
    res.status(400).json({ message: 'Slug already exists' });
    return
  }
  const tenant = await db.insert(tenants).values({
    name,
    slug,
    logoUrl,
    themeColor
  }).returning();

  res.status(201).json(tenant[0]);
};

export const listTenants = async (_req: Request, res: Response) => {
  const result = await db.query.tenants.findMany();
  res.json(result);
};

export const updateTenant = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, logoUrl, themeColor, status } = req.body;

  await db.update(tenants)
    .set({ name, logoUrl, themeColor, status })
    .where(eq(tenants.id, id));

  res.json({ message: 'Tenant updated' });
};
