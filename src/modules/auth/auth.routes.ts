import { Router } from 'express';
import * as AuthController from './auth.controller';
import { validate } from '../../middlewares/validate';
import { requireAuth } from '../../middlewares/requireAuth';
import { withAuditContext } from '../../middlewares/auditContext';
import {
  loginSchema,
  refreshSchema,
  logoutSchema,
  verifyOtpSchema,
  requestPasswordResetSchema,
  verifyResetOtpSchema,
  resetPasswordSchema,
} from './auth.schema';
import { AUDIT_ACTIONS, AUDIT_MODULES } from '../../constants/audit.constants';

const router = Router();

// Public routes
router.post(
  '/login',
  withAuditContext(AUDIT_MODULES.AUTH, AUDIT_ACTIONS.LOGIN),
  validate(loginSchema),
  AuthController.login
);

router.post(
  '/verify-otp',  
  withAuditContext(AUDIT_MODULES.AUTH, AUDIT_ACTIONS.LOGIN),
  validate(verifyOtpSchema), 
  AuthController.verifyOtpLogin
);


router.post(
  '/refresh',
  validate(refreshSchema),
  AuthController.refresh
);

// Protected route (optional)
router.post(
  '/logout',
  requireAuth,
  withAuditContext(AUDIT_MODULES.AUTH, AUDIT_ACTIONS.LOGOUT),
  validate(logoutSchema),
  AuthController.logout
);

router.post(
  '/request-password-reset',
  validate(requestPasswordResetSchema),
  AuthController.requestPasswordReset
)

router.post(
  "/verify-reset-otp",
  validate(verifyResetOtpSchema),
  AuthController.verifyResetOtp
);

router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  AuthController.resetPassword
);
export default router;
