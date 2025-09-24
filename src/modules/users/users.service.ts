import { and, eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../db';
import { users, roles, userRoles } from '../../db/schema';
import { Roles } from '../../constants/roles';
import { AppError } from '../../utils/AppError';
import { ERRORS } from '../../constants/errorCodes';

type Status = 'ACTIVE' | 'LOCKED' | 'BLOCKED';
type StaticRole = 'SUPER_ADMIN' | 'WL_ADMIN' | 'SD' | 'D' | 'R' | 'EMPLOYEE';

/* -------------------------------- Get users by role ------------------------------- */
// export const getUsersByStaticRole = async (
//   tenantId: string,
//   staticRole: StaticRole,
//   isSuperAdmin = false
// ) => {
//   if (staticRole === Roles.EMPLOYEE) {
//     const rows = await db
//       .select({
//         id: users.id,
//         name: users.name,
//         email: users.email,
//         mobile: users.mobile,
//         staticRole: users.staticRole,
//         tenantId: users.tenantId,
//         isEmployee: users.isEmployee,
//         roleId: roles.id,
//         roleName: roles.name,
//       })
//       .from(users)
//       .leftJoin(userRoles, eq(userRoles.userId, users.id))
//       .leftJoin(roles, eq(roles.id, userRoles.roleId))
//       .where(
//         isSuperAdmin ? eq(users.staticRole, Roles.EMPLOYEE) : and(eq(users.tenantId, tenantId), eq(users.staticRole, Roles.EMPLOYEE))
//       );

//     return rows.map((u) => ({
//       ...u,
//       role: u.roleId ? { id: u.roleId, name: u.roleName } : undefined,
//     }));
//   }

//   // Non-employee roles (WL_ADMIN, SD, D, etc.)
//   return db
//     .select()
//     .from(users)
//     .where(
//       isSuperAdmin ? eq(users.staticRole, staticRole) : and(eq(users.tenantId, tenantId), eq(users.staticRole, staticRole))
//     )
//     // .where(and(eq(users.tenantId, tenantId), eq(users.staticRole, staticRole)));
// };

export const getUsersByStaticRole = async (
  tenantId: string,
  staticRole: StaticRole,
  isSuperAdmin = false,
  parentId?: string // 👈 add this
) => {
  // EMPLOYEE part stays same...

  // For NON-EMPLOYEES (WL_ADMIN, SD, D, etc.)
  const whereClause = [];

  if (!isSuperAdmin) {
    whereClause.push(eq(users.tenantId, tenantId));
  }

  whereClause.push(eq(users.staticRole, staticRole));

  if (parentId) {
    whereClause.push(eq(users.parentId, parentId)); // 👈 filter by parentId
  }

  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      mobile: users.mobile,
      staticRole: users.staticRole,
      tenantId: users.tenantId,
      parentId: users.parentId,
    })
    .from(users)
    .where(and(...whereClause));

  return rows.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    mobile: u.mobile,
    staticRole: u.staticRole,
    tenantId: u.tenantId,
    parentId: u.parentId,
  }));
};


/* -------------------------- Create user with static role -------------------------- */
export const createUserWithStaticRole = async ({
  tenantId,
  parentId = null,
  name,
  email,
  mobile,
  username,
  passwordHash,
  staticRole,
}: {
  tenantId: string;
  parentId?: string | null;
  name: string;
  email: string;
  mobile: string;
  username: string;
  passwordHash: string;
  staticRole: StaticRole;
}) => {
  const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (existing) throw new AppError(ERRORS.USER_EXISTS);

  await db.insert(users).values({
    id: uuidv4(),
    tenantId,
    parentId: parentId ?? undefined,
    name,
    username,
    email,
    mobile,
    passwordHash,
    staticRole,
    isVerified: true,
  });

  return { message: 'User created' };
};

/* ---------------------- Create user with dynamic employee role --------------------- */
export const createUserWithRole = async ({
  tenantId,
  parentId = null,
  name,
  email,
  mobile,
  passwordHash,
  roleId,
  username,
  isEmployee = false,
}: {
  tenantId: string;
  parentId?: string | null;
  name: string;
  email: string;
  mobile: string;
  passwordHash: string;
  roleId: string;
  username: string;
  isEmployee?: boolean;
}) => {
  const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (existing) throw new AppError(ERRORS.USER_EXISTS);

  const userId = uuidv4();

  await db.insert(users).values({
    id: userId,
    tenantId,
    parentId: parentId ?? undefined,
    name,
    email,
    username: username,
    mobile,
    passwordHash,
    isVerified: true,
    isEmployee,
    staticRole: Roles.EMPLOYEE,
  });

  if (isEmployee) {
    const roleRec = await db.query.roles.findFirst({ where: eq(roles.id, roleId) });
    if (!roleRec) throw new AppError(ERRORS.DYNAMIC_ROLE_NOT_FOUND);

    await db.insert(userRoles).values({
      userId,
      roleId: roleRec.id,
      assignedBy: parentId ?? undefined,
    });
  }

  return { message: 'User created' };
};

/* ------------------------- Update user profile (basic info) ------------------------ */
export const updateUserBasic = async (
  id: string,
  data: Partial<typeof users.$inferInsert>
) => {
  const { createdAt, updatedAt, ...payload } = data;

  const [updated] = await db
    .update(users)
    .set(payload)
    .where(eq(users.id, id))
    .returning();

  if (!updated) throw new AppError(ERRORS.USER_NOT_FOUND);
  return updated;
};

/* ---------------------------- Update user + role change ---------------------------- */
export const updateUserWithRole = async ({
  id,
  name,
  email,
  mobile,
  roleId,
  isEmployee = false,
}: {
  id: string;
  name?: string;
  email?: string;
  mobile?: string;
  roleId?: string;
  isEmployee?: boolean;
}) => {
  const updates: Partial<typeof users.$inferInsert> = {};
  if (name) updates.name = name;
  if (email) updates.email = email;
  if (mobile) updates.mobile = mobile;

  const [updatedUser] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
  if (!updatedUser) throw new AppError(ERRORS.USER_NOT_FOUND);

  if (isEmployee && roleId) {
    const roleRec = await db.query.roles.findFirst({ where: eq(roles.id, roleId) });
    if (!roleRec) throw new AppError(ERRORS.ROLE_NOT_FOUND);

    await db.delete(userRoles).where(eq(userRoles.userId, id));
    await db.insert(userRoles).values({
      userId: id,
      roleId: roleRec.id,
      assignedBy: updatedUser.parentId ?? null,
    });
  }

  return updatedUser;
};

/* -------------------------- Update user status (WL/Admin) -------------------------- */
export const updateUserStatus = async (id: string, status: Status) => {
  const [updated] = await db
    .update(users)
    .set({ status })
    .where(eq(users.id, id))
    .returning();

  if (!updated) throw new AppError(ERRORS.USER_NOT_FOUND);
  return updated;
};

/* ---------------------- Delete user (removes employee roles too) ------------------- */
export const deleteUser = async (id: string) => {
  await db.delete(userRoles).where(eq(userRoles.userId, id)); // cleanup for employees
  const [deleted] = await db.delete(users).where(eq(users.id, id)).returning();
  if (!deleted) throw new AppError(ERRORS.USER_NOT_FOUND);
  return deleted;
};

export const getUserById = async (id: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  });

  if (!user) throw new AppError(ERRORS.USER_NOT_FOUND);

  return user;
};