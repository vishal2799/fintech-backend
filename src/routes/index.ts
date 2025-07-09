import { Router } from 'express'
import authRoutes from '../modules/auth/auth.routes'
import servicesRoutes from '../modules/services/services.routes';

const router = Router()

router.use('/auth', authRoutes)
router.use('/services', servicesRoutes)

export default router
