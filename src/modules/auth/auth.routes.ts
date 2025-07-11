import { Router } from 'express';
import { login, logout, refresh, } from './auth.controller';

const router = Router();

router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
// router.get('/me', meHandler); // ✅ Protected route

export default router;
