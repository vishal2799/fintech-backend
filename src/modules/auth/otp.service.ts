import { db } from '../../db';
import { otp as otpTable } from '../../db/schema';
import { AppError } from '../../utils/AppError';
import { eq, and, desc } from 'drizzle-orm';
import dayjs from 'dayjs';
import { ERRORS } from '../../constants/errorCodes';

export const sendOtp = async (data: { identifier: string; type: string, staticOTP?:boolean }) => {
  const code = data.staticOTP ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();

  const expiresAt = dayjs().add(5, 'minutes').toDate();

  await db.insert(otpTable).values({
    // id: nanoid(),
    identifier: data.identifier,
    type: data.type,
    otp: code,
    expiresAt,
    isUsed: false,
  });

  // Replace this with SMS/Email integration
  console.log(`Sending OTP ${code} to ${data.identifier}`);

  return { success: true, message: 'OTP sent successfully' };
};

export const verifyOtp = async (data: { identifier: string; otp: string; type: string }) => {
  const now = new Date();

  const [record] = await db
    .select()
    .from(otpTable)
    .where(
      and(
        eq(otpTable.identifier, data.identifier),
        eq(otpTable.otp, data.otp),
        eq(otpTable.type, data.type),
        eq(otpTable.isUsed, false)
      )
    )
    .orderBy(desc(otpTable.createdAt));

  if (!record) throw new AppError({ message: 'Invalid OTP', status: 400, errorCode: 'INVALID_OTP' });

  if (record.expiresAt < now) {
    throw new AppError({ message: 'OTP expired', status: 400, errorCode: 'OTP_EXPIRED' });
  }

  const updated = await db
    .update(otpTable)
    .set({ isUsed: true })
    .where(eq(otpTable.id, record.id));

  if (!updated.rowCount) {
    throw new AppError({ message: 'Failed to mark OTP as used', status: 500 });
  }

  return { success: true, message: 'OTP verified' };
};


// 🔹 Generate a new OTP
export const generateOtp = async ({
  identifier,
  purpose, // renamed from type
}: {
  identifier: string;
  purpose: string;
}) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = dayjs().add(10, 'minutes').toDate();

  await db.insert(otpTable).values({
    identifier,
    type: purpose,
    otp: code,
    expiresAt,
    isUsed: false,
  });

  // In prod: replace with real email/SMS
  console.log(`Generated OTP ${code} for ${identifier} [${purpose}]`);

  return code;
};

// 🔹 Fetch the latest OTP (e.g., to send it via email/SMS)
export const getLatestOtp = async (identifier: string, purpose: string) => {
  const [record] = await db
    .select()
    .from(otpTable)
    .where(
      and(
        eq(otpTable.identifier, identifier),
        eq(otpTable.type, purpose),
        eq(otpTable.isUsed, false)
      )
    )
    .orderBy(desc(otpTable.createdAt))
    .limit(1);

  if (!record) throw new AppError(ERRORS.INVALID_OTP);
  return record.otp;
};