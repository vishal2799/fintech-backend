import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
import * as OtpService from '../auth/otp.service';

export const sendPasswordResetOtp = async ({ email }: { email: string }) => {
  const otp = await OtpService.getLatestOtp(email, 'password_reset');

  const msg = {
    to: 'sharma.vishal2799@gmail.com',
    from: 'abvils@outlook.com',
    subject: 'Reset your password',
    text: `Use the OTP ${otp} to reset your password. It expires in 10 minutes.`,
    html: `<p>Use the OTP <strong>${otp}</strong> to reset your password. It expires in 10 minutes.</p>`,
  };

  await sgMail.send(msg);
};
