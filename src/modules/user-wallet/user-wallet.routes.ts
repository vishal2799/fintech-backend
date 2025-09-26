import { Router } from 'express';
import * as Controller from './user-wallet.controller';
import { Roles } from '../../constants/roles';
import { PERMISSIONS } from '../../constants/permissions';
import { AUDIT_MODULES, AUDIT_ACTIONS } from '../../constants/audit.constants';
import { requireAuth } from '../../middlewares/requireAuth';
import { roleCheck } from '../../middlewares/roleCheck';
import { checkPermission } from '../../middlewares/permissions';
import { validate } from '../../middlewares/validate';
import { withAuditContext } from '../../middlewares/auditContext';
import { requestCreditSchema, updateProofSchema, uploadProofSchema } from './user-wallet.schema';

const router = Router();

router.use(requireAuth);

router.post("/proof/upload-url", validate(uploadProofSchema), Controller.getProofUploadUrl);
router.post("/proof/update", validate(updateProofSchema), Controller.updateProofKey);
router.get("/proof/:creditRequestId", Controller.getProofUrl);

// ------------------- User Routes -------------------

router.get(
  '/admin/balance',
//   roleCheck([Roles.WL_ADMIN, Roles.EMPLOYEE]),
//   checkPermission(PERMISSIONS.WALLET_VIEW, [Roles.WL_ADMIN]),
  withAuditContext(AUDIT_MODULES.WALLET, AUDIT_ACTIONS.WALLET_VIEW_BALANCE),
  Controller.getWalletBalance
);

router.get(
  '/admin/ledger',
//   roleCheck([Roles.WL_ADMIN, Roles.EMPLOYEE]),
//   checkPermission(PERMISSIONS.WALLET_VIEW, [Roles.WL_ADMIN]),
  withAuditContext(AUDIT_MODULES.WALLET, AUDIT_ACTIONS.WALLET_VIEW_LEDGER),
  Controller.getWalletLedger
);

router.get(
  '/admin/credit-requests',
//   roleCheck([Roles.WL_ADMIN, Roles.EMPLOYEE, Roles.SUPER_ADMIN]),
//   checkPermission(PERMISSIONS.WALLET_REQUEST_CREDIT, [Roles.WL_ADMIN, Roles.SUPER_ADMIN]),
  withAuditContext(AUDIT_MODULES.WALLET, AUDIT_ACTIONS.WALLET_CREDIT_REQUEST),
  Controller.getMyCreditRequests
);

router.post(
  '/admin/request-credit',
//   roleCheck([Roles.WL_ADMIN, Roles.EMPLOYEE]),
//   checkPermission(PERMISSIONS.WALLET_REQUEST_CREDIT, [Roles.WL_ADMIN]),
  validate(requestCreditSchema),
  withAuditContext(AUDIT_MODULES.WALLET, AUDIT_ACTIONS.WALLET_CREDIT_REQUEST),
  Controller.requestCredit
);

export default router;
