import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

const VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID!;

export const sendOTP = async (phone: string) => {
  const verification = await client.verify.v2
    .services(VERIFY_SERVICE_SID)
    .verifications.create({ to: phone, channel: 'sms' });

  return verification.sid;
};

export const verifyOTP = async (phone: string, code: string) => {
  const verificationCheck = await client.verify.v2
    .services(VERIFY_SERVICE_SID)
    .verificationChecks.create({ to: phone, code });

  return verificationCheck.status === 'approved';
};
