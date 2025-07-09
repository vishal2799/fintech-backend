// src/controllers/adminUsers.controller.ts
import { eq } from 'drizzle-orm';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../db';
import { roles, userRoles, users } from '../../db/schema';
import { hashPassword } from '../../utils/hash';
import { Roles } from '../../constants/roles';

export const createWLAdminUser = async (req: Request, res: Response) => {
  const { name, email, mobile, password, tenantId } = req.body;

  const existingUser = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (existingUser) {
     res.status(400).json({ message: 'User already exists' });
     return
  }
  const passwordHash = await hashPassword(password);
  const newUserId = uuidv4();

  await db.insert(users).values({
    id: newUserId,
    name,
    email,
    mobile,
    tenantId,
    passwordHash,
    isVerified: true
  });

  const roleRecord = await db.query.roles.findFirst({ where: eq(roles.name, Roles.WL_ADMIN) });
  
  if (!roleRecord) {
    res.status(400).json({ message: 'Invalid role' });
    return
  }

  await db.insert(userRoles).values({
    userId: newUserId,
    roleId: roleRecord.id
  });

  res.status(201).json({ message: 'WL Admin user created' });
};
