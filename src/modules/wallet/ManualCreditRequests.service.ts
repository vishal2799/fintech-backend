import { eq, and, desc } from 'drizzle-orm';
import { db } from '../../db';
import { manualCreditRequest, creditRequest, tenants, users, companyBankAccounts, tenantWallet, tenantWalletTransaction } from '../../db/schema';
import { AppError } from '../../utils/AppError';
import { ERRORS } from '../../constants/errorCodes';
import { ensureTenantWalletExists, approveCreditRequest } from './wallet.service';

export const createManualCreditRequest = async ({
  tenantId,
  requestedByUserId,
  amount,
  bankAccountId,
  utrNumber,
  paymentDate,
  proofUrl,
  remarks,
}: {
  tenantId: string;
  requestedByUserId: string;
  amount: number;
  bankAccountId: string;
  utrNumber: string;
  paymentDate: Date;
  proofUrl: string;
  remarks?: string;
}) => {
  await ensureTenantWalletExists(tenantId);

  // Create parent credit request (status: PENDING)
  const [newCreditReq] = await db
    .insert(creditRequest)
    .values({
      fromTenantId: tenantId,
      amount: amount.toString(),
      requestedByUserId,
      status: 'PENDING',
      method: 'MANUAL_BANK'
    })
    .returning({ id: creditRequest.id });

  if (!newCreditReq?.id) throw new AppError(ERRORS.CREDIT_REQUEST_NOT_FOUND);

  // Create manual credit request details linked to parent credit request
  await db.insert(manualCreditRequest).values({
    creditRequestId: newCreditReq.id,
    bankAccountId,
    utrNumber,
    paymentDate,
    proofUrl,
    remarks,
  });

  return { success: true, message: 'Manual credit request submitted.' };
};

export const getAllManualCreditRequests = async () => {
  return await db
    .select({
      id: manualCreditRequest.id,
      creditRequestId: manualCreditRequest.creditRequestId,
      amount: creditRequest.amount,
      status: creditRequest.status,
      requestedByUserId: creditRequest.requestedByUserId,
      tenantId: creditRequest.fromTenantId,
      tenantName: tenants.name,
      requestedByUserName: users.name,
      bankAccountId: manualCreditRequest.bankAccountId,
      bankAccountName: companyBankAccounts.accountHolderName,
      utrNumber: manualCreditRequest.utrNumber,
      paymentDate: manualCreditRequest.paymentDate,
      proofUrl: manualCreditRequest.proofUrl,
      remarks: manualCreditRequest.remarks,
      createdAt: manualCreditRequest.createdAt,
      updatedAt: manualCreditRequest.updatedAt,
    })
    .from(manualCreditRequest)
    .leftJoin(creditRequest, eq(manualCreditRequest.creditRequestId, creditRequest.id))
    .leftJoin(tenants, eq(creditRequest.fromTenantId, tenants.id))
    .leftJoin(users, eq(creditRequest.requestedByUserId, users.id))
    .leftJoin(companyBankAccounts, eq(manualCreditRequest.bankAccountId, companyBankAccounts.id))
    .orderBy(desc(manualCreditRequest.createdAt));
};

export const approveManualCreditRequest = async ({
  manualRequestId,
  approvedByUserId,
}: {
  manualRequestId: string;
  approvedByUserId: string;
}) => {
  const [manualReq] = await db
    .select()
    .from(manualCreditRequest)
    .where(eq(manualCreditRequest.id, manualRequestId));

  if (!manualReq) throw new AppError(ERRORS.REQUEST_NOT_FOUND);

  // Get parent credit request
  const [parentRequest] = await db
    .select()
    .from(creditRequest)
    .where(
      and(
        eq(creditRequest.id, manualReq.creditRequestId),
        eq(creditRequest.status, 'PENDING')
      )
    );

  if (!parentRequest) throw new AppError(ERRORS.REQUEST_NOT_FOUND);

    const [wallet] = await db
      .select()
      .from(tenantWallet)
      .where(eq(tenantWallet.tenantId, parentRequest.fromTenantId));
  
    await db.transaction(async (tx) => {
      await tx
        .update(tenantWallet)
        .set({
          balance: (Number(wallet.balance) + Number(parentRequest.amount)).toFixed(2),
          updatedAt: new Date(),
        })
        .where(eq(tenantWallet.tenantId, parentRequest.fromTenantId));
  
      await tx
        .update(creditRequest)
        .set({
          status: 'APPROVED',
          approvedByUserId,
          updatedAt: new Date(),
        })
        .where(eq(creditRequest.id, parentRequest.id));
  
      await tx.insert(tenantWalletTransaction).values({
        tenantId: parentRequest.fromTenantId,
        type: 'CREDIT',
        metaType: 'FUND_TOPUP',
        amount: parentRequest.amount,
        referenceUserId: parentRequest.requestedByUserId,
        relatedUserId: approvedByUserId,
        description: 'Approved credit request by Super Admin',
        status: 'SUCCESS',
      });
    });

  // Approve parent credit request and fund wallet (reuse existing logic)
//   await approveCreditRequest({
//     requestId: parentRequest.id,
//     approvedByUserId,
//   });

//   // Update manual request remarks/status if needed (optional)
//   await db
//     .update(manualCreditRequest)
//     .set({ updatedAt: new Date() })
//     .where(eq(manualCreditRequest.id, manualRequestId));

  return { success: true, message: 'Manual credit request approved and wallet funded.' };
};

export const rejectManualCreditRequest = async ({
  manualRequestId,
  approvedByUserId,
  remarks,
}: {
  manualRequestId: string;
  approvedByUserId: string;
  remarks?: string;
}) => {
  const [manualReq] = await db
    .select()
    .from(manualCreditRequest)
    .where(eq(manualCreditRequest.id, manualRequestId));

  if (!manualReq) throw new AppError(ERRORS.REQUEST_NOT_FOUND);

  // Reject parent credit request
  await db
    .update(creditRequest)
    .set({
      status: 'REJECTED',
      approvedByUserId,
      remarks,
      updatedAt: new Date(),
    })
    .where(eq(creditRequest.id, manualReq.creditRequestId));

  // Optionally update manual request remarks/status
  await db
    .update(manualCreditRequest)
    .set({
      remarks,
      updatedAt: new Date(),
    })
    .where(eq(manualCreditRequest.id, manualRequestId));

  return { success: true, message: 'Manual credit request rejected.' };
};
