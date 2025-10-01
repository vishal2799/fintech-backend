// ============================================
// 4. ROUTES
// src/modules/serviceActions/serviceActions.routes.ts
// ============================================

import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { ServiceActionsController } from './serviceActions.controller';
import {
  createServiceActionSchema,
  updateServiceActionSchema,
  getServiceActionSchema,
  listServiceActionsSchema,
} from './serviceActions.validation';
import { requireAuth } from '../../middlewares/requireAuth';

const router = Router();

// All routes require authentication
router.use(requireAuth);

// Create service action
router.post('/', validate(createServiceActionSchema), ServiceActionsController.create);

// Get all service actions 
router.get('/', ServiceActionsController.getAll2);

// Get service action by code
router.get('/code/:code', ServiceActionsController.getByCode);

// Get service action by ID
router.get('/:id', validate(getServiceActionSchema, 'params'), ServiceActionsController.getById);

// Update service action
router.patch(
  '/:id',
  validate(getServiceActionSchema, 'params'),
  validate(updateServiceActionSchema),
  ServiceActionsController.update
);

// Delete service action (soft delete)
router.delete('/:id', validate(getServiceActionSchema, 'params'), ServiceActionsController.delete);

export default router;

// Get all service actions with filters
// router.get('/', validate(listServiceActionsSchema, 'query'), ServiceActionsController.getAll);