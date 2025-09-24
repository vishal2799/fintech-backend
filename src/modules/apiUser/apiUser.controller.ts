// controllers/superAdmin/apiClient.controller.ts
import { Request, Response } from 'express';
import crypto from 'crypto';
import { db } from '../../db';
import { v4 as uuidv4 } from 'uuid';
import { apiClients } from '../../db/schema';
import { eq } from 'drizzle-orm';

export const createApiUser = async (req: Request, res: Response) => {
  const { tenantId, clientName } = (req as any).validated;

  const existing = await db.select().from(apiClients).where(eq(apiClients.tenantId, tenantId));
  if (existing.length) return res.status(400).json({ message: 'API user already exists for this tenant' });

  const clientKey = crypto.randomBytes(32).toString('hex');
  const clientSecret = crypto.randomBytes(32).toString('hex'); // store hashed in prod

  const apiUser = await db.insert(apiClients).values({
    id: uuidv4(),
    tenantId,
    clientName,
    clientKey,
    clientSecret,
  }).returning();

  res.json({
    message: 'API user created successfully',
    apiUser: {
      id: apiUser[0].id,
      tenantId: apiUser[0].tenantId,
      clientName: apiUser[0].clientName,
      clientKey,
      clientSecret, // show only once
      status: apiUser[0].status,
      createdAt: apiUser[0].createdAt,
    },
  });
};

export const regenerateSecret = async (req: Request, res: Response) => {
  const { apiClientId } = (req as any).validated;

  const clientSecret = crypto.randomBytes(32).toString('hex');

  await db.update(apiClients)
    .set({ clientSecret, status: 'ACTIVE' })
    .where(eq(apiClients.id, apiClientId));

  res.json({ message: 'API secret regenerated', clientSecret });
};

export const toggleApiUserStatus = async (req: Request, res: Response) => {
  const { apiClientId, status } = (req as any).validated;

  await db.update(apiClients)
    .set({ status })
    .where(eq(apiClients.id, apiClientId));

  res.json({ message: `API user status updated to ${status}` });
};

export const listApiUsers = async (_req: Request, res: Response) => {
  const apiUsers = await db.select().from(apiClients);
  res.json({ apiUsers });
};
