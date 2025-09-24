// routes/superAdmin/apiClient.ts
import { Router } from 'express';
import {
  createApiUser,
  regenerateSecret,
  toggleApiUserStatus,
  listApiUsers
} from './apiUser.controller';
import {
  createApiUserSchema,
  regenerateSecretSchema,
  toggleApiUserStatusSchema
} from './apiUser.schema';
import { requireAuth } from '../../middlewares/requireAuth';
import { validate } from '../../middlewares/validate';

const router = Router();
router.use(requireAuth);

router.post('/create', validate(createApiUserSchema), createApiUser);
router.post('/regenerate-secret', validate(regenerateSecretSchema), regenerateSecret);
router.post('/toggle-status', validate(toggleApiUserStatusSchema), toggleApiUserStatus);
router.get('/list', listApiUsers);

export default router;
