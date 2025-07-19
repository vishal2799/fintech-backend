import { Router } from 'express'
import authRoutes from '../modules/auth/auth.routes'
import servicesRoutes from '../modules/services/services.routes';
import tenantRoutes from '../modules/tenant/tenant.routes';
import sdRoutes from '../modules/super-distributor/super-distributor.routes';
import dRoutes from '../modules/distributors/distributors.routes';
import rRoutes from '../modules/retailers/retailers.routes';
import wladminRoutes from '../modules/wl-admin/wlAdmin.routes';
import logRoutes from '../modules/audit-logs/auditLogs.routes';
import { withAuditContext } from '../middlewares/auditContext';

const router = Router()

router.use('/auth', authRoutes)
router.use('/services', withAuditContext('SERVICE_MANAGEMENT', 'Service'), servicesRoutes)
router.use('/super-admin/wl-admin', withAuditContext('WLADMIN_MANAGEMENT', 'WL Admin'), wladminRoutes)
router.use('/admin/tenants', withAuditContext('TENANTS_MANAGEMENT', 'Tenant'), tenantRoutes)
router.use('/wl-admin/super-distributor', sdRoutes)
router.use('/wl-admin/distributors', dRoutes)
router.use('/wl-admin/retailers', rRoutes)
router.use('/logs', withAuditContext('AUDIT_LOGS', 'Audit Log'), logRoutes)

export default router
