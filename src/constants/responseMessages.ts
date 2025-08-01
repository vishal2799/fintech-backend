// src/constants/responseMessages.ts

export const RESPONSE = {
  TENANT: {
    CREATED: {
      message: 'Tenant created successfully',
      status: 201,
    },
    STATUS_UPDATED: {
      message: 'Tenant status updated successfully',
      status: 200,
    },
    UPDATED: {
      message: 'Tenant updated successfully',
      status: 200,
    },
    DELETED: {
      message: 'Tenant deleted successfully',
      status: 200,
    },
    NOT_FOUND: {
      message: 'Tenant not found',
      status: 404,
    },
    LISTED: {
    message: 'Tenants fetched successfully',
    status: 200,
  },
  },

  WL_ADMIN: {
    CREATED: {
      message: 'WL Admin created successfully',
      status: 201,
    },
    FETCHED: {
      message: 'WL Admins fetched successfully',
      status: 200,
    },
    UPDATED: {
      message: 'WL Admin updated successfully',
      status: 200,
    },
    STATUS_UPDATED: {
      message: 'WL Admin status updated successfully',
      status: 200,
    },
    DELETED: {
      message: 'WL Admin deleted successfully',
      status: 200,
    },
  },

  AUTH: {
    LOGIN_SUCCESS: {
      message: 'Logged in successfully',
      status: 200,
    },
    LOGOUT_SUCCESS: {
      message: 'Logged out successfully',
      status: 200,
    },
    INVALID_CREDENTIALS: {
      message: 'Invalid email or password',
      status: 401,
    },
    UNAUTHORIZED: {
      message: 'Unauthorized access',
      status: 403,
    },
  },

  PERMISSION: {
    CREATED: {
      message: 'Permission created',
      status: 201,
    },
    UPDATED: {
      message: 'Permission updated',
      status: 200,
    },
    DELETED: {
      message: 'Permission deleted',
      status: 200,
    },
    NOT_FOUND: {
      message: 'Permission not found',
      status: 404,
    },
  },

  WALLET: {
    CREDIT_REQUESTED: {
      message: 'Credit request submitted',
      status: 200,
    },
    CREDIT_APPROVED: {
      message: 'Request approved and wallet funded',
      status: 200,
    },
    CREDIT_REJECTED: {
      message: 'Request rejected',
      status: 200,
    },
    MANUAL_TOPUP: {
      message: 'Tenant wallet credited',
      status: 200,
    },
  },
};

export type ResponseEntry = {
  message: string;
  status: number;
};


// src/modules/auth/constants/auth.constants.ts

export const AUTH_RESPONSE = {
  LOGIN_SUCCESS: {
    message: 'Logged-In successfully',
    status: 200,
  },
  REFRESH_SUCCESS: {
    message: 'Token refreshed successfully',
    status: 200,
  },
  LOGOUT_SUCCESS: {
    message: 'Logged-Out successfully',
    status: 200,
  },
  OTP_SENT: {
      message: 'OTP sent successfully',
      status: 200,
    },
};

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid credentials',
  SESSION_NOT_FOUND: 'Session not found',
  USER_NOT_FOUND: 'User not found',
};
