// src/modules/commission/commission.routes.ts
import { Router } from 'express';
import * as CommissionController from './commission.controller';

const router = Router();

router.post('/', CommissionController.createCommissionHandler);
router.get('/', CommissionController.getCommissionsHandler);
router.get('/:id', CommissionController.getCommissionByIdHandler);
router.put('/:id', CommissionController.updateCommissionHandler);
router.delete('/:id', CommissionController.deleteCommissionHandler);

export default router;
