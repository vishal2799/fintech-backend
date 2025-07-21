// src/services/adminUsers/adminUsers.service.ts
import { and, eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../db';
import { users, roles, userRoles } from '../../db/schema';
import { Roles } from '../../constants/roles';
import { hashPassword } from '../../utils/hash';
import { AppError } from '../../utils/AppError';

// export const getWLAdmins = async (tenantId?: string) => {
//   const baseCond = eq(roles.name, Roles.WL_ADMIN as unknown as string);

//   return tenantId
//     ? db
//         .select({
//           id: users.id,
//           name: users.name,
//           email: users.email,
//           mobile: users.mobile,
//           status: users.status,
//           tenantId: users.tenantId,
//         })
//         .from(users)
//         .innerJoin(userRoles, eq(userRoles.userId, users.id))
//         .innerJoin(roles, eq(roles.id, userRoles.roleId))
//         .where(and(baseCond, eq(users.tenantId, tenantId))) // both conditions
//     : db
//         .select({
//           id: users.id,
//           name: users.name,
//           email: users.email,
//           mobile: users.mobile,
//           status: users.status,
//           tenantId: users.tenantId,
//         })
//         .from(users)
//         .innerJoin(userRoles, eq(userRoles.userId, users.id))
//         .innerJoin(roles, eq(roles.id, userRoles.roleId))
//         .where(baseCond); // single condition
// };

// export const getWLAdminById = async (id: string) => {
//   const user = await db.query.users.findFirst({ where: eq(users.id, id) });
//   if (!user) throw new AppError('Not found', 404);
//   return user;
// };

// export const createWLAdminUser = async (data: {
//   name: string;
//   email: string;
//   mobile: string;
//   password: string;
//   tenantId: string;
// }) => {
//   const existing = await db.query.users.findFirst({ where: eq(users.email, data.email) });
//   if (existing) throw new AppError('User already exists', 400);

//   const hashedPassword = await hashPassword(data.password);
//   const userId = uuidv4();

//   await db.insert(users).values({
//     id: userId,
//     name: data.name,
//     email: data.email,
//     mobile: data.mobile,
//     tenantId: data.tenantId,
//     passwordHash: hashedPassword,
//     isVerified: true,
//     status: 'ACTIVE',
//   });

//   const role = await db.query.roles.findFirst({ where: eq(roles.name, Roles.WL_ADMIN) });
//   if (!role) throw new AppError('WL Admin role not found', 400);

//   await db.insert(userRoles).values({ userId, roleId: role.id });

//   return { id: userId };
// };

// export const updateWLAdmin = async (id: string, updates: any) => {
//   const values: any = {};
//   if (updates.name) values.name = updates.name;
//   if (updates.email) values.email = updates.email;
//   if (updates.mobile) values.mobile = updates.mobile;
//   if (updates.status) values.status = updates.status;
//   if (updates.password) values.passwordHash = await hashPassword(updates.password);

//   await db.update(users).set(values).where(eq(users.id, id));
//   return { id };
// };

type STATUS = 'ACTIVE' | 'LOCKED' | 'BLOCKED'

export const updateWLAdminStatus = async (id: string, status: STATUS) => {
  await db.update(users).set({ status }).where(eq(users.id, id));
  return { id };
};

export const deleteWLAdmin = async (id: string) => {
  await db.delete(users).where(eq(users.id, id));
  return { id };
};

type StaticRole = 'SUPER_ADMIN' | 'WL_ADMIN' | 'SD' | 'D' | 'R' | 'EMPLOYEE';

export const getUsersByStaticRole = async (
  tenantId: string,
  staticRole: StaticRole
) => {
  if (staticRole === 'EMPLOYEE') {
    const rows = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        mobile: users.mobile,
        staticRole: users.staticRole,
        tenantId: users.tenantId,
        isEmployee: users.isEmployee,
        roleId: roles.id,
        roleName: roles.name,
      })
      .from(users)
      .leftJoin(userRoles, eq(userRoles.userId, users.id))
      .leftJoin(roles, eq(roles.id, userRoles.roleId))
      .where(
        and(
          eq(users.tenantId, tenantId),
          eq(users.staticRole, 'EMPLOYEE')
        )
      );

    return rows.map((u) => ({
      ...u,
      role: u.roleId ? { id: u.roleId, name: u.roleName } : undefined,
    }));
  }

  // for other static roles (SD/D/R/etc.), basic query
  const rows = await db
    .select()
    .from(users)
    .where(
      and(eq(users.tenantId, tenantId), eq(users.staticRole, staticRole))
    );

  return rows;
};


export const createUserWithStaticRole = async ({
  tenantId,
  parentId = null,
  name,
  email,
  mobile,
  passwordHash,
  staticRole,
}: {
  tenantId: string;
  parentId?: string | null;
  name: string;
  email: string;
  mobile: string;
  passwordHash: string;
  staticRole: StaticRole;
}) => {
  const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (existing) throw new AppError('User already exists', 400);

  await db.insert(users).values({
    id: uuidv4(),
    tenantId,
    parentId: parentId ?? undefined,
    name,
    email,
    mobile,
    passwordHash,
    staticRole,
    isVerified: true,
  });

  return { message: 'User created' };
};


// ✅ Get users by static role (e.g., 'RETAILER', 'DISTRIBUTOR')
export const getUsersByRole = async (tenantId: string, roleName: StaticRole) => {
  const rows = await db
    .select()
    .from(users)
    .where(
      and(
        eq(users.tenantId, tenantId),
        eq(users.staticRole, roleName)
      )
    );

  return rows;
};

export const createUserWithRole = async ({
  tenantId,
  parentId = null,
  name,
  email,
  mobile,
  passwordHash,
  roleId,
  isEmployee = false,
}: {
  tenantId: string;
  parentId?: string | null;
  name: string;
  email: string;
  mobile: string;
  passwordHash: string;
  roleId: string;
  isEmployee?: boolean;
}) => {
  const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (existing) throw new AppError('User already exists', 400);

  const userId = uuidv4();

  await db.insert(users).values({
    id: userId,
    tenantId,
    parentId: parentId ?? undefined,
    name,
    email,
    mobile,
    passwordHash,
    isVerified: true,
    isEmployee,
    staticRole: Roles.EMPLOYEE,
  });

  if (isEmployee) {
    const roleRec = await db.query.roles.findFirst({ where: eq(roles.id, roleId) });
    if (!roleRec) throw new AppError('Dynamic role not found', 400);

    await db.insert(userRoles).values({
      userId,
      roleId: roleRec.id,
      assignedBy: parentId ?? undefined,
    });
  }

  return { message: 'User created' };
};


// ✅ Update user basic info
export const updateUserBasic = async (id: string, data: Partial<typeof users.$inferInsert>) => {
  const { createdAt, updatedAt, ...sanitized } = data;
  const [updated] = await db.update(users).set(sanitized).where(eq(users.id, id)).returning();
  return updated;
};


// ✅ Delete user (and userRoles if employee)
export const deleteUser = async (id: string) => {
  await db.delete(userRoles).where(eq(userRoles.userId, id)); // only affects employee
  const [deleted] = await db.delete(users).where(eq(users.id, id)).returning();
  return deleted;
};

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
  const updates: any = {};
  if (name) updates.name = name;
  if (email) updates.email = email;
  if (mobile) updates.mobile = mobile;

  // Update basic fields
  const [updatedUser] = await db.update(users).set(updates).where(eq(users.id, id)).returning();

  if (!updatedUser) throw new AppError('User not found', 404);

  // Handle employee dynamic role update
  if (isEmployee && roleId) {
    const roleRec = await db.query.roles.findFirst({ where: eq(roles.id, roleId) });
    if (!roleRec) throw new AppError('Role not found', 400);

    // Delete old role mapping and insert new
    await db.delete(userRoles).where(eq(userRoles.userId, id));

    await db.insert(userRoles).values({
      userId: id,
      roleId: roleRec.id,
      assignedBy: updatedUser.parentId ?? null,
    });
  }

  return updatedUser;
};



// export const getUsersByRole = async (tenantId: string, roleName: string) => {
//   const role = await db.query.roles.findFirst({ where: eq(roles.name, roleName) });
//   if (!role) throw new AppError('Role not found', 400);

//   const rows = await db
//     .select()
//     .from(users)
//     .innerJoin(userRoles, eq(users.id, userRoles.userId))
//     .where(
//       and(
//         eq(users.tenantId, tenantId),
//         eq(userRoles.roleId, role.id)
//       )
//     );

//   return rows.map((r) => r.users);
// };

// export const createUserWithRole = async ({
//   tenantId,
//   parentId = null,
//   name,
//   email,
//   mobile,
//   passwordHash,
//   role,
// }: {
//   tenantId: string;
//   parentId: string | null;
//   name: string;
//   email: string;
//   mobile: string;
//   passwordHash: string;
//   role: string;
// }) => {
//   const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
//   if (existing) throw new AppError('User already exists', 400);

//   const userId = uuidv4();
//   await db.insert(users).values({
//     id: userId,
//     tenantId,
//     parentId: parentId ?? undefined,
//     name,
//     email,
//     mobile,
//     passwordHash,
//     isVerified: true,
//   });

//   const roleRec = await db.query.roles.findFirst({ where: eq(roles.name, role) });
//   if (!roleRec) throw new AppError('Role not found', 400);

//   await db.insert(userRoles).values({ userId, roleId: roleRec.id });

//   return { message: 'User created' };
// };

// export const updateUserBasic = async (id: string, data: Partial<typeof users.$inferInsert>) => {
//   const [updated] = await db.update(users).set(data).where(eq(users.id, id)).returning();
//   return updated;
// };

// export const deleteUser = async (id: string) => {
//   const [deleted] = await db.delete(users).where(eq(users.id, id)).returning();
//   return deleted;
// };

