// src/modules/auth/auth.logger.ts
import { db } from '../../db';
import { authLogins } from '../../db/schema/authLogins';

type LoginLogOptions = {
  email: string;
  status: 'SUCCESS' | 'FAILED';
  userId?: string | null;
  reason?: string;
  ipAddress?: string;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  userAgent?: string;
};

export const logLoginAttempt = async ({
  email,
  status,
  userId = null,
  reason,
  ipAddress,
  latitude,
  longitude,
  accuracy,
  userAgent,
}: LoginLogOptions) => {
  try {
    await db.insert(authLogins).values({
      email,
      userId,
      status,
      reason,
      ipAddress,
      latitude,
      longitude,
      accuracy,
      userAgent,
    });
  } catch (err) {
    console.error('Failed to log login attempt:', err);
  }
};
