import express from 'express'
import * as serviceController from './services.controller'
import { validate } from '../../middlewares/validate'
import { createServiceSchema, updateServiceSchema } from './services.schema'
import { requireAuth } from '../../middlewares/requireAuth'
import { roleCheck } from '../../middlewares/roleCheck'
import { checkPermission } from '../../middlewares/permissions'
import { Roles } from '../../constants/roles'
import { PERMISSIONS } from '../../constants/permissions'
// import { createServiceSchema, updateServiceSchema } from '@/modules/service/service.schema'
// import { checkPermission } from '@/middlewares/checkPermission'

const router = express.Router()

router.get('/', requireAuth, roleCheck([Roles.SUPER_ADMIN]), checkPermission(PERMISSIONS.SERVICES_READ), serviceController.getAll)

router.post(
  '/',
  validate(createServiceSchema),
  serviceController.create
)

router.get('/:id', serviceController.getById)

router.put(
  '/:id',
  validate(updateServiceSchema),
  serviceController.update
)

router.delete('/:id', serviceController.remove)

// Super Admin routes
router.get('/admin/services', serviceController.listServicesGlobal);
router.patch('/admin/services/:id', serviceController.updateGlobalService);

// White-label admin (tenant) routes
router.get('/admin/tenant/services', serviceController.listTenantServices);
router.patch('/admin/tenant/services/:id', serviceController.updateTenantService);

// SD/D/R user-specific routes (by WL admin)
router.get('/admin/users/:userId/services', serviceController.listUserServices);
router.patch('/admin/users/:userId/services/:serviceId', serviceController.updateUserService);

// Retailer self-view
router.get('/me/services', serviceController.listMyServices);

// router.get('/', checkPermission('service', 'read'), serviceController.getAllServices)

// router.post(
//   '/',
//   checkPermission('service', 'create'),
//   validateRequest(createServiceSchema),
//   serviceController.createService
// )

// router.put(
//   '/:id',
//   checkPermission('service', 'update'),
//   validateRequest(updateServiceSchema),
//   serviceController.updateService
// )

// router.delete('/:id', checkPermission('service', 'delete'), serviceController.deleteService)

// // Super Admin routes
// router.get('/admin/services', requireAuth, checkPermission('services:read'), ServiceController.listServicesGlobal);
// router.patch('/admin/services/:id', requireAuth, checkPermission('services:update'), ServiceController.updateGlobalService);

// // White-label admin (tenant) routes
// router.get('/admin/tenant/services', requireAuth, checkPermission('services:read'), ServiceController.listTenantServices);
// router.patch('/admin/tenant/services/:id', requireAuth, checkPermission('services:update'), ServiceController.updateTenantService);

// // SD/D/R user-specific routes (by WL admin)
// router.get('/admin/users/:userId/services', requireAuth, checkPermission('services:read'), ServiceController.listUserServices);
// router.patch('/admin/users/:userId/services/:serviceId', requireAuth, checkPermission('services:update'), ServiceController.updateUserService);

// // Retailer self-view
// router.get('/me/services', requireAuth, ServiceController.listMyServices);

export default router
