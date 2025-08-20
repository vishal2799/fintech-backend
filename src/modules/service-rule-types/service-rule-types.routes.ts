import { Router } from 'express';
import { ServiceRuleTypeController } from './service-rule-types.controller';

const router = Router();

router.post('/', ServiceRuleTypeController.create);
router.put('/:id', ServiceRuleTypeController.update);
router.delete('/:id', ServiceRuleTypeController.delete);
router.get('/', ServiceRuleTypeController.getAll);
router.get('/:id', ServiceRuleTypeController.getById);
router.get('/service/:serviceId', ServiceRuleTypeController.getByServiceId);

export default router;
