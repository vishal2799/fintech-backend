import express from 'express';
import * as AuditController from './auditLogs.controller';
import { requireAuth } from '../../middlewares/requireAuth';

const router = express.Router();

// Super Admin & WL Admin logs
router.get('/', requireAuth, AuditController.listLogs);

export default router;
