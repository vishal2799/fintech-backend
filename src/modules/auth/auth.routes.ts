import { Router } from 'express';
import { checkHandler, loginHandler, meHandler } from './auth.controller';
import { requireAuth } from '../../middlewares/requireAuth';

const router = Router();

router.get('/check', checkHandler);
router.post('/login', loginHandler);
router.get('/me', requireAuth, meHandler); // ✅ Protected route

export default router;
