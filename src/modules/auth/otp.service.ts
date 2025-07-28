import { db } from '../../db';
import { otp as otpTable } from '../../db/schema';
import { AppError } from '../../utils/AppError';
import { eq, and, desc } from 'drizzle-orm';
import dayjs from 'dayjs';
import { ERRORS } from '../../constants/errorCodes';

export const sendOtp = async (data: { identifier: string; type: string }) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();

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


// export const verifyOtp = async (data: { identifier: string; otp: string; type: string }) => {
//   const now = new Date();

//   const [record] = await db
//     .select()
//     .from(otpTable)
//     .where(
//       and(
//         eq(otpTable.identifier, data.identifier),
//         eq(otpTable.otp, data.otp),
//         eq(otpTable.type, data.type),
//         eq(otpTable.isUsed, false)
//       )
//     )
//     .orderBy(desc(otpTable.createdAt));

//   if (!record) throw new AppError(ERRORS.INVALID_OTP);
//   if (record.expiresAt < now) throw new AppError(ERRORS.INVALID_OTP);

//   await db
//     .update(otpTable)
//     .set({ isUsed: true })
//     .where(eq(otpTable.id, record.id));

//   return { success: true, message: 'OTP verified' };
// };
