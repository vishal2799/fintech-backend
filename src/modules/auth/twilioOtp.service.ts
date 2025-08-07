import twilio from 'twilio';
import { AppError } from '../../utils/AppError';
import { ERRORS } from '../../constants/errorCodes';

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const verifySid = process.env.VERIFY_SERVICE_SID!;
const client = twilio(accountSid, authToken);

export const TwilioOtpService = {
  sendOtp: async ({ identifier }: { identifier: string }) => {
    try {
      await client.verify.v2.services(verifySid).verifications.create({
        to: `+91${identifier}`, // must be in E.164 format like +91982xxxxxxx or email
        // channel: identifier.includes('@') ? 'email' : 'sms',
        channel: 'sms',
      });
    } catch (err) {
      console.error(err);
      throw new AppError(ERRORS.OTP_SEND_FAILED);
    }
  },

  verifyOtp: async ({ identifier, otp }: { identifier: string; otp: string }) => {
    try {
      const result = await client.verify.v2.services(verifySid).verificationChecks.create({
        to: `+91${identifier}`,
        code: otp,
      });

      if (result.status !== 'approved') {
        throw new AppError(ERRORS.INVALID_OTP);
      }
    } catch (err) {
      console.error(err);
      throw new AppError(ERRORS.INVALID_OTP);
    }
  },
};
