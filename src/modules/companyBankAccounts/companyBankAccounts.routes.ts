// routes/companyBankAccounts.routes.ts
import { Router } from 'express';
import { CompanyBankAccountsController } from './companyBankAccounts.controller';
import { createCompanyBankAccountSchema, updateCompanyBankAccountSchema } from './companyBankAccounts.schema';
import { requireAuth } from '../../middlewares/requireAuth';
import { validate } from '../../middlewares/validate';

const router = Router();

router.use(requireAuth); // restrict to authenticated users (add role checks if needed)

// Public for tenants (view bank accounts)
router.get('/', CompanyBankAccountsController.getAll);
router.get('/:id', CompanyBankAccountsController.getById);

// Admin-only (manage bank accounts)
router.post('/', validate(createCompanyBankAccountSchema), CompanyBankAccountsController.create);
router.put('/:id', validate(updateCompanyBankAccountSchema), CompanyBankAccountsController.update);
router.delete('/:id', CompanyBankAccountsController.remove);

export default router;
