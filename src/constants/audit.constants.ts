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
  ROLES: 'Roles',
  TENANT: 'Tenant Management',
  USER: 'User Management',
  PERMISSION: 'Permission Management',
  WALLET: 'Wallet Management',
  AGENT: 'Agent Management',
  CREDIT_REQUEST: 'Credit Request',
  TRANSACTION: 'Transaction Management',
  REPORTS: 'Reports & Logs',
  SETTINGS: 'Platform Settings',
  WL_ADMIN: 'WL_ADMIN',
  EMPLOYEE: 'EMPLOYEE',
  SD: 'SUPER_DISTRIBUTOR',
  D: 'DISTRIBUTOR',
  R: 'RETAILER',
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
  VIEW_PERMISSION: 'View Permission',

  // Employees
  CREATE_EMPLOYEE: 'Create Employee',
  UPDATE_EMPLOYEE: 'Update Employee',
  DELETE_EMPLOYEE: 'Delete Employee',
  VIEW_EMPLOYEE: 'View Employee',

  // Wallet
  REQUEST_CREDIT: 'Request Credit',
  APPROVE_CREDIT: 'Approve Credit Request',
  REJECT_CREDIT: 'Reject Credit Request',
  MANUAL_TOPUP: 'Manual Wallet Top-up',

  // Agents/Users
  CREATE_AGENT: 'Create Agent',
  UPDATE_AGENT: 'Update Agent',
  DELETE_AGENT: 'Delete Agent',

  // Roles
  READ_ROLE: 'Viewed Role',
  CREATE_ROLE: 'Create Role',
  UPDATE_ROLE: 'Update Role',
  DELETE_ROLE: 'Delete Role',

  // Reports
  EXPORT_REPORT: 'Export Report',
  VIEW_AUDIT_LOGS: 'View Audit Logs',

  WLADMIN_CREATE: 'Create WL Admin',
  WLADMIN_UPDATE: 'Update WL Admin',
  WLADMIN_DELETE: 'Delete WL Admin',
  WLADMIN_VIEW: 'Viewed WL Admin',
  WLADMIN_STATUS_UPDATE: 'Status Update WL Admin',
  ROLE_ASSIGN: 'ROLE_ASSIGN',

  WALLET_VIEW_BALANCE: 'WALLET_VIEW_BALANCE',
  WALLET_VIEW_LEDGER: 'WALLET_VIEW_LEDGER',
  WALLET_CREDIT_REQUEST: 'WALLET_CREDIT_REQUEST',

  WALLET_CREATE: 'WALLET_CREATE',
  WALLET_VIEW: 'Wallet View',
  WALLET_VIEW_REQUESTS: 'WALLET_VIEW_REQUESTS',
  WALLET_CREDIT_APPROVE: 'WALLET_CREDIT_APPROVE',
  WALLET_CREDIT_REJECT: 'WALLET_CREDIT_REJECT',
  WALLET_TOPUP: 'WALLET_TOPUP',
  WALLET_DEBIT: 'WALLET_DEBIT',
  WALLET_HOLD: 'WALLET_HOLD',
  WALLET_RELEASE: 'WALLET_RELEASE',
} as const;
