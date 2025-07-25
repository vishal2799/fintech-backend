export const PERMISSIONS = {
  // Users
  USERS_CREATE: 'users:create',
  USERS_READ: 'users:read',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',

  // Tenants
  TENANTS_CREATE: 'tenants:create',
  TENANTS_READ: 'tenants:read',
  TENANTS_UPDATE: 'tenants:update',
  TENANTS_DELETE: 'tenants:delete',

  // Roles & Permissions
  ROLES_MANAGE: 'roles:manage',
  ROLES_READ: 'roles:read',
  ROLES_CREATE: 'roles:create',
  ROLES_UPDATE: 'roles:update',
  ROLES_DELETE: 'roles:delete',
  PERMISSIONS_MANAGE: 'permissions:manage',
  PERMISSIONS_READ: 'roles:read',
  PERMISSIONS_CREATE: 'roles:create',
  PERMISSIONS_UPDATE: 'roles:update',
  PERMISSIONS_DELETE: 'roles:delete',

  // WL Admin Permissions
  WALLET_VIEW: 'WALLET_VIEW',
  WALLET_REQUEST_CREDIT: 'WALLET_REQUEST_CREDIT',

  // Super Admin Permissions
  WALLET_CREATE: 'WALLET_CREATE',
  WALLET_APPROVE_CREDIT: 'WALLET_APPROVE_CREDIT',
  WALLET_MANUAL_TOPUP: 'WALLET_MANUAL_TOPUP',
  WALLET_DEBIT: 'WALLET_DEBIT',
  WALLET_HOLD: 'WALLET_HOLD',
  WALLET_RELEASE: 'WALLET_RELEASE',

  // Employees
  WLADMIN_CREATE: 'wladmin:create',
  WLADMIN_READ: 'wladmin:read',
  WLADMIN_UPDATE: 'wladmin:update',
  WLADMIN_DELETE: 'wladmin:delete',

  // Employees
  EMPLOYEES_CREATE: 'employees:create',
  EMPLOYEES_READ: 'employees:read',
  EMPLOYEES_UPDATE: 'employees:update',
  EMPLOYEES_DELETE: 'employees:delete',

  // Services
  SERVICES_READ: 'services:read',
  SERVICES_UPDATE: 'services:update',
  SERVICES_CREATE: 'services:create',
  SERVICES_DELETE: 'services:delete',

  // API Clients
  APICLIENTS_CREATE: 'apiClients:create',
  APICLIENTS_READ: 'apiClients:read',
  APICLIENTS_UPDATE: 'apiClients:update',

  // Reports
  REPORTS_VIEW: 'reports:view',

  // KYC
  KYC_REVIEW: 'kyc:review',

  // Tickets
  TICKETS_MANAGE: 'tickets:manage',

  // Funds/Wallet
  FUNDS_MANAGE: 'funds:manage',
};
