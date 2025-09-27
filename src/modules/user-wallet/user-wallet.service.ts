import { and, desc, eq, ne } from "drizzle-orm";
import { db } from "../../db";
import { companyBankAccounts, fundRequest, tenants, users, userWallet, userWalletTransaction } from "../../db/schema";
import { AppError } from "../../utils/AppError";
import { ERRORS } from "../../constants/errorCodes";

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

// WL Admin

export const getAllUserWallets = async (tenantId: string) => {
  const rows = await db
    .select({
      userId: users.id,
      userName: users.name,
      balance: userWallet.balance,
      heldAmount: userWallet.heldAmount,
    })
    .from(users)
    .leftJoin(userWallet, eq(userWallet.userId, users.id))
    .where(eq(users.tenantId, tenantId));

    return rows.map(r => ({
    userId: r.userId,
    userName: r.userName,
    balance: r.balance ? Number(r.balance) : 0,
    heldAmount: r.heldAmount ? Number(r.heldAmount) : 0,
  }));

  // return rows.map((row) => ({
  //   tenantId: row.tenantId,
  //   tenantName: row.tenantName,
  //   balance: row.balance ?? '0',
  //   heldAmount: row.heldAmount ?? '0',
  // }));
  return rows
};

export const getAllCreditRequests = async () => {
  return await db
    .select({
      id: fundRequest.id,
      amount: fundRequest.amount,
      remarks: fundRequest.remarks,
      status: fundRequest.status,
      createdAt: fundRequest.createdAt,
      updatedAt: fundRequest.updatedAt,
      proof: fundRequest.proofUrl,
      fromTenantId: fundRequest.tenantId,
      requestedByUserId: fundRequest.requestedByUserId,
      approvedByUserId: fundRequest.approvedByUserId,
      bankName: companyBankAccounts.bankName,

      tenantName: tenants.name,
      requestedByUserName: users.name,
    })
    .from(fundRequest)
    .where(ne(fundRequest.status, 'PENDING'))
    .leftJoin(tenants, eq(fundRequest.tenantId, tenants.id))
    .leftJoin(companyBankAccounts, eq(fundRequest.bankId, companyBankAccounts.id))
    .leftJoin(users, eq(fundRequest.requestedByUserId, users.id))
    .orderBy(desc(fundRequest.createdAt));
};

export const getPendingCreditRequests = async () => {
  return await db
    .select({
      id: fundRequest.id,
      amount: fundRequest.amount,
      remarks: fundRequest.remarks,
      status: fundRequest.status,
      createdAt: fundRequest.createdAt,
      updatedAt: fundRequest.updatedAt,

      fromTenantId: fundRequest.tenantId,
      requestedByUserId: fundRequest.requestedByUserId,
      approvedByUserId: fundRequest.approvedByUserId,

      bankName: companyBankAccounts.bankName,

      tenantName: tenants.name,
      requestedByUserName: users.name,
    })
    .from(fundRequest)
    .where(eq(fundRequest.status, 'PENDING'))
    .leftJoin(tenants, eq(fundRequest.tenantId, tenants.id))
    .leftJoin(companyBankAccounts, eq(fundRequest.bankId, companyBankAccounts.id))
    .leftJoin(users, eq(fundRequest.requestedByUserId, users.id))
    .orderBy(desc(fundRequest.createdAt));
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
    .from(fundRequest)
    .where(
      and(eq(fundRequest.id, requestId), eq(fundRequest.status, 'PENDING'))
    );

  if (!request)
    throw new AppError(ERRORS.REQUEST_NOT_FOUND);

  await ensureUserWalletExists(request.requestedByUserId);

  const [wallet] = await db
    .select()
    .from(userWallet)
    .where(eq(userWallet.userId, request.requestedByUserId));

  await db.transaction(async (tx) => {
    await tx
      .update(userWallet)
      .set({
        balance: (Number(wallet.balance) + Number(request.amount)).toFixed(2),
        updatedAt: new Date(),
      })
      .where(eq(userWallet.userId, request.requestedByUserId));

    await tx
      .update(fundRequest)
      .set({
        status: 'APPROVED',
        approvedByUserId,
        updatedAt: new Date(),
      })
      .where(eq(fundRequest.id, requestId));

    await tx.insert(userWalletTransaction).values({
      userId: request.requestedByUserId ?? "",
      initiatedByUserId: approvedByUserId ?? "",
      type: 'CREDIT',
      metaType: 'FUND_REQUEST',
      amount: request.amount,
      description: 'Approved credit request by WL Admin',
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
    .from(fundRequest)
    .where(
      and(eq(fundRequest.id, requestId), eq(fundRequest.status, 'PENDING'))
    );

  if (!request)
    throw new AppError(ERRORS.REQUEST_NOT_FOUND);

  await db
    .update(fundRequest)
    .set({
      status: 'REJECTED',
      approvedByUserId,
      remarks,
      updatedAt: new Date(),
    })
    .where(eq(fundRequest.id, requestId));

  return { success: true, message: 'Request rejected.' };
};

// ✅ MANUAL CREDIT

export const manualTopupUserWallet = async ({
  memberId,
  amount,
  userId,
  description,
}: {
  memberId: string;
  amount: number;
  userId: string;
  description?: string;
}) => {
  await ensureUserWalletExists(memberId);

  const [wallet] = await db
    .select()
    .from(userWallet)
    .where(eq(userWallet.userId, memberId));

  await db.transaction(async (tx) => {
    await tx
      .update(userWallet)
      .set({
        balance: (Number(wallet.balance) + amount).toFixed(2),
        updatedAt: new Date(),
      })
      .where(eq(userWallet.userId, memberId));

    await tx.insert(userWalletTransaction).values({
      userId: memberId,
      initiatedByUserId: userId,
      type: 'CREDIT',
      metaType: 'MANUAL_CREDIT',
      amount: amount.toFixed(2),
      description: description ?? 'Manual top-up by WL Admin',
      status: 'SUCCESS',
    });
  });

  return { success: true, message: 'User wallet credited.' };
};

// ✅ DEBIT WALLET

export const debitUserWallet = async ({
  memberId,
  amount,
  userId,
  description,
}: {
  memberId: string;
  amount: number;
  userId: string;
  description?: string;
}) => {
  const [wallet] = await db
    .select()
    .from(userWallet)
    .where(eq(userWallet.userId, memberId));

  if (!wallet || Number(wallet.balance) < amount) {
    throw new AppError(ERRORS.INSUFFICIENT_BALANCE);
  }

  await db.transaction(async (tx) => {
    await tx
      .update(userWallet)
      .set({
        balance: (Number(wallet.balance) - amount).toFixed(2),
        updatedAt: new Date(),
      })
      .where(eq(userWallet.userId, memberId));

    await tx.insert(userWalletTransaction).values({
      userId: memberId,
      initiatedByUserId: userId,
      type: 'DEBIT',
      metaType: 'MANUAL_DEBIT',
      amount: amount.toFixed(2),
      description: description ?? 'Manual debit by WL Admin',
      status: 'SUCCESS',
    });
  });

  return { success: true, message: 'Wallet debited.' };
};

// ✅ HOLD FUNDS

export const holdUserFunds = async ({
  memberId,
  amount,
  userId,
  description,
}: {
  memberId: string;
  amount: number;
  userId: string;
  description?: string;
}) => {
  const [wallet] = await db
    .select()
    .from(userWallet)
    .where(eq(userWallet, memberId));

  if (!wallet || Number(wallet.balance) < amount) {
    throw new AppError(ERRORS.INSUFFICIENT_BALANCE_HOLD);
  }

  await db.transaction(async (tx) => {
    await tx.update(userWallet).set({
      balance: (Number(wallet.balance) - amount).toFixed(2),
      heldAmount: (Number(wallet.heldAmount) + amount).toFixed(2),
      updatedAt: new Date(),
    }).where(eq(userWallet.userId, memberId));

    await tx.insert(userWalletTransaction).values({
      userId: memberId,
      initiatedByUserId: userId,
      type: 'HOLD',
      metaType: 'HOLD_FUNDS',
      amount: amount.toFixed(2),
      description: description ?? 'Amount held from balance',
      status: 'SUCCESS',
    });
  });

  return { success: true, message: 'Funds held and logged.' };
};


// ✅ RELEASE HELD FUNDS

export const releaseHeldFunds = async ({
  memberId,
  amount,
  userId,
  description,
}: {
  memberId: string;
  amount: number;
  userId: string;
  description?: string;
}) => {
  const [wallet] = await db
    .select()
    .from(userWallet)
    .where(eq(userWallet.userId, memberId));

  if (!wallet || Number(wallet.heldAmount) < amount) {
    throw new AppError(ERRORS.INSUFFICIENT_BALANCE_RELEASE);
  }

  await db.transaction(async (tx) => {
    await tx.update(userWallet).set({
      balance: (Number(wallet.balance) + amount).toFixed(2),
      heldAmount: (Number(wallet.heldAmount) - amount).toFixed(2),
      updatedAt: new Date(),
    }).where(eq(userWallet.userId, memberId));

    await tx.insert(userWalletTransaction).values({
      userId: memberId,
      initiatedByUserId: userId,
      type: 'UNHOLD',
      metaType: 'RELEASE_FUNDS',
      amount: amount.toFixed(2),
      description: description ?? 'Released held funds',
      status: 'SUCCESS',
    });
  });

  return { success: true, message: 'Held funds released and logged.' };
};
