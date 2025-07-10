import { Request, Response } from "express";
import { db } from "../../db";
import { roles, userRoles, users } from "../../db/schema";
import { hashPassword } from "../../utils/hash";
import { v4 as uuidv4 } from 'uuid';
import { and, eq, ne } from "drizzle-orm";

export const createEmployee = async (req: Request, res: Response) => {
  const { name, email, mobile, password, roleId } = req.body;
  const tenantId = req.user?.tenantId;

  if (!tenantId) {
    res.status(400).json({ message: 'Tenant ID missing from token' });
    return
  }

  const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (existing) {
    res.status(400).json({ message: 'User already exists' });
    return
  }

  const role = await db.query.roles.findFirst({ where: eq(roles.id, roleId) });
  if (!role || role.scope !== 'TENANT') {
    res.status(400).json({ message: 'Invalid or unauthorized role' });
    return
  }

  const hashed = await hashPassword(password);
  const newUserId = uuidv4();

  await db.insert(users).values({
    id: newUserId,
    name,
    email,
    mobile,
    passwordHash: hashed,
    tenantId,
    isVerified: true
  });

  await db.insert(userRoles).values({
    userId: newUserId,
    roleId,
    assignedBy: req.user?.id
  });

  res.status(201).json({ message: 'Employee created' });
};



export const listEmployees = async (req: Request, res: Response) => {
  const tenantId = req.user?.tenantId;

  if (!tenantId) {
    res.status(400).json({ message: 'Tenant ID missing from token' });
    return
  }

  const filters = [
    eq(users.tenantId, tenantId)
  ];
  if (req.user?.id) {
    filters.push(ne(users.id, req.user.id)); // exclude self
  }

  type EmployeeUser = typeof users.$inferSelect & {
    userRoles: Array<{
      role: typeof roles.$inferSelect
    }>
  };

  const employeeUsers = await db.query.users.findMany({
    where: and(...filters),
    with: {
      userRoles: {
        with: {
          role: true
        }
      }
    }
  });

  const formatted = (employeeUsers as EmployeeUser[]).map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    mobile: u.mobile,
    role: u.userRoles[0]?.role?.name ?? 'N/A',
    status: u.status
  }));

  res.json(formatted);
};


export const updateEmployee = async (req: Request, res: Response) => {
  const { name, mobile, status, roleId } = req.body;
  const employeeId = req.params.id;
  const tenantId = req.user?.tenantId;

  if (!tenantId) {
    res.status(400).json({ message: 'Tenant ID missing from token' });
    return
  }

  const employee = await db.query.users.findFirst({
    where: and(eq(users.id, employeeId), eq(users.tenantId, tenantId))
  });

  if (!employee) {
    res.status(404).json({ message: 'Employee not found' });
    return
  }

  await db.update(users)
    .set({ name, mobile, status })
    .where(eq(users.id, employeeId));

  if (roleId) {
    // Remove existing roles (assuming single-role model)
    await db.delete(userRoles).where(eq(userRoles.userId, employeeId));

    await db.insert(userRoles).values({
      userId: employeeId,
      roleId,
      assignedBy: req.user?.id
    });
  }

  res.json({ message: 'Employee updated' });
};


export const deleteEmployee = async (req: Request, res: Response) => {
  const employeeId = req.params.id;
  const tenantId = req.user?.tenantId;

  if (!tenantId) {
    res.status(400).json({ message: 'Tenant ID missing from token' });
    return
  }

  const employee = await db.query.users.findFirst({
    where: and(eq(users.id, employeeId), eq(users.tenantId, tenantId))
  });

  if (!employee) {
    res.status(404).json({ message: 'Employee not found' });
    return
  }

  await db.delete(userRoles).where(eq(userRoles.userId, employeeId));
  await db.delete(users).where(eq(users.id, employeeId));

  res.json({ message: 'Employee deleted' });
};
