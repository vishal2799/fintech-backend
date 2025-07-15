// src/services/adminUsers/adminUsers.service.ts
import { and, eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../db';
import { users, roles, userRoles } from '../../db/schema';
import { Roles } from '../../constants/roles';
import { hashPassword } from '../../utils/hash';
import { AppError } from '../../utils/AppError';

export const getWLAdmins = async (tenantId?: string) => {
  const baseCond = eq(roles.name, Roles.WL_ADMIN as unknown as string);

  return tenantId
    ? db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          mobile: users.mobile,
          status: users.status,
          tenantId: users.tenantId,
        })
        .from(users)
        .innerJoin(userRoles, eq(userRoles.userId, users.id))
        .innerJoin(roles, eq(roles.id, userRoles.roleId))
        .where(and(baseCond, eq(users.tenantId, tenantId))) // both conditions
    : db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          mobile: users.mobile,
          status: users.status,
          tenantId: users.tenantId,
        })
        .from(users)
        .innerJoin(userRoles, eq(userRoles.userId, users.id))
        .innerJoin(roles, eq(roles.id, userRoles.roleId))
        .where(baseCond); // single condition
};

export const getWLAdminById = async (id: string) => {
  const user = await db.query.users.findFirst({ where: eq(users.id, id) });
  if (!user) throw new AppError('Not found', 404);
  return user;
};

export const createWLAdminUser = async (data: {
  name: string;
  email: string;
  mobile: string;
  password: string;
  tenantId: string;
}) => {
  const existing = await db.query.users.findFirst({ where: eq(users.email, data.email) });
  if (existing) throw new AppError('User already exists', 400);

  const hashedPassword = await hashPassword(data.password);
  const userId = uuidv4();

  await db.insert(users).values({
    id: userId,
    name: data.name,
    email: data.email,
    mobile: data.mobile,
    tenantId: data.tenantId,
    passwordHash: hashedPassword,
    isVerified: true,
    status: 'ACTIVE',
  });

  const role = await db.query.roles.findFirst({ where: eq(roles.name, Roles.WL_ADMIN) });
  if (!role) throw new AppError('WL Admin role not found', 400);

  await db.insert(userRoles).values({ userId, roleId: role.id });

  return { id: userId };
};

export const updateWLAdmin = async (id: string, updates: any) => {
  const values: any = {};
  if (updates.name) values.name = updates.name;
  if (updates.email) values.email = updates.email;
  if (updates.mobile) values.mobile = updates.mobile;
  if (updates.status) values.status = updates.status;
  if (updates.password) values.passwordHash = await hashPassword(updates.password);

  await db.update(users).set(values).where(eq(users.id, id));
  return { id };
};

type STATUS = 'ACTIVE' | 'LOCKED' | 'BLOCKED'

export const updateWLAdminStatus = async (id: string, status: STATUS) => {
  await db.update(users).set({ status }).where(eq(users.id, id));
  return { id };
};

export const deleteWLAdmin = async (id: string) => {
  await db.delete(users).where(eq(users.id, id));
  return { id };
};

// export const createWLAdminUser = async (data: {
//   name: string;
//   email: string;
//   mobile: string;
//   password: string;
//   tenantId: string;
// }) => {
//   const { name, email, mobile, password, tenantId } = data;

//   const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
//   if (existing) throw new AppError('User already exists', 400);

//   const hashedPassword = await hashPassword(password);
//   const userId = uuidv4();

//   await db.insert(users).values({
//     id: userId,
//     name,
//     email,
//     mobile,
//     tenantId,
//     passwordHash: hashedPassword,
//     isVerified: true
//   });

//   const role = await db.query.roles.findFirst({ where: eq(roles.name, Roles.WL_ADMIN) });
//   if (!role) throw new AppError('WL Admin role not found', 400);

//   await db.insert(userRoles).values({
//     userId,
//     roleId: role.id
//   });

//   return { message: 'WL Admin user created' };
// };
