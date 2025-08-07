import express from 'express'
import * as serviceController from './services.controller'
import { validate } from '../../middlewares/validate'
import { createServiceSchema, updateServiceSchema } from './services.schema'
import { requireAuth } from '../../middlewares/requireAuth'
import { roleCheck } from '../../middlewares/roleCheck'
import { checkPermission } from '../../middlewares/permissions'
import { Roles } from '../../constants/roles'
import { PERMISSIONS } from '../../constants/permissions'


const router = express.Router()

// White-label admin (tenant) routes
// router.get('/tenant', serviceController.listTenantServices);
// router.patch('/tenant/:id', serviceController.updateTenantService);

// router.get('/', requireAuth, roleCheck([Roles.SUPER_ADMIN]), checkPermission(PERMISSIONS.SERVICES_READ), serviceController.getAll)
router.use(requireAuth);

router.get('/', roleCheck([Roles.SUPER_ADMIN, Roles.EMPLOYEE]), serviceController.getAll)

router.post(
  '/',
  // validate(createServiceSchema),
  serviceController.create
)

router.get('/:id', serviceController.getById)

router.put(
  '/:id',
  // validate(updateServiceSchema),
  serviceController.update
)

router.delete('/:id', serviceController.remove)


export default router
