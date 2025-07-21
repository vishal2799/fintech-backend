// src/services/auth/auth.service.ts
import bcrypt from 'bcrypt';
import { eq, inArray } from 'drizzle-orm';
import { db } from '../../db';
import {
  users,
  sessions,
  roles,
  userRoles,
  rolePermissions,
  permissions,
} from '../../db/schema';
import { AppError } from '../../utils/AppError';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../../utils/jwt';
import { v4 as uuidv4 } from 'uuid';

export const login = async (email: string, password: string) => {
  const user = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (!user || !user.passwordHash)
    throw new AppError('Invalid credentials', 401);

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) throw new AppError('Invalid credentials', 401);

  let roleNames: string[] = [];
  let permissionNames: (string | null)[] = [];

  if (user.isEmployee) {
    // Dynamic role-based for employee
    const roleRows = await db
      .select({ id: roles.id, name: roles.name })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, user.id));

    const roleIds = roleRows.map(r => r.id);
    roleNames = roleRows.map(r => r.name);

    const permRows = await db
      .select({ name: permissions.name })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(inArray(rolePermissions.roleId, roleIds));

    permissionNames = permRows.map(p => p.name);
  } else {
    // Static role-based (SD, D, R, WL_ADMIN)
    roleNames = [user.staticRole || 'UNKNOWN'];
    permissionNames = []; // handled via middleware
  }

  const payload = {
    name: user.name,
    email: user.email,
    userId: user.id,
    tenantId: user.tenantId,
    staticRole: user.staticRole || undefined, // ✅ add this
    isEmployee: user.isEmployee,
    roleNames,
    permissions: permissionNames,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await db.insert(sessions).values({
    id: uuidv4(),
    userId: user.id,
    tenantId: user.tenantId,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 86400000),
  });

  return { accessToken, refreshToken };
};

export const refreshTokens = async (token: string) => {
  const payload = verifyRefreshToken(token) as any;

  const session = await db.query.sessions.findFirst({
    where: eq(sessions.token, token),
  });
  if (!session) throw new AppError('Session not found', 401);

  const user = await db.query.users.findFirst({
    where: eq(users.id, payload.userId),
  });
  if (!user) throw new AppError('User not found', 404);

  let roleNames: string[] = [];
  let permissionNames: (string | null)[] = [];

  if (user.isEmployee) {
    const roleRows = await db
      .select({ id: roles.id, name: roles.name })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, user.id));

    const roleIds = roleRows.map(r => r.id);
    roleNames = roleRows.map(r => r.name);

    const permRows = await db
      .select({ name: permissions.name })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(inArray(rolePermissions.roleId, roleIds));

    permissionNames = permRows.map(p => p.name);
  } else {
    roleNames = [user.staticRole || 'UNKNOWN'];
    permissionNames = [];
  }

  const newPayload = {
    name: user.name,
    email: user.email,
    userId: user.id,
    tenantId: user.tenantId,
    staticRole: user.staticRole || undefined, // ✅ add this
    isEmployee: user.isEmployee,
    roleNames,
    permissions: permissionNames,
  };

  const accessToken = generateAccessToken(newPayload);
  return { accessToken };
};

export const logout = async (token: string) => {
  await db.delete(sessions).where(eq(sessions.token, token));
};


// export const login = async (email: string, password: string) => {
//   const user = await db.query.users.findFirst({ where: eq(users.email, email) });
//   if (!user || !user.passwordHash)
//     throw new AppError('Invalid credentials', 401);

//   const match = await bcrypt.compare(password, user.passwordHash);
//   if (!match) throw new AppError('Invalid credentials', 401);

//   // ► Roles
//   const roleRows = await db
//     .select({ id: roles.id, name: roles.name })
//     .from(userRoles)
//     .innerJoin(roles, eq(userRoles.roleId, roles.id))
//     .where(eq(userRoles.userId, user.id));

//   const roleIds = roleRows.map(r => r.id);
//   const roleNames = roleRows.map(r => r.name);

//   // ► Permissions
//   const permRows = await db
//     .select({ name: permissions.name })
//     .from(rolePermissions)
//     .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
//     .where(inArray(rolePermissions.roleId, roleIds));

//   const permissionNames = permRows.map(p => p.name);

//   const payload = {
//     name: user.name,
//     email: user.email,
//     userId: user.id,
//     tenantId: user.tenantId,
//     roleNames,
//     permissions: permissionNames,
//   };

//   const accessToken  = generateAccessToken(payload);
//   const refreshToken = generateRefreshToken(payload);

//   await db.insert(sessions).values({
//     id: uuidv4(),
//     userId: user.id,
//     tenantId: user.tenantId,
//     token: refreshToken,
//     expiresAt: new Date(Date.now() + 7 * 86_400_000), // 7 days
//   });

//   return { accessToken, refreshToken };
// };

// export const refreshTokens = async (token: string) => {
//   const payload = verifyRefreshToken(token) as any;

//   const session = await db.query.sessions.findFirst({
//     where: eq(sessions.token, token),
//   });
//   if (!session) throw new AppError('Session not found', 401);

//   /* 🔄  Fetch latest roles / permissions in case they changed  */
//   const roleRows = await db
//     .select({ id: roles.id, name: roles.name })
//     .from(userRoles)
//     .innerJoin(roles, eq(userRoles.roleId, roles.id))
//     .where(eq(userRoles.userId, payload.userId));

//   const roleIds = roleRows.map(r => r.id);
//   const roleNames = roleRows.map(r => r.name);

//   const permRows = await db
//     .select({ name: permissions.name })
//     .from(rolePermissions)
//     .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
//     .where(inArray(rolePermissions.roleId, roleIds));

//   const permissionNames = permRows.map(p => p.name);

//   const newPayload = {
//     name: payload.name,
//     email: payload.email,
//     userId: payload.userId,
//     tenantId: payload.tenantId,
//     roleNames,
//     permissions: permissionNames,
//   };

//   const accessToken = generateAccessToken(newPayload);
//   return { accessToken };
// };

// export const logout = async (token: string) => {
//   await db.delete(sessions).where(eq(sessions.token, token));
// };
