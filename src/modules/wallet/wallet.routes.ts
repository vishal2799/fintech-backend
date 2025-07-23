import { Router } from "express";
import * as WalletController from "./wallet.controller";
import { requireAuth } from "../../middlewares/requireAuth";

const router = Router();

// Super Admin
router.post('/create', requireAuth, WalletController.createTenantWallet);
router.get('/credit-requests', requireAuth, WalletController.getAllCreditRequests);
router.post('/credit-requests/:id/approve', requireAuth, WalletController.approveCreditRequest);
router.post('/credit-requests/:id/reject', requireAuth, WalletController.rejectCreditRequest);
router.post('/topup', requireAuth, WalletController.manualTopupTenantWallet);


// WL Admin
router.get('/balance', requireAuth, WalletController.getWalletBalance);
router.get('/ledger', requireAuth, WalletController.getWalletLedger);
router.post('/credit-request', requireAuth, WalletController.requestCredit);

export default router;
