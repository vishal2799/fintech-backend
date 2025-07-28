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
import { ERRORS } from '../../constants/errorCodes';
import type {
  LoginInput,
  RefreshInput,
  LogoutInput,
} from './auth.schema';
import * as OtpService from '../auth/otp.service';


// export const login = async ({ email, password }: LoginInput) => {
//   const user = await db.query.users.findFirst({ where: eq(users.email, email) });
//   if (!user || !user.passwordHash)
//     throw new AppError(ERRORS.INVALID_CREDENTIALS);

//   const match = await bcrypt.compare(password, user.passwordHash);
//   if (!match) throw new AppError(ERRORS.INVALID_CREDENTIALS);

//   const { roleNames, permissionNames } = await getUserRolesAndPermissions(user.id, !!user.isEmployee, user.staticRole);

//   const payload = {
//     name: user.name,
//     email: user.email,
//     userId: user.id,
//     tenantId: user.tenantId,
//     staticRole: user.staticRole || undefined,
//     isEmployee: user.isEmployee,
//     roleNames,
//     permissions: permissionNames,
//   };

//   const accessToken = generateAccessToken(payload);
//   const refreshToken = generateRefreshToken(payload);

//   await db.insert(sessions).values({
//     id: uuidv4(),
//     userId: user.id,
//     tenantId: user.tenantId,
//     token: refreshToken,
//     expiresAt: new Date(Date.now() + 7 * 86400000),
//   });

//   return { accessToken, refreshToken };
// };

export const login = async ({ email, password }: LoginInput) => {
  const user = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (!user || !user.email || !user.passwordHash) throw new AppError(ERRORS.INVALID_CREDENTIALS);

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) throw new AppError(ERRORS.INVALID_CREDENTIALS);

  // ✅ Send OTP instead of login
  const identifier = user.email;

  await OtpService.sendOtp({
    identifier,
    type: 'LOGIN',
  });

  return { identifier };
};

export const verifyOtpLogin = async ({
  identifier,
  otp,
}: {
  identifier: string;
  otp: string;
}) => {
  await OtpService.verifyOtp({ identifier, otp, type: 'LOGIN' });

  const user = await db.query.users.findFirst({ where: eq(users.email, identifier) });
  if (!user) throw new AppError(ERRORS.USER_NOT_FOUND);

  const { roleNames, permissionNames } = await getUserRolesAndPermissions(
    user.id,
    !!user.isEmployee,
    user.staticRole
  );

  const payload = {
    name: user.name,
    email: user.email,
    userId: user.id,
    tenantId: user.tenantId,
    staticRole: user.staticRole || undefined,
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


export const refreshTokens = async ({ token }: RefreshInput) => {
  const payload = verifyRefreshToken(token) as any;

  const session = await db.query.sessions.findFirst({
    where: eq(sessions.token, token),
  });
  if (!session) throw new AppError(ERRORS.SESSION_NOT_FOUND);

  const user = await db.query.users.findFirst({
    where: eq(users.id, payload.userId),
  });
  if (!user) throw new AppError(ERRORS.USER_NOT_FOUND);

  const { roleNames, permissionNames } = await getUserRolesAndPermissions(user.id, !!user.isEmployee, user.staticRole);

  const newPayload = {
    name: user.name,
    email: user.email,
    userId: user.id,
    tenantId: user.tenantId,
    staticRole: user.staticRole || undefined,
    isEmployee: user.isEmployee,
    roleNames,
    permissions: permissionNames,
  };

  const accessToken = generateAccessToken(newPayload);
  return { accessToken };
};

export const logout = async ({ token }: LogoutInput) => {
  await db.delete(sessions).where(eq(sessions.token, token));
};

// helper
const getUserRolesAndPermissions = async (
  userId: string,
  isEmployee: boolean,
  staticRole: string | null
) => {
  let roleNames: string[] = [];
  let permissionNames: (string | null)[] = [];

  if (isEmployee) {
    const roleRows = await db
      .select({ id: roles.id, name: roles.name })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, userId));

    const roleIds = roleRows.map((r) => r.id);
    roleNames = roleRows.map((r) => r.name);

    const permRows = await db
      .select({ name: permissions.name })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(inArray(rolePermissions.roleId, roleIds));

    permissionNames = permRows.map((p) => p.name);
  } else {
    roleNames = [staticRole || 'UNKNOWN'];
    permissionNames = [];
  }

  return { roleNames, permissionNames };
};
