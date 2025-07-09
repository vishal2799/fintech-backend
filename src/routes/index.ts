import { Router } from 'express'
import authRoutes from '../modules/auth/auth.routes'
import servicesRoutes from '../modules/services/services.routes';
import tenantRoutes from '../modules/tenant/tenant.routes';
import usersRoutes from '../modules/users/users.routes';

const router = Router()

router.use('/auth', authRoutes)
router.use('/services', servicesRoutes)
router.use('/admin/tenants', tenantRoutes)
router.use('/admin/users', usersRoutes)

export default router
