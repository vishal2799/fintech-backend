import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { db } from '../../db';
import { eq, inArray } from 'drizzle-orm';
import { permissions, rolePermissions, roles, sessions, userRoles, users } from '../../db/schema';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt';

export const checkHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
    res.status(200).json({message: 'Successful check'});
}

export const login = async (req:Request, res:Response) => {
  const { email, password } = req.body;
  const user = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (!user) {
    res.status(401).json({ message: 'Invalid credentials' });
    return
  }

  if (!user.passwordHash) {
    res.status(401).json({ message: 'Invalid credentials' });
    return
  }
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
 res.status(401).json({ message: 'Invalid credentials' });
return  
}

// ✅ Fetch role names
  const roleResults = await db
    .select({ name: roles.name, id: roles.id })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(eq(userRoles.userId, user.id));

  const roleIds = roleResults.map(r => r.id);
  const roleNames = roleResults.map(r => r.name); // ['SUPER_ADMIN', 'WL_ADMIN']

  // ✅ Get permissions for those roles
  const permissionResults = await db
    .select({ name: permissions.name })
    .from(rolePermissions)
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(inArray(rolePermissions.roleId, roleIds))

  const permissionNames = permissionResults.map(p => p.name); // ['services:read', 'services:update']
console.log(permissionResults)
  const payload = { userId: user.id, tenantId: user.tenantId, roleNames, permissions: permissionNames };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await db.insert(sessions).values({ userId: user.id, token: refreshToken, tenantId: user.tenantId, expiresAt: new Date(Date.now() + 7 * 86400000) });

  return res.json({ accessToken, refreshToken });
};

export const refresh = async (req:Request, res:Response) => {
  const { token } = req.body;
  // validate refresh token
  const payload = verifyRefreshToken(token) as any;

  const session = await db.query.sessions.findFirst({
    where: eq(sessions.token, token)
  });

  if (!session) return res.status(401).json({ message: 'Session not found' });

  const accessToken = generateAccessToken({ userId: payload.userId, tenantId: payload.tenantId });

  return res.json({ accessToken });
};

export const logout = async (req:Request, res:Response) => {
  const { token } = req.body;
  await db.delete(sessions).where(eq(sessions.token, token));
  return res.json({ message: 'Logged out' });
};

// export async function login(email: string, password: string) {
//   const user = await db.query.users.findFirst({ where: eq(users.email, email) });

//   if (!user) throw new Error('Invalid credentials');

//   // TODO: validate password

//   // 🔽 Fetch assigned roles
//   const userRoleJoins = await db
//     .select({
//       roleName: roles.name,
//     })
//     .from(userRoles)
//     .innerJoin(roles, eq(userRoles.roleId, roles.id))
//     .where(eq(userRoles.userId, user.id));

//   const roleNames = userRoleJoins.map((r) => r.roleName);

//   // 🔑 Generate JWT with roles
//   const token = jwt.sign(
//     {
//       sub: user.id,
//       tenantId: user.tenantId,
//       roles: roleNames,
//     },
//     process.env.JWT_SECRET!,
//     { expiresIn: '15m' }
//   );

//   return { token };
//   res.json({
//         accessToken: token,
//         user: {
//           id: user.id,
//           name: user.name,
//           email: user.email,
//           roles
//         }
// }

// export const loginHandler = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): void => {
//   (async () => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ error: 'Email and password are required' });
//     }

//     try {
//       const user = await AuthService.validateCredentials(email, password);

//       if (!user.passwordHash) {
//         return res.status(400).json({ error: 'User has no password set' });
//       }

//       const roles = await AuthService.getUserRoles(user.id);

//       const payload = {
//         userId: user.id,
//         tenantId: user.tenantId,
//         roles
//       };

//       const token = AuthService.generateToken(payload);

//       await AuthService.logSession({
//         userId: user.id,
//         tenantId: user.tenantId,
//         token,
//         ipAddress: req.ip,
//         userAgent: req.headers['user-agent'] || ''
//       });

//       res.json({
//         accessToken: token,
//         user: {
//           id: user.id,
//           name: user.name,
//           email: user.email,
//           roles
//         }
//       });
//     } catch (err: any) {
//       res.status(401).json({ error: err.message || 'Unauthorized' });
//     }
//   })().catch(next); // Ensure internal errors pass to Express
// };

export const meHandler = (req: Request, res: Response): void => {
  const user = (req as any).user;

  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return; // ✅ prevent further execution
  }

  res.json({ user });
};
