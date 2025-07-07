import { Router } from 'express';
import { loginHandler, meHandler } from './auth.controller';
import { requireAuth } from '../../middlewares/requireAuth';

const router = Router();

router.post('/login', loginHandler);
router.get('/me', requireAuth, meHandler); // ✅ Protected route

export default router;
