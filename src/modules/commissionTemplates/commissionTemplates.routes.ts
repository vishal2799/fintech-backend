// ============================================
// 5. ROUTES
// src/modules/commissionTemplates/commissionTemplates.routes.ts
// ============================================

import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { CommissionTemplatesController } from './commissionTemplates.controller';
import {
  createCommissionTemplateSchema,
  updateCommissionTemplateSchema,
  getCommissionTemplateSchema,
  listCommissionTemplatesSchema,
} from './commissionTemplates.validation';
import { requireAuth } from '../../middlewares/requireAuth';

const router = Router();

router.use(requireAuth);

router.post('/', validate(createCommissionTemplateSchema), CommissionTemplatesController.create);

// router.get('/', validate(listCommissionTemplatesSchema, 'query'), CommissionTemplatesController.getAll2);
router.get('/', CommissionTemplatesController.getAll);

router.get('/:id', validate(getCommissionTemplateSchema, 'params'), CommissionTemplatesController.getById);

router.patch(
  '/:id',
  validate(getCommissionTemplateSchema, 'params'),
  validate(updateCommissionTemplateSchema),
  CommissionTemplatesController.update
);

router.delete('/:id', validate(getCommissionTemplateSchema, 'params'), CommissionTemplatesController.delete);

export default router;
