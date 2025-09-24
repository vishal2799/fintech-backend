import bcrypt from 'bcrypt';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { db } from '../../db';
import {
  users,
  sessions,
  roles,
  userRoles,
  rolePermissions,
  permissions,
  resetTokens,
  tenants,
  authLogins,
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
  VerifyResetOtpInput,
  ResetPasswordInput,
} from './auth.schema';
import * as OtpService from '../auth/otp.service';
import { logLoginAttempt } from './auth.logger';
import * as TwilioOtpService from '../auth/twilioOtp.service';
import { FEATURE_FLAGS } from '../../config';
import { sendPasswordResetOtp } from './sendgrid.service';
import { insertResetToken, invalidateResetToken } from './reset-token';
import { hashPassword } from '../../utils/hash';
import { Roles } from '../../constants/roles';


export const login = async ({ email, password, ipInfo, subdomain }: LoginInput & { ipInfo?: any, subdomain:string; }) => {
  // const user = await db.query.users.findFirst({ where: eq(users.email, email), with: {tenant: true} });
  // console.log(subdomain, 'sb')  
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      passwordHash: users.passwordHash,
      tenantId: tenants.id,
      tenantSlug: tenants.slug,
      mobile: users.mobile
    })
    .from(users)
    .innerJoin(tenants, eq(users.tenantId, tenants.id))
    .where(
      and(eq(users.email, email), eq(tenants.slug, subdomain)) // ✅ ensures user is from that tenant
    );

  console.log(user, 'user');
  if (!user || !user.email || !user.passwordHash) {
      await logLoginAttempt({
      email,
      status: 'FAILED',
      reason: 'User not found',
      ...ipInfo,
    });
  
    throw new AppError(ERRORS.INVALID_CREDENTIALS);
  }
  const match = await bcrypt.compare(password, user.passwordHash);

  if (!match) {
    await logLoginAttempt({
      email,
      userId: user.id,
      status: 'FAILED',
      reason: 'Incorrect password',
      ...ipInfo,
    });
    throw new AppError(ERRORS.INVALID_CREDENTIALS);
  }

  // ✅ Send OTP instead of login

      if (FEATURE_FLAGS.useTwilioOtp) {
  if (!user.mobile) {
    throw new AppError(ERRORS.USER_NOT_FOUND);
  }
  await TwilioOtpService.TwilioOtpService.sendOtp({ identifier: user.mobile });
      } else if(process.env.USE_STATIC_OTP === 'true'){
         await OtpService.sendOtp({
    identifier: user.email,
    type: 'LOGIN',
    staticOTP: true
  });
      } else {
  await OtpService.sendOtp({
    identifier: user.email,
    type: 'LOGIN',
  });
      }

  await logLoginAttempt({
    email,
    userId: user.id,
    status: 'SUCCESS',
    reason: 'OTP sent',
    ...ipInfo,
  });

  return { identifier: user.email };
};

// export const login = async (
//   {
//     email,
//     password,
//     tenantSlug,  // new input param for tenant context (optional for superadmin)
//     ipInfo,
//   }: LoginInput & { tenantSlug?: string; ipInfo?: any }
// ) => {
//   // Fetch user by email first
//   const user = await db.query.users.findFirst({ where: eq(users.email, email) });
//   if (!user || !user.email || !user.passwordHash) {
//     await logLoginAttempt({
//       email,
//       status: 'FAILED',
//       reason: 'User not found',
//       ...ipInfo,
//     });
//     throw new AppError(ERRORS.INVALID_CREDENTIALS);
//   }

//   //If not superadmin, tenantSlug is required and user must belong to that tenant
//   // if (user.staticRole !== Roles.SUPER_ADMIN) {
//   //   if (!tenantSlug) {
//   //     // throw new AppError('Tenant is required for non-superadmin users');
//   //           throw new AppError(ERRORS.UNAUTHORIZED_ACCESS);
//   //   }

//   //   const tenant = await db.query.tenants.findFirst({ where: eq(tenants.slug, tenantSlug) });
//   //   if (!tenant) {
//   //     throw new AppError(ERRORS.INVALID_TENANT);
//   //   }

//   //   if (user.tenantId !== tenant.id) {
//   //     // throw new AppError('User does not belong to this tenant');
//   //           throw new AppError(ERRORS.USER_NOT_FOUND);
//   //   }
//   // }

//   // Check password
//   const match = await bcrypt.compare(password, user.passwordHash);
//   if (!match) {
//     await logLoginAttempt({
//       email,
//       userId: user.id,
//       status: 'FAILED',
//       reason: 'Incorrect password',
//       ...ipInfo,
//     });
//     throw new AppError(ERRORS.INVALID_CREDENTIALS);
//   }

//   // OTP sending logic (unchanged)
//   if (FEATURE_FLAGS.useTwilioOtp) {
//     if (!user.mobile) {
//       throw new AppError(ERRORS.USER_NOT_FOUND);
//     }
//     await TwilioOtpService.TwilioOtpService.sendOtp({ identifier: user.mobile });
//   } else {
//     await OtpService.sendOtp({
//       identifier: user.email,
//       type: 'LOGIN',
//     });
//   }

//   await logLoginAttempt({
//     email,
//     userId: user.id,
//     status: 'SUCCESS',
//     reason: 'OTP sent',
//     ...ipInfo,
//   });

//   return { identifier: user.email };
// };


export const verifyOtpLogin = async ({
  identifier,
  otp,
  ipInfo
}: {
  identifier: string;
  otp: string;
  ipInfo?: any;
}) => {
  // 1. Fetch user using identifier (email or mobile if applicable)
  const user = await db.query.users.findFirst({ where: eq(users.email, identifier) });
  if (!user) throw new AppError(ERRORS.USER_NOT_FOUND);

  // 2. Verify OTP
    if (FEATURE_FLAGS.useTwilioOtp) {
  if (!user.mobile) {
    throw new AppError(ERRORS.USER_NOT_FOUND);
  }
  await TwilioOtpService.TwilioOtpService.verifyOtp({ identifier: user.mobile, otp });
    } else {
     await OtpService.verifyOtp({ identifier, otp, type: 'LOGIN' });
    }

  // 3. Build role & permission payload
  const { roleNames, permissionNames, scope } = await getUserRolesAndPermissions(
    user.id,
    !!user.isEmployee,
    user.staticRole
  );

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    userId: user.id,
    tenantId: user.tenantId,
    staticRole: user.staticRole || undefined,
    isEmployee: user.isEmployee,
    roleNames,
    permissions: permissionNames,
    scope
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // 4. Save refresh token to DB
  const inserted = await db.insert(sessions).values({
    id: uuidv4(),
    userId: user.id,
    tenantId: user.tenantId,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 86400000), // 7 days
  });

  await logLoginAttempt({
    email: identifier,
    userId: user.id,
    status: 'SUCCESS',
    reason: 'OTP verified and logged in',
    ...ipInfo,
  });

  return { accessToken, refreshToken };
};


// export const verifyOtpLogin = async ({
//   identifier,
//   otp,
// }: {
//   identifier: string;
//   otp: string;
// }) => {
//   await OtpService.verifyOtp({ identifier, otp, type: 'LOGIN' });

//   const user = await db.query.users.findFirst({ where: eq(users.email, identifier) });
//   if (!user) throw new AppError(ERRORS.USER_NOT_FOUND);

//   const { roleNames, permissionNames } = await getUserRolesAndPermissions(
//     user.id,
//     !!user.isEmployee,
//     user.staticRole
//   );

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

  const { roleNames, permissionNames, scope } = await getUserRolesAndPermissions(user.id, !!user.isEmployee, user.staticRole);

  const newPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    userId: user.id,
    tenantId: user.tenantId,
    staticRole: user.staticRole || undefined,
    isEmployee: user.isEmployee,
    roleNames,
    permissions: permissionNames,
    scope
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
  let scope;
  if (isEmployee) {
    const roleRows = await db
      .select({ id: roles.id, name: roles.name, scope: roles.scope })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, userId));

    const roleIds = roleRows.map((r) => r.id);
    roleNames = roleRows.map((r) => r.name);
    scope = roleRows[0]?.scope ?? 'TENANT';

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

  return { roleNames, permissionNames, scope };
};

export const requestPasswordReset = async (email: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) throw new AppError(ERRORS.USER_NOT_FOUND);

  await OtpService.generateOtp({
    identifier: email,
    purpose: "password_reset",
  });

  await sendPasswordResetOtp({ email });
};

export const verifyResetOtp = async ({ identifier, otp }: VerifyResetOtpInput) => {
  const isValid = await OtpService.verifyOtp({identifier, otp, type: 'password_reset'});
  if (!isValid) throw new AppError(ERRORS.INVALID_OTP);

  // const resetToken = generateResetToken(); // e.g. JWT or UUID
  const resetToken = uuidv4();
  await insertResetToken(identifier, resetToken);

  return { resetToken };
};

export const resetPassword = async ({ resetToken, newPassword }: ResetPasswordInput) => {
  const tokenEntry = await db.query.resetTokens.findFirst({
    where: eq(resetTokens.token, resetToken),
  });

  if (!tokenEntry || tokenEntry.expiresAt < new Date()) {
    throw new AppError(ERRORS.INVALID_TOKEN);
  }

  const passwordHash = await hashPassword(newPassword);

  await db
    .update(users)
    .set({ passwordHash: passwordHash })
    .where(eq(users.email, tokenEntry.identifier));

  await invalidateResetToken(resetToken);
};

export const getAllLogs = async () => {
    return await db.select().from(authLogins).orderBy(desc(authLogins.createdAt));
};