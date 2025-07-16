// routes/wlAdmin/retailers.routes.ts
import { Router } from 'express';
import * as Controller from './retailers.controller';
import { Roles } from '../../constants/roles';
import { roleCheck } from '../../middlewares/roleCheck';
import { requireAuth } from '../../middlewares/requireAuth';

const router = Router();

router.use(requireAuth);
router.use(roleCheck([Roles.WL_ADMIN]));

router.get('/', Controller.listRetailers);
router.post('/', Controller.createRetailer);
router.patch('/:id', Controller.updateRetailer);
router.delete('/:id', Controller.deleteRetailer);

export default router;