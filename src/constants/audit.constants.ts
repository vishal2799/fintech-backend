// High-level categories per portal
export const AUDIT_PORTALS = {
  SUPER_ADMIN: 'Super Admin Portal',
  WL_ADMIN: 'White-Label Admin Portal',
  SD: 'Super Distributor Portal',
  DISTRIBUTOR: 'Distributor Portal',
  RETAILER: 'Retailer Portal',
} as const;

export const AUDIT_MODULES = {
  AUTH: 'Authentication',
  TENANT: 'Tenant Management',
  USER: 'User Management',
  PERMISSION: 'Permission Management',
  WALLET: 'Wallet Management',
  AGENT: 'Agent Management',
  CREDIT_REQUEST: 'Credit Request',
  TRANSACTION: 'Transaction Management',
  REPORTS: 'Reports & Logs',
  SETTINGS: 'Platform Settings',
} as const;

export const AUDIT_ACTIONS = {
  // Auth
  LOGIN: 'Login',
  LOGOUT: 'Logout',

  // Tenants
  READ_TENANT: 'Viewed Tenant',
  CREATE_TENANT: 'Create Tenant',
  UPDATE_TENANT: 'Update Tenant',
  DELETE_TENANT: 'Delete Tenant',
  UPDATE_TENANT_STATUS: 'Update Tenant Status',

  // Permissions
  CREATE_PERMISSION: 'Create Permission',
  UPDATE_PERMISSION: 'Update Permission',
  DELETE_PERMISSION: 'Delete Permission',

  // Wallet
  REQUEST_CREDIT: 'Request Credit',
  APPROVE_CREDIT: 'Approve Credit Request',
  REJECT_CREDIT: 'Reject Credit Request',
  MANUAL_TOPUP: 'Manual Wallet Top-up',

  // Agents/Users
  CREATE_AGENT: 'Create Agent',
  UPDATE_AGENT: 'Update Agent',
  DELETE_AGENT: 'Delete Agent',

  // Reports
  EXPORT_REPORT: 'Export Report',
  VIEW_AUDIT_LOGS: 'View Audit Logs',
} as const;
