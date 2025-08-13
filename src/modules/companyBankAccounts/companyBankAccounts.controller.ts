// controllers/companyBankAccounts.controller.ts
import { RESPONSE } from '../../constants/responseMessages';
import { asyncHandler } from '../../utils/asyncHandler';
import { successHandler } from '../../utils/responseHandler';
import { CompanyBankAccountService } from './companyBankAccounts.service';

export const CompanyBankAccountsController = {
  create: asyncHandler(async (req, res) => {
    const account = await CompanyBankAccountService.create((req as any).validated);
    return successHandler(res, {data: account, ...RESPONSE.BANK_ACCOUNT.CREATED});
  }),

  getAll: asyncHandler(async (req, res) => {
    const accounts = await CompanyBankAccountService.getAll();
    return successHandler(res, {data: accounts});
  }),

  getById: asyncHandler(async (req, res) => {
    const account = await CompanyBankAccountService.getById(req.params.id);
    return successHandler(res, {data: account});
  }),

  update: asyncHandler(async (req, res) => {
    const account = await CompanyBankAccountService.update(req.params.id, (req as any).validated);
    return successHandler(res, {data: account, ...RESPONSE.BANK_ACCOUNT.UPDATED});
  }),

  remove: asyncHandler(async (req, res) => {
    await CompanyBankAccountService.remove(req.params.id);
    return successHandler(res, {data: null, ...RESPONSE.BANK_ACCOUNT.DELETED});
  }),
};
