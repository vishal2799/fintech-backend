// src/constants/errorCodes.ts

export const ERRORS = {
  SLUG_EXISTS: {
    message: 'Slug already exists',
    code: 'SLUG_EXISTS',
    status: 400,
  },

  TENANT_NOT_FOUND: {
    message: 'Tenant not found',
    code: 'TENANT_NOT_FOUND',
    status: 404,
  },

  TENANT_INVALID_STATUS: {
    message: 'Invalid Status',
    code: 'INVALID_STATUS',
    status: 400,
  },
  
  PERMISSION_NOT_FOUND: {
    message: 'Permission not found',
    code: 'PERMISSION_NOT_FOUND',
    status: 404,
  },

  UNAUTHORIZED_ACCESS: {
    message: 'Unauthorized access',
    code: 'UNAUTHORIZED_ACCESS',
    status: 403,
  },

  INVALID_CREDENTIALS: {
    message: 'Invalid email or password',
    code: 'INVALID_CREDENTIALS',
    status: 401,
  },

  WALLET_INSUFFICIENT_BALANCE: {
    message: 'Insufficient wallet balance',
    code: 'WALLET_INSUFFICIENT_BALANCE',
    status: 400,
  },

  CREDIT_REQUEST_NOT_FOUND: {
    message: 'Credit request not found or already processed',
    code: 'CREDIT_REQUEST_NOT_FOUND',
    status: 404,
  },
};

export type AppErrorCode = keyof typeof ERRORS;
