import { Router } from 'express'
import authRoutes from '../modules/auth/auth.routes'
import rolesRoutes from '../modules/roles/roles.routes'
import permissionRoutes from '../modules/permissions/permissions.routes';
import employeesRoutes from '../modules/employees/employees.routes';
import servicesRoutes from '../modules/services/services.routes';
import tenantServicesRoutes from '../modules/services/tenantServiceConfig.routes';
import wlServicesRoutes from '../modules/services/wlService.routes';
import tenantRoutes from '../modules/tenant/tenant.routes';
import sdRoutes from '../modules/super-distributor/super-distributor.routes';
import dRoutes from '../modules/distributors/distributors.routes';
import rRoutes from '../modules/retailers/retailers.routes';
import walletRoutes from '../modules/wallet/wallet.routes';
import wladminRoutes from '../modules/wl-admin/wlAdmin.routes';
import logRoutes from '../modules/audit-logs/auditLogs.routes';
import soRoutes from '../modules/service-operators/serviceOperator.routes';
import bankRoutes from '../modules/companyBankAccounts/companyBankAccounts.routes';
import { withAuditContext } from '../middlewares/auditContext';
import userWalletRoutes from '../modules/user-wallet/user-wallet.routes';
import serviceActionsRoutes from '../modules/serviceActions/serviceActions.routes';

const router = Router()

router.use('/auth', authRoutes)
router.use('/service-operators', soRoutes)
router.use('/permissions', permissionRoutes)
router.use('/roles', rolesRoutes)
router.use('/banks', bankRoutes)
router.use('/employees', employeesRoutes)
router.use('/services', servicesRoutes)
router.use('/tenant-services', tenantServicesRoutes)
router.use("/user-wallet", userWalletRoutes);
router.use("/wallet", walletRoutes);
router.use('/wl-services', wlServicesRoutes)
router.use('/super-admin/wl-admin', withAuditContext('WLADMIN_MANAGEMENT', 'WL Admin'), wladminRoutes)
router.use('/admin/tenants', withAuditContext('TENANTS_MANAGEMENT', 'Tenant'), tenantRoutes)
router.use('/wl-admin/super-distributor', sdRoutes)
router.use('/wl-admin/distributors', dRoutes)
router.use('/wl-admin/retailers', rRoutes)
router.use('/service-actions', serviceActionsRoutes);
router.use('/logs', withAuditContext('AUDIT_LOGS', 'Audit Log'), logRoutes)

export default router
