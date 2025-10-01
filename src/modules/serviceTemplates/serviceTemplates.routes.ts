// ============================================
// 4. ROUTES
// src/modules/serviceTemplates/serviceTemplates.routes.ts
// ============================================

import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { ServiceTemplatesController } from './serviceTemplates.controller';
import {
  createServiceTemplateSchema,
  updateServiceTemplateSchema,
  getServiceTemplateSchema,
  listServiceTemplatesSchema,
  getByServiceActionSchema,
} from './serviceTemplates.validation';
import { requireAuth } from '../../middlewares/requireAuth';

const router = Router();

router.use(requireAuth);

router.post('/', validate(createServiceTemplateSchema), ServiceTemplatesController.create);

router.get('/', ServiceTemplatesController.getAll);

// router.get('/', validate(listServiceTemplatesSchema, 'query'), ServiceTemplatesController.getAll2);

router.get(
  '/service-action/:serviceActionId',
  validate(getByServiceActionSchema, 'params'),
  ServiceTemplatesController.getByServiceAction
);

router.get('/:id', validate(getServiceTemplateSchema, 'params'), ServiceTemplatesController.getById);

router.patch(
  '/:id',
  validate(getServiceTemplateSchema, 'params'),
  validate(updateServiceTemplateSchema),
  ServiceTemplatesController.update
);

router.delete('/:id', validate(getServiceTemplateSchema, 'params'), ServiceTemplatesController.delete);

export default router;
