import { Router } from 'express';
import * as Controller from './wlAdmin.controller';
import { Roles } from '../../constants/roles';
import { roleCheck } from '../../middlewares/roleCheck';
import { requireAuth } from '../../middlewares/requireAuth';

const router = Router();

router.use(requireAuth);
router.use(roleCheck([Roles.SUPER_ADMIN]));

router.get('/', Controller.listWLAdmins);
router.post('/', Controller.createWLAdmin);
router.patch('/:id', Controller.updateWLAdmin);
router.delete('/:id', Controller.deleteWLAdmin);

export default router;