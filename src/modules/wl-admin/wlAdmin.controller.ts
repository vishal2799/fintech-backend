import { Request, Response } from 'express';
import * as UserService from '../users/users.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { successHandler } from '../../utils/responseHandler';
import { hashPassword } from '../../utils/hash';
import { Roles } from '../../constants/roles';
import type { CreateWLAdminInput, UpdateWLAdminInput, UpdateWLAdminStatusInput } from './wlAdmin.schema';
import { RESPONSE } from '../../constants/responseMessages';
import { sendWLAdminWelcomeEmail } from '../../templates/email/WlAdminWelcome';
import { eq, or } from 'drizzle-orm';
import { db } from '../../db';
import { tenants } from '../../db/schema';
import { AppError } from '../../utils/AppError';
import { ERRORS } from '../../constants/errorCodes';
import { FEATURE_FLAGS } from '../../config';

export const listWLAdmins = asyncHandler(async (req: Request, res: Response) => {
  const tenantId = req.user?.tenantId!;
  const isSuperAdmin = req.user?.staticRole === Roles.SUPER_ADMIN;
  const users = await UserService.getUsersByStaticRole(tenantId, Roles.WL_ADMIN, isSuperAdmin);

  return successHandler(res, {
    data: users,
    ...RESPONSE.WL_ADMIN.FETCHED
  });
});

export const createWLAdmin = asyncHandler(async (req: Request, res: Response) => {
  const data = (req as any).validated as CreateWLAdminInput;
  const { name, email, mobile, password, tenantId } = data;

  const passwordHash = await hashPassword(password);
  const username = `wladmin_${tenantId}`;

  const result = await UserService.createUserWithStaticRole({
    tenantId,
    parentId: null,
    name,
    email,
    mobile,
    passwordHash,
    username,
    staticRole: Roles.WL_ADMIN,
    // forcePasswordChange: true
  });

  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.id, tenantId)
  });

  if (!tenant?.name) {
    throw new AppError(ERRORS.TENANT_NOT_FOUND);
  }

  // ✅ Send email only if feature flag is enabled
  if (FEATURE_FLAGS.SEND_WL_ADMIN_EMAIL) {
    await sendWLAdminWelcomeEmail({
      to: email, // use actual user email
      name,
      portalUrl: `${process.env.PORTAL_URL}/tenants/${tenant.slug}/login`,
      username: email,
      password,
      tenantName: tenant.name,
      logoUrl: tenant?.logoUrl || ''
    });
  }

  return successHandler(res, {
    data: result,
    ...RESPONSE.WL_ADMIN.CREATED,
  });
});


// export const createWLAdmin = asyncHandler(async (req: Request, res: Response) => {
//   const data = (req as any).validated as CreateWLAdminInput;
//   const { name, email, mobile, password, tenantId } = data;

//   const passwordHash = await hashPassword(password);

//   const result = await UserService.createUserWithStaticRole({
//     tenantId,
//     parentId: null,
//     name,
//     email,
//     mobile,
//     passwordHash,
//     staticRole: Roles.WL_ADMIN,
//   });

//   return successHandler(res, {
//     data: result,
//     ...RESPONSE.WL_ADMIN.CREATED
//   });
// });

export const updateWLAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = (req as any).validated as UpdateWLAdminInput;

  const updated = await UserService.updateUserBasic(id, updates);

  return successHandler(res, {
    data: updated,
    ...RESPONSE.WL_ADMIN.UPDATED
  });
});

export const deleteWLAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const deleted = await UserService.deleteUser(id);

  return successHandler(res, {
    data: deleted,
    ...RESPONSE.WL_ADMIN.DELETED
  });
});

export const updateWLAdminStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = (req as any).validated as UpdateWLAdminStatusInput;

  const result = await UserService.updateUserStatus(id, status);

  return successHandler(res, {
    data: result,
    ...RESPONSE.WL_ADMIN.STATUS_UPDATED
  });
});

export const getWLAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await UserService.getUserById(id);
  return successHandler(res, {
    data: user,
    message: 'WL Admin fetched successfully',
    status: 200,
  });
});