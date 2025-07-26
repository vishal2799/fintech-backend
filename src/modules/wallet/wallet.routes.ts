import { Router } from 'express';
import * as Controller from './wallet.controller';
import { Roles } from '../../constants/roles';
import { PERMISSIONS } from '../../constants/permissions';
import { AUDIT_MODULES, AUDIT_ACTIONS } from '../../constants/audit.constants';
import { requireAuth } from '../../middlewares/requireAuth';
import { roleCheck } from '../../middlewares/roleCheck';
import { checkPermission } from '../../middlewares/permissions';
import { validate } from '../../middlewares/validate';
import { withAuditContext } from '../../middlewares/auditContext';

import {
  manualTopupSchema,
  approveRejectSchema,
  debitWalletSchema,
  holdWalletSchema,
  releaseWalletSchema,
  requestCreditSchema,
} from './wallet.schema';

const router = Router();

router.use(requireAuth);

// ------------------- WL Admin Routes -------------------

router.get(
  '/admin/balance',
  roleCheck([Roles.WL_ADMIN, Roles.EMPLOYEE]),
  checkPermission(PERMISSIONS.WALLET_VIEW, [Roles.WL_ADMIN]),
  withAuditContext(AUDIT_MODULES.WALLET, AUDIT_ACTIONS.WALLET_VIEW_BALANCE),
  Controller.getWalletBalance
);

router.get(
  '/admin/ledger',
  roleCheck([Roles.WL_ADMIN, Roles.EMPLOYEE]),
  checkPermission(PERMISSIONS.WALLET_VIEW, [Roles.WL_ADMIN]),
  withAuditContext(AUDIT_MODULES.WALLET, AUDIT_ACTIONS.WALLET_VIEW_LEDGER),
  Controller.getWalletLedger
);

router.get(
  '/admin/credit-requests',
  roleCheck([Roles.WL_ADMIN, Roles.EMPLOYEE]),
  checkPermission(PERMISSIONS.WALLET_REQUEST_CREDIT, [Roles.WL_ADMIN]),
  withAuditContext(AUDIT_MODULES.WALLET, AUDIT_ACTIONS.WALLET_CREDIT_REQUEST),
  Controller.getMyCreditRequests
);

router.post(
  '/admin/request-credit',
  roleCheck([Roles.WL_ADMIN, Roles.EMPLOYEE]),
  checkPermission(PERMISSIONS.WALLET_REQUEST_CREDIT, [Roles.WL_ADMIN]),
  validate(requestCreditSchema),
  withAuditContext(AUDIT_MODULES.WALLET, AUDIT_ACTIONS.WALLET_CREDIT_REQUEST),
  Controller.requestCredit
);

// ------------------- Super Admin Routes -------------------

router.use(roleCheck([Roles.SUPER_ADMIN, Roles.EMPLOYEE]));

// Create wallet manually
router.post(
  '/super-admin/create',
  checkPermission(PERMISSIONS.WALLET_CREATE, [Roles.SUPER_ADMIN]),
  withAuditContext(AUDIT_MODULES.WALLET, AUDIT_ACTIONS.WALLET_CREATE),
  Controller.createTenantWallet
);

router.get(
  '/super-admin/tenant-wallets',
  checkPermission(PERMISSIONS.WALLET_VIEW, [Roles.SUPER_ADMIN]),
  withAuditContext(AUDIT_MODULES.WALLET, AUDIT_ACTIONS.WALLET_VIEW),
  Controller.listTenantWallets
);

// View credit requests
router.get(
  '/super-admin/credit-requests',
  checkPermission(PERMISSIONS.WALLET_VIEW, [Roles.SUPER_ADMIN]),
  withAuditContext(AUDIT_MODULES.WALLET, AUDIT_ACTIONS.WALLET_VIEW_REQUESTS),
  Controller.getAllCreditRequests
);

// Approve credit
router.post(
  '/super-admin/approve/:id',
  checkPermission(PERMISSIONS.WALLET_APPROVE_CREDIT, [Roles.SUPER_ADMIN]),
  // validate(approveRejectSchema),
  withAuditContext(AUDIT_MODULES.WALLET, AUDIT_ACTIONS.WALLET_CREDIT_APPROVE),
  Controller.approveCreditRequest
);

// Reject credit
router.post(
  '/super-admin/reject/:id',
  checkPermission(PERMISSIONS.WALLET_APPROVE_CREDIT, [Roles.SUPER_ADMIN]),
  // validate(approveRejectSchema),
  withAuditContext(AUDIT_MODULES.WALLET, AUDIT_ACTIONS.WALLET_CREDIT_REJECT),
  Controller.rejectCreditRequest
);

// Manual top-up
router.post(
  '/super-admin/credit',
  checkPermission(PERMISSIONS.WALLET_MANUAL_TOPUP, [Roles.SUPER_ADMIN]),
  validate(manualTopupSchema),
  withAuditContext(AUDIT_MODULES.WALLET, AUDIT_ACTIONS.WALLET_TOPUP),
  Controller.manualTopupTenantWallet
);

// Debit
router.post(
  '/super-admin/debit',
  checkPermission(PERMISSIONS.WALLET_DEBIT, [Roles.SUPER_ADMIN]),
  validate(debitWalletSchema),
  withAuditContext(AUDIT_MODULES.WALLET, AUDIT_ACTIONS.WALLET_DEBIT),
  Controller.debitTenantWallet
);

// Hold
router.post(
  '/super-admin/hold',
  checkPermission(PERMISSIONS.WALLET_HOLD, [Roles.SUPER_ADMIN]),
  validate(holdWalletSchema),
  withAuditContext(AUDIT_MODULES.WALLET, AUDIT_ACTIONS.WALLET_HOLD),
  Controller.holdTenantWalletAmount
);

// Release
router.post(
  '/super-admin/release',
  checkPermission(PERMISSIONS.WALLET_RELEASE, [Roles.SUPER_ADMIN]),
  validate(releaseWalletSchema),
  withAuditContext(AUDIT_MODULES.WALLET, AUDIT_ACTIONS.WALLET_RELEASE),
  Controller.releaseTenantWalletHold
);

export default router;



// import { Router } from "express";
// import * as WalletController from "./wallet.controller";
// import { requireAuth } from "../../middlewares/requireAuth";

// const router = Router();

// // Super Admin
// router.post('/create', requireAuth, WalletController.createTenantWallet);
// router.get('/credit-requests', requireAuth, WalletController.getAllCreditRequests);
// router.post('/credit-requests/:id/approve', requireAuth, WalletController.approveCreditRequest);
// router.post('/credit-requests/:id/reject', requireAuth, WalletController.rejectCreditRequest);
// router.post('/topup', requireAuth, WalletController.manualTopupTenantWallet);


// // WL Admin
// router.get('/balance', requireAuth, WalletController.getWalletBalance);
// router.get('/ledger', requireAuth, WalletController.getWalletLedger);
// router.post('/credit-request', requireAuth, WalletController.requestCredit);

// export default router;
