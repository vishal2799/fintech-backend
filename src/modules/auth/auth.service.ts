import { db } from '../../db';
import { users, sessions, userRoles, roles } from '../../db/schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { comparePassword } from '../../utils/hash';

const JWT_SECRET = process.env.JWT_SECRET!;

export const AuthService = {
  async validateCredentials(email: string, password: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user || user.status !== 'ACTIVE') {
      throw new Error('Invalid credentials or inactive account');
    }

    if (!user.passwordHash) {
  throw new Error('Password not set for user');
   }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    return user;
  },

  async getUserRoles(userId: string) {
    const roleMap = await db
      .select({ roleId: userRoles.roleId, roleName: roles.name })
      .from(userRoles)
      .leftJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, userId));

    return roleMap.map((r) => r.roleName);
  },

  generateToken(payload: object) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });
  },

  async logSession({
    userId,
    tenantId,
    token,
    ipAddress,
    userAgent
  }: {
    userId: string;
    tenantId: string;
    token: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    await db.insert(sessions).values({
      id: uuidv4(),
      userId,
      tenantId,
      token,
      ipAddress,
      userAgent,
      isActive: true,
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000)
    });
  }
};
