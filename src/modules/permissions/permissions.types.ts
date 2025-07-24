export type PermissionScope = 'PLATFORM' | 'TENANT' | 'BOTH';

export type Permission = {
  id: string;
  name: string;
  module: string;
  description?: string;
  scope: PermissionScope;
  createdAt?: string;
};
