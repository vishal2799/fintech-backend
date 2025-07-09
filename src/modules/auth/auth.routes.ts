import { Router } from 'express';
import { checkHandler, login, meHandler } from './auth.controller';

const router = Router();

router.get('/check', checkHandler);
router.post('/login', login as any);
router.get('/me', meHandler); // ✅ Protected route

export default router;
