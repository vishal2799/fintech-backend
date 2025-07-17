// utils/makeSensitiveFieldsSafe.ts
const SENSITIVE_FIELDS = ['password', 'passwordHash', 'otp', 'token'];

export const makeSensitiveFieldsSafe = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return obj;

  const clone = Array.isArray(obj) ? [...obj] : { ...obj };

  for (const key in clone) {
    if (SENSITIVE_FIELDS.includes(key)) {
      clone[key] = '***';
    } else if (typeof clone[key] === 'object') {
      clone[key] = makeSensitiveFieldsSafe(clone[key]);
    }
  }

  return clone;
};
