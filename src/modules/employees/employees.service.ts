// // src/services/employees.service.ts
// import { Request, Response } from 'express';
// import { eq, and } from 'drizzle-orm';
// import { v4 as uuidv4 } from 'uuid';
// import { db } from '../../db';
// import { rolePermissions, userRoles, users } from '../../db/schema';
// import { Roles } from '../../constants/roles';
// import { hashPassword } from '../../utils/hash';

// export const listEmployees = async (req: Request, res: Response) => {
//   const tenantId = req.user?.tenantId;
//   if (!tenantId) {
//     return res.status(400).json({ message: 'Tenant ID is required' });
//   }
//   const employees = await db
//     .select()
//     .from(users)
//     .where(and(eq(users.tenantId, tenantId), eq(users.status, 'ACTIVE')));
//   return res.json(employees);
// };

// export const createEmployee = async (req: Request, res: Response) => {
//   const { name, email, mobile, password, permissions = [] } = req.body;
//   const tenantId = req.user?.tenantId;
//   const userId = uuidv4();
//   const passwordHash = await hashPassword(password);

//   const existingUser = await db.query.users.findFirst({ where: eq(users.email, email) });
//   if (existingUser) return res.status(400).json({ message: 'User already exists' });

//   await db.insert(users).values({
//     id: userId,
//     name,
//     email,
//     mobile,
//     passwordHash,
//     tenantId,
//     isVerified: true,
//   });

//   // Assign EMPLOYEE role
//   const role = await db.query.roles.findFirst({ where: eq(users.name, Roles.EMPLOYEE) });
//   if (!role) return res.status(400).json({ message: 'Role not found' });

//   await db.insert(userRoles).values({ userId, roleId: role.id });

//   // Assign permissions
//   if (permissions.length > 0) {
//     const rolePermValues = permissions.map((permId: string) => ({
//       roleId: role.id,
//       permissionId: permId,
//     }));
//     await db.insert(rolePermissions).values(rolePermValues);
//   }

//   return res.status(201).json({ message: 'Employee created' });
// };

// export const updateEmployee = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const { name, mobile, status, permissions } = req.body;

//   await db.update(users).set({ name, mobile, status }).where(eq(users.id, id));

//   if (permissions && permissions.length > 0) {
//     const empRole = await db.query.userRoles.findFirst({ where: eq(userRoles.userId, id) });
//     if (empRole) {
//       await db.delete(rolePermissions).where(eq(rolePermissions.roleId, empRole.roleId));
//       await db.insert(rolePermissions).values(
//         permissions.map((permId: string) => ({
//           roleId: empRole.roleId,
//           permissionId: permId,
//         }))
//       );
//     }
//   }

//   return res.json({ message: 'Employee updated' });
// };

// export const deleteEmployee = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   await db.update(users).set({ status: 'BLOCKED' }).where(eq(users.id, id));
//   return res.json({ message: 'Employee deleted' });
// };
