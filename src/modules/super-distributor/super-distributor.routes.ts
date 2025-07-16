// routes/wlAdmin/superDistributors.routes.ts
import { Router } from 'express';
import * as Controller from './super-distributor.controller';
import { Roles } from '../../constants/roles';
import { requireAuth } from '../../middlewares/requireAuth';
import { roleCheck } from '../../middlewares/roleCheck';

const router = Router();

// Require WL Admin
router.use(requireAuth);
router.use(roleCheck([Roles.WL_ADMIN]));

router.get('/', Controller.listSuperDistributors);
router.post('/', Controller.createSuperDistributor);
router.patch('/:id', Controller.updateSuperDistributor);
router.delete('/:id', Controller.deleteSuperDistributor);

export default router;
