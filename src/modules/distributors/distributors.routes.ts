import { Router } from 'express';
import * as Controller from './distributors.controller';
import { Roles } from '../../constants/roles';
import { requireAuth } from '../../middlewares/requireAuth';
import { roleCheck } from '../../middlewares/roleCheck';

const router = Router();

router.use(requireAuth);
router.use(roleCheck([Roles.WL_ADMIN, Roles.SD]));

router.get('/sd', Controller.listDistributors2);
router.get('/', Controller.listDistributors);

router.post('/', Controller.createDistributor);
router.patch('/:id', Controller.updateDistributor);
router.delete('/:id', Controller.deleteDistributor);

export default router;