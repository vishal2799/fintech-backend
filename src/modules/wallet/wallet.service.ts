import { desc, eq, and } from 'drizzle-orm';
import { db } from '../../db';
import { creditRequest, tenantWallet, tenantWalletTransaction } from '../../db/schema';
import { AppError } from '../../utils/AppError';

export const ensureTenantWalletExists = async (tenantId: string) => {
  const [wallet] = await db.select().from(tenantWallet).where(eq(tenantWallet.tenantId, tenantId));

  if (!wallet) {
    await db.insert(tenantWallet).values({
      tenantId,
      balance: (0).toString(),
      heldAmount: (0).toString(),
    });
  }
};

export const getTenantWalletBalance = async (tenantId: string) => {
  const [wallet] = await db.select().from(tenantWallet).where(eq(tenantWallet.tenantId, tenantId));
  return wallet ?? { balance: 0, heldAmount: 0 };
};

export const getTenantWalletLedger = async (tenantId: string) => {
  return await db
    .select()
    .from(tenantWalletTransaction)
    .where(eq(tenantWalletTransaction.tenantId, tenantId))
    .orderBy(desc(tenantWalletTransaction.createdAt));
};

export const requestCredit = async ({
  tenantId,
  amount,
  toUserId,
  requestedByUserId,
  remarks,
}: {
  tenantId: string;
  amount: number;
  toUserId: string;
  requestedByUserId: string;
  remarks?: string;
}) => {
  await ensureTenantWalletExists(tenantId);

  await db.insert(creditRequest).values({
    // id: nanoid(),
    fromTenantId: tenantId,
    toUserId,
    amount: amount.toString(),
    requestedByUserId,
    remarks,
    status: 'PENDING',
  });

  return { success: true, message: 'Credit request submitted.' };
};

export const getAllCreditRequests = async () => {
  return await db.select().from(creditRequest).orderBy(desc(creditRequest.createdAt));
};

export const approveCreditRequest = async ({
  requestId,
  approvedByUserId,
}: {
  requestId: string;
  approvedByUserId: string;
}) => {
  const [request] = await db
    .select()
    .from(creditRequest)
    .where(and(eq(creditRequest.id, requestId), eq(creditRequest.status, 'PENDING')));

  if (!request) throw new AppError('Request not found or already processed', 404);

  await ensureTenantWalletExists(request.fromTenantId);

  const [wallet] = await db
    .select()
    .from(tenantWallet)
    .where(eq(tenantWallet.tenantId, request.fromTenantId));

  await db.transaction(async (tx) => {
    await tx
      .update(tenantWallet)
      .set({
        balance: (Number(wallet.balance) + Number(request.amount)).toString(),
        updatedAt: new Date(),
      })
      .where(eq(tenantWallet.tenantId, request.fromTenantId));

    await tx
      .update(creditRequest)
      .set({
        status: 'APPROVED',
        approvedByUserId,
        updatedAt: new Date(),
      })
      .where(eq(creditRequest.id, requestId));

    await tx.insert(tenantWalletTransaction).values({
      // id: nanoid(),
      tenantId: request.fromTenantId,
      type: 'CREDIT',
      metaType: 'FUND_TOPUP',
      amount: request.amount,
      referenceUserId: request.requestedByUserId,
      relatedUserId: approvedByUserId,
      description: 'Approved credit request by Super Admin',
      status: 'SUCCESS',
    });
  });

  return { success: true, message: 'Request approved and wallet funded.' };
};

export const rejectCreditRequest = async ({
  requestId,
  approvedByUserId,
  remarks,
}: {
  requestId: string;
  approvedByUserId: string;
  remarks?: string;
}) => {
  const [request] = await db
    .select()
    .from(creditRequest)
    .where(and(eq(creditRequest.id, requestId), eq(creditRequest.status, 'PENDING')));

  if (!request) throw new AppError('Request not found or already processed', 404);

  await db.update(creditRequest).set({
    status: 'REJECTED',
    approvedByUserId,
    remarks,
    updatedAt: new Date(),
  }).where(eq(creditRequest.id, requestId));

  return { success: true, message: 'Request rejected.' };
};

export const manualTopupTenantWallet = async ({
  tenantId,
  amount,
  userId,
  description,
}: {
  tenantId: string;
  amount: number;
  userId: string;
  description?: string;
}) => {
  await ensureTenantWalletExists(tenantId);

  const [wallet] = await db.select().from(tenantWallet).where(eq(tenantWallet.tenantId, tenantId));

  await db.transaction(async (tx) => {
    await tx.update(tenantWallet).set({
      balance: (Number(wallet.balance) + amount).toFixed(2),
      updatedAt: new Date(),
    }).where(eq(tenantWallet.tenantId, tenantId));

    await tx.insert(tenantWalletTransaction).values({
      // id: nanoid(),
      tenantId,
      type: 'CREDIT',
      metaType: 'FUND_TOPUP',
      amount: amount.toString(),
      referenceUserId: userId,
      description: description ?? 'Manual top-up by Super Admin',
      status: 'SUCCESS',
    });
  });

  return { success: true, message: 'Tenant wallet credited.' };
};
