export type OtpType = 'LOGIN' | 'SIGNUP' | 'FORGOT_PASSWORD';

export interface OTP {
  id: string;
  identifier: string;
  otp: string;
  type: OtpType;
  expiresAt: Date;
  isUsed: boolean;
  createdAt: Date;
}
