// routes/admin/users.routes.ts
import { Router } from 'express';
import { createWLAdminUser } from './users.controller';
import { requireAuth } from '../../middlewares/requireAuth';
import { roleCheck } from '../../middlewares/roleCheck';
import { Roles } from '../../constants/roles';

const router = Router();

router.post('/', requireAuth, roleCheck([Roles.SUPER_ADMIN]), createWLAdminUser);

export default router;
