// import { db } from '../../db';
// import { roles, userRoles, users } from '../../db/schema';
// import { hashPassword } from '../../utils/hash';
// import { AppError } from '../../utils/AppError';
// import { v4 as uuidv4 } from 'uuid';
// import { and, eq, ne } from 'drizzle-orm';

// export const createEmployee = async (req: any) => {
//   const { name, email, mobile, password, roleId } = req.body;
//   const tenantId = req.user?.tenantId;

//   if (!tenantId) throw new AppError('Tenant ID missing from token', 400);

//   const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
//   if (existing) throw new AppError('User already exists', 400);

//   const role = await db.query.roles.findFirst({ where: eq(roles.id, roleId) });
//   if (!role || role.scope !== 'TENANT') {
//     throw new AppError('Invalid or unauthorized role', 400);
//   }

//   const hashed = await hashPassword(password);
//   const newUserId = uuidv4();

//   await db.insert(users).values({
//     id: newUserId,
//     name,
//     email,
//     mobile,
//     passwordHash: hashed,
//     tenantId,
//     isVerified: true
//   });

//   await db.insert(userRoles).values({
//     userId: newUserId,
//     roleId,
//     assignedBy: req.user?.id
//   });

//   return { id: newUserId };
// };

// type UserRoleWithRole = {
//   role?: { name: string };
// };

// export const listEmployees = async (req: any) => {
//   const tenantId = req.user?.tenantId;
//   if (!tenantId) throw new AppError('Tenant ID missing from token', 400);

//   const filters = [eq(users.tenantId, tenantId)];
//   if (req.user?.id) filters.push(ne(users.id, req.user.id)); // exclude self

//   const employeeUsers = await db.query.users.findMany({
//     where: and(...filters),
//     with: {
//       userRoles: {
//         with: {
//           role: true
//         }
//       }
//     }
//   });

//   return employeeUsers.map((u) => ({
//     id: u.id,
//     name: u.name,
//     email: u.email,
//     mobile: u.mobile,
//     roles: (Array.isArray(u.userRoles) ? (u.userRoles as UserRoleWithRole[]) : []).map((ur) => ur.role?.name).filter(Boolean), // array of role names
//     status: u.status
//   }));
// };


// export const updateEmployee = async (req: any) => {
//   const { name, mobile, status, roleId } = req.body;
//   const employeeId = req.params.id;
//   const tenantId = req.user?.tenantId;

//   if (!tenantId) throw new AppError('Tenant ID missing from token', 400);

//   const employee = await db.query.users.findFirst({
//     where: and(eq(users.id, employeeId), eq(users.tenantId, tenantId))
//   });

//   if (!employee) throw new AppError('Employee not found', 404);

//   await db.update(users)
//     .set({ name, mobile, status })
//     .where(eq(users.id, employeeId));

//   if (roleId) {
//     await db.delete(userRoles).where(eq(userRoles.userId, employeeId));

//     await db.insert(userRoles).values({
//       userId: employeeId,
//       roleId,
//       assignedBy: req.user?.id
//     });
//   }
// };

// export const deleteEmployee = async (req: any) => {
//   const employeeId = req.params.id;
//   const tenantId = req.user?.tenantId;

//   if (!tenantId) throw new AppError('Tenant ID missing from token', 400);

//   const employee = await db.query.users.findFirst({
//     where: and(eq(users.id, employeeId), eq(users.tenantId, tenantId))
//   });

//   if (!employee) throw new AppError('Employee not found', 404);

//   await db.delete(userRoles).where(eq(userRoles.userId, employeeId));
//   await db.delete(users).where(eq(users.id, employeeId));
// };

