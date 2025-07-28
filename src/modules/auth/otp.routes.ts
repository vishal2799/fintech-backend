import { Router } from 'express';
import { sendOtp, verifyOtp } from './otp.controller';
import { validate } from '../../middlewares/validate';
import { sendOtpSchema, verifyOtpSchema } from './otp.schema';

const router = Router();

router.post('/send', validate(sendOtpSchema), sendOtp);
router.post('/verify', validate(verifyOtpSchema), verifyOtp);

export default router;
