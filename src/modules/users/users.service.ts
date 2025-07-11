// src/services/adminUsers/adminUsers.service.ts
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../db';
import { users, roles, userRoles } from '../../db/schema';
import { Roles } from '../../constants/roles';
import { hashPassword } from '../../utils/hash';
import { AppError } from '../../utils/AppError';

export const createWLAdminUser = async (data: {
  name: string;
  email: string;
  mobile: string;
  password: string;
  tenantId: string;
}) => {
  const { name, email, mobile, password, tenantId } = data;

  const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (existing) throw new AppError('User already exists', 400);

  const hashedPassword = await hashPassword(password);
  const userId = uuidv4();

  await db.insert(users).values({
    id: userId,
    name,
    email,
    mobile,
    tenantId,
    passwordHash: hashedPassword,
    isVerified: true
  });

  const role = await db.query.roles.findFirst({ where: eq(roles.name, Roles.WL_ADMIN) });
  if (!role) throw new AppError('WL Admin role not found', 400);

  await db.insert(userRoles).values({
    userId,
    roleId: role.id
  });

  return { message: 'WL Admin user created' };
};
