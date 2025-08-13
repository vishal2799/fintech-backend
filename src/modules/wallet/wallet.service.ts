import { desc, eq, and, ne } from 'drizzle-orm';
import { db } from '../../db';
import {
  creditRequest,
  tenants,
  tenantWallet,
  tenantWalletTransaction,
  users,
} from '../../db/schema';
import { AppError } from '../../utils/AppError';
import { ERRORS } from '../../constants/errorCodes';

export const ensureTenantWalletExists = async (tenantId: string) => {
  const [wallet] = await db
    .select()
    .from(tenantWallet)
    .where(eq(tenantWallet.tenantId, tenantId));

  if (!wallet) {
    await db.insert(tenantWallet).values({
      tenantId,
      balance: (0).toString(),
      heldAmount: (0).toString(),
    });
  }
};

export const getTenantWalletBalance = async (tenantId: string) => {
  const [wallet] = await db
    .select()
    .from(tenantWallet)
    .where(eq(tenantWallet.tenantId, tenantId));
  return wallet ?? { balance: 0, heldAmount: 0 };
};

export const getTenantWalletLedger = async (tenantId: string) => {
  return await db
    .select()
    .from(tenantWalletTransaction)
    .where(eq(tenantWalletTransaction.tenantId, tenantId))
    .orderBy(desc(tenantWalletTransaction.createdAt));
};

// ✅ CREDIT REQUESTS

export const requestCredit = async ({
  tenantId,
  amount,
  requestedByUserId,
  remarks,
}: {
  tenantId: string;
  amount: number;
  requestedByUserId: string;
  remarks?: string;
}) => {
  await ensureTenantWalletExists(tenantId);

  await db.insert(creditRequest).values({
    fromTenantId: tenantId,
    amount: amount.toString(),
    requestedByUserId,
    remarks,
    status: 'PENDING',
  });

  return { success: true, message: 'Credit request submitted.' };
};

export const getAllCreditRequests = async () => {
  return await db
    .select({
      id: creditRequest.id,
      amount: creditRequest.amount,
      remarks: creditRequest.remarks,
      status: creditRequest.status,
      createdAt: creditRequest.createdAt,
      updatedAt: creditRequest.updatedAt,

      fromTenantId: creditRequest.fromTenantId,
      requestedByUserId: creditRequest.requestedByUserId,
      approvedByUserId: creditRequest.approvedByUserId,

      tenantName: tenants.name,
      requestedByUserName: users.name,
    })
    .from(creditRequest)
    .where(ne(creditRequest.status, 'PENDING'))
    .leftJoin(tenants, eq(creditRequest.fromTenantId, tenants.id))
    .leftJoin(users, eq(creditRequest.requestedByUserId, users.id))
    .orderBy(desc(creditRequest.createdAt));
};

export const getPendingCreditRequests = async () => {
  return await db
    .select({
      id: creditRequest.id,
      amount: creditRequest.amount,
      remarks: creditRequest.remarks,
      status: creditRequest.status,
      createdAt: creditRequest.createdAt,
      updatedAt: creditRequest.updatedAt,

      fromTenantId: creditRequest.fromTenantId,
      requestedByUserId: creditRequest.requestedByUserId,
      approvedByUserId: creditRequest.approvedByUserId,

      tenantName: tenants.name,
      requestedByUserName: users.name,
    })
    .from(creditRequest)
    .where(eq(creditRequest.status, 'PENDING'))
    .leftJoin(tenants, eq(creditRequest.fromTenantId, tenants.id))
    .leftJoin(users, eq(creditRequest.requestedByUserId, users.id))
    .orderBy(desc(creditRequest.createdAt));
};

// export const getAllCreditRequests = async () => {
//   return await db
//     .select()
//     .from(creditRequest)
//     .orderBy(desc(creditRequest.createdAt));
// };

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
    .where(
      and(eq(creditRequest.id, requestId), eq(creditRequest.status, 'PENDING'))
    );

  if (!request)
    throw new AppError(ERRORS.REQUEST_NOT_FOUND);

  await ensureTenantWalletExists(request.fromTenantId);

  const [wallet] = await db
    .select()
    .from(tenantWallet)
    .where(eq(tenantWallet.tenantId, request.fromTenantId));

  await db.transaction(async (tx) => {
    await tx
      .update(tenantWallet)
      .set({
        balance: (Number(wallet.balance) + Number(request.amount)).toFixed(2),
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
    .where(
      and(eq(creditRequest.id, requestId), eq(creditRequest.status, 'PENDING'))
    );

  if (!request)
    throw new AppError(ERRORS.REQUEST_NOT_FOUND);

  await db
    .update(creditRequest)
    .set({
      status: 'REJECTED',
      approvedByUserId,
      remarks,
      updatedAt: new Date(),
    })
    .where(eq(creditRequest.id, requestId));

  return { success: true, message: 'Request rejected.' };
};

// ✅ MANUAL CREDIT

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

  const [wallet] = await db
    .select()
    .from(tenantWallet)
    .where(eq(tenantWallet.tenantId, tenantId));

  await db.transaction(async (tx) => {
    await tx
      .update(tenantWallet)
      .set({
        balance: (Number(wallet.balance) + amount).toFixed(2),
        updatedAt: new Date(),
      })
      .where(eq(tenantWallet.tenantId, tenantId));

    await tx.insert(tenantWalletTransaction).values({
      tenantId,
      type: 'CREDIT',
      metaType: 'FUND_TOPUP',
      amount: amount.toFixed(2),
      referenceUserId: userId,
      description: description ?? 'Manual top-up by Super Admin',
      status: 'SUCCESS',
    });
  });

  return { success: true, message: 'Tenant wallet credited.' };
};

// ✅ DEBIT WALLET

export const debitTenantWallet = async ({
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
  const [wallet] = await db
    .select()
    .from(tenantWallet)
    .where(eq(tenantWallet.tenantId, tenantId));

  if (!wallet || Number(wallet.balance) < amount) {
    throw new AppError(ERRORS.INSUFFICIENT_BALANCE);
  }

  await db.transaction(async (tx) => {
    await tx
      .update(tenantWallet)
      .set({
        balance: (Number(wallet.balance) - amount).toFixed(2),
        updatedAt: new Date(),
      })
      .where(eq(tenantWallet.tenantId, tenantId));

    await tx.insert(tenantWalletTransaction).values({
      tenantId,
      type: 'DEBIT',
      metaType: 'MANUAL_DEBIT',
      amount: amount.toFixed(2),
      referenceUserId: userId,
      description: description ?? 'Manual debit by Super Admin',
      status: 'SUCCESS',
    });
  });

  return { success: true, message: 'Wallet debited.' };
};

// ✅ HOLD FUNDS

export const holdTenantFunds = async ({
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
  const [wallet] = await db
    .select()
    .from(tenantWallet)
    .where(eq(tenantWallet.tenantId, tenantId));

  if (!wallet || Number(wallet.balance) < amount) {
    throw new AppError(ERRORS.INSUFFICIENT_BALANCE_HOLD);
  }

  await db.transaction(async (tx) => {
    await tx.update(tenantWallet).set({
      balance: (Number(wallet.balance) - amount).toFixed(2),
      heldAmount: (Number(wallet.heldAmount) + amount).toFixed(2),
      updatedAt: new Date(),
    }).where(eq(tenantWallet.tenantId, tenantId));

    await tx.insert(tenantWalletTransaction).values({
      tenantId,
      type: 'HOLD',
      metaType: 'HOLD_FUNDS',
      amount: amount.toFixed(2),
      referenceUserId: userId,
      description: description ?? 'Amount held from balance',
      status: 'SUCCESS',
    });
  });

  return { success: true, message: 'Funds held and logged.' };
};


// ✅ RELEASE HELD FUNDS

export const releaseHeldFunds = async ({
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
  const [wallet] = await db
    .select()
    .from(tenantWallet)
    .where(eq(tenantWallet.tenantId, tenantId));

  if (!wallet || Number(wallet.heldAmount) < amount) {
    throw new AppError(ERRORS.INSUFFICIENT_BALANCE_RELEASE);
  }

  await db.transaction(async (tx) => {
    await tx.update(tenantWallet).set({
      balance: (Number(wallet.balance) + amount).toFixed(2),
      heldAmount: (Number(wallet.heldAmount) - amount).toFixed(2),
      updatedAt: new Date(),
    }).where(eq(tenantWallet.tenantId, tenantId));

    await tx.insert(tenantWalletTransaction).values({
      tenantId,
      type: 'UNHOLD',
      metaType: 'RELEASE_FUNDS',
      amount: amount.toFixed(2),
      referenceUserId: userId,
      description: description ?? 'Released held funds',
      status: 'SUCCESS',
    });
  });

  return { success: true, message: 'Held funds released and logged.' };
};


export const getCreditRequestsByTenant = async (tenantId: string) => {
  return await db
    .select()
    .from(creditRequest)
    .where(eq(creditRequest.fromTenantId, tenantId))
    .orderBy(desc(creditRequest.createdAt));
};

export const getAllTenantWallets = async () => {
  const rows = await db
    .select({
      tenantId: tenants.id,
      tenantName: tenants.name,
      balance: tenantWallet.balance,
      heldAmount: tenantWallet.heldAmount,
    })
    .from(tenants)
    .leftJoin(tenantWallet, eq(tenantWallet.tenantId, tenants.id));

  return rows.map((row) => ({
    tenantId: row.tenantId,
    tenantName: row.tenantName,
    balance: row.balance ?? '0',
    heldAmount: row.heldAmount ?? '0',
  }));
};

