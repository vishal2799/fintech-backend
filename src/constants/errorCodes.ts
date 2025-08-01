// src/constants/errorCodes.ts

export const ERRORS = {
  SLUG_EXISTS: {
    message: 'Slug already exists',
    code: 'SLUG_EXISTS',
    status: 400,
  },

  USER_EXISTS: {
    message: 'User already exists',
    code: 'USER_EXISTS',
    status: 400,
  },

  ROLE_EXISTS: {
    message: 'Role already exists',
    code: 'ROLE_EXISTS',
    status: 400,
  },

  TENANT_NOT_FOUND: {
    message: 'Tenant not found',
    code: 'TENANT_NOT_FOUND',
    status: 404,
  },

  SERVICE_NOT_FOUND: {
    message: 'Service not found',
    code: 'SERVICE_NOT_FOUND',
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

  REQUEST_NOT_FOUND: {
    message: 'Request not found or already processed',
    code: 'REQUEST_NOT_FOUND',
    status: 404,
  },

  INSUFFICIENT_BALANCE: {
    message: 'Insufficient balance',
    code: 'INSUFFICIENT_BALANCE',
    status: 400,
  },

  INSUFFICIENT_BALANCE_HOLD: {
    message: 'Insufficient balance to hold',
    code: 'INSUFFICIENT_BALANCE_HOLD',
    status: 400,
  },

  INSUFFICIENT_BALANCE_RELEASE: {
    message: 'Insufficient held funds to release',
    code: 'INSUFFICIENT_BALANCE_RELEASE',
    status: 400,
  },


  PERMISSION_EXISTS: {
message: 'Permission already exists',
    code: 'PERMISSION_EXISTS',
    status: 400,
  },

  UNAUTHORIZED_ACCESS: {
    message: 'Unauthorized access',
    code: 'UNAUTHORIZED_ACCESS',
    status: 403,
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

  INVALID_TENANT: {
    message: 'Invalid Tenant',
    code: 'INVALID_TENANT',
    status: 401,
  },

  INVALID_OTP: {
    message: 'Invalid or expired OTP',
    code: 'INVALID_OTP',
    status: 400,
  },

   // Auth Errors
  INVALID_CREDENTIALS: {
    message: 'Invalid credentials',
    code: 'INVALID_CREDENTIALS',
    status: 401,
  },

  USER_NOT_FOUND: {
    message: 'User not found',
    code: 'USER_NOT_FOUND',
    status: 404,
  },

  ROLE_NOT_FOUND: {
    message: 'Role not found',
    code: 'ROLE_NOT_FOUND',
    status: 400,
  },

  DYNAMIC_ROLE_NOT_FOUND: {
    message: 'Dynamic Role not found',
    code: 'DYNAMIC_ROLE_NOT_FOUND',
    status: 400,
  },

  SESSION_NOT_FOUND: {
    message: 'Session not found',
    code: 'SESSION_NOT_FOUND',
    status: 401,
  },

  UNAUTHORIZED: {
    message: 'Unauthorized access',
    code: 'UNAUTHORIZED',
    status: 403,
  },

  TOKEN_EXPIRED: {
    message: 'Token has expired',
    code: 'TOKEN_EXPIRED',
    status: 401,
  },

  TOKEN_INVALID: {
    message: 'Invalid token',
    code: 'TOKEN_INVALID',
    status: 401,
  },
};

export type AppErrorCode = keyof typeof ERRORS;
