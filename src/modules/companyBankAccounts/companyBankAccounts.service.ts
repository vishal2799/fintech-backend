import { eq, and } from 'drizzle-orm';
import { AppError } from '../../utils/AppError';
import { db } from '../../db';
import { companyBankAccounts } from '../../db/schema';
import { ERRORS } from '../../constants/errorCodes';


export const CompanyBankAccountService = {
  async create(data: any) {
    const [account] = await db.insert(companyBankAccounts)
      .values({...data, createdAt: new Date(), updatedAt: new Date()})
      .returning();
    return account;
  },

  async getAll(tenantId: string) {
    return await db.select()
      .from(companyBankAccounts)
      .where(eq(companyBankAccounts.tenantId, tenantId))
      .orderBy(companyBankAccounts.createdAt);
  },

  async getById(id: string, tenantId: string) {
    const [account] = await db.select()
      .from(companyBankAccounts)
      .where(
        and(
          eq(companyBankAccounts.id, id),
          eq(companyBankAccounts.tenantId, tenantId)
        )
      );
    if (!account) throw new AppError(ERRORS.BANK_ACCOUNT_NOT_FOUND);
    return account;
  },

  async update(id: string, data: any, tenantId: string) {
    const [account] = await db
      .update(companyBankAccounts)
      .set({...data, updatedAt: new Date()})
      .where(
        and(
          eq(companyBankAccounts.id, id),
          eq(companyBankAccounts.tenantId, tenantId)
        )
      )
      .returning();
    if (!account) throw new AppError(ERRORS.BANK_ACCOUNT_NOT_FOUND);
    return account;
  },

  async remove(id: string, tenantId: string) {
    const [account] = await db.delete(companyBankAccounts)
      .where(
        and(
          eq(companyBankAccounts.id, id),
          eq(companyBankAccounts.tenantId, tenantId)
        )
      )
      .returning();
    if (!account) throw new AppError(ERRORS.BANK_ACCOUNT_NOT_FOUND);
    return account;
  },
};


// export const CompanyBankAccountService = {
//   async create(data: any) {
//     const [account] = await db.insert(companyBankAccounts).values(data).returning();
//     return account;
//   },

//   async getAll() {
//     return await db.select().from(companyBankAccounts).orderBy(companyBankAccounts.createdAt);
//   },

//   async getById(id: string) {
//     const [account] = await db.select().from(companyBankAccounts).where(eq(companyBankAccounts.id, id));
//     if (!account) throw new AppError(ERRORS.BANK_ACCOUNT_NOT_FOUND);
//     return account;
//   },

//   async update(id: string, data: any) {
//     const [account] = await db
//       .update(companyBankAccounts)
//       .set({ ...data, updatedAt: new Date() })
//       .where(eq(companyBankAccounts.id, id))
//       .returning();

//           if (!account) throw new AppError(ERRORS.BANK_ACCOUNT_NOT_FOUND);
//     return account;
//   },

//   async remove(id: string) {
//     const [account] = await db.delete(companyBankAccounts).where(eq(companyBankAccounts.id, id)).returning();
//         if (!account) throw new AppError(ERRORS.BANK_ACCOUNT_NOT_FOUND);
//     return account;
//   },
// };
