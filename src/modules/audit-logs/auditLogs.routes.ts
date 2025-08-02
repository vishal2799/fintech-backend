import express from 'express';
import * as AuditController from './auditLogs.controller';
import { requireAuth } from '../../middlewares/requireAuth';
import { validate } from '../../middlewares/validate';
import { getAuditLogsSchema } from './auditLog.schema';

const router = express.Router();

// Super Admin & WL Admin logs
// router.get('/', requireAuth, AuditController.listLogs);
router.get('/', requireAuth, AuditController.getAuditLogs)

export default router;
