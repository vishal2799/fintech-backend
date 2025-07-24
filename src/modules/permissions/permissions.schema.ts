import { z } from 'zod';

export const permissionScopeOptions = ['PLATFORM', 'TENANT', 'BOTH'] as const;
export type PermissionScope = (typeof permissionScopeOptions)[number];

export const createPermissionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  module: z.string().min(1, 'Module is required'),
  description: z.string().optional(),
  scope: z.enum(permissionScopeOptions, {
    errorMap: () => ({ message: 'Scope must be PLATFORM, TENANT, or BOTH' }),
  }),
});

export const updatePermissionSchema = createPermissionSchema.partial();

export type CreatePermissionInput = z.infer<typeof createPermissionSchema>;
export type UpdatePermissionInput = z.infer<typeof updatePermissionSchema>;
