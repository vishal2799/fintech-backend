import { desc, eq } from "drizzle-orm";
import { db } from "../../db";
import { fundRequest, userWallet, userWalletTransaction } from "../../db/schema";

export const ensureUserWalletExists = async (userId: string) => {
  const [wallet] = await db
    .select()
    .from(userWallet)
    .where(eq(userWallet.userId, userId));

  if (!wallet) {
    await db.insert(userWallet).values({
      userId,
      balance: (0).toString(),
      heldAmount: (0).toString(),
    });
  }
};

export const getUserWalletBalance = async (userId: string) => {
  const [wallet] = await db
    .select()
    .from(userWallet)
    .where(eq(userWallet.userId, userId));
  return wallet ?? { balance: 0, heldAmount: 0 };
};

export const getUserWalletLedger = async (userId: string) => {
  return await db
    .select()
    .from(userWalletTransaction)
    .where(eq(userWalletTransaction.userId, userId))
    .orderBy(desc(userWalletTransaction.createdAt));
};

export const getCreditRequestsByUser = async (userId: string) => {
  return await db
    .select()
    .from(fundRequest)
    .where(eq(fundRequest.requestedByUserId, userId))
    .orderBy(desc(fundRequest.createdAt));
};

export const requestCredit = async ({
  tenantId,
  amount,
  requestedByUserId,
  remarks,
  bankId
}: {
  tenantId: string;
  amount: number;
  requestedByUserId: string;
  bankId: string;
  remarks?: string;
}) => {
  await ensureUserWalletExists(requestedByUserId);

  const res = await db.insert(fundRequest).values({
    tenantId: tenantId,
    bankId,
    amount: amount.toString(),
    requestedByUserId,
    remarks,
    status: 'PENDING',
  }).returning();

  return { data: res[0],success: true, message: 'Credit request submitted.' };
};