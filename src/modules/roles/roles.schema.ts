import { z } from 'zod';

// Step 1: Define acceptable scope values
export const roleScopeOptions = ['PLATFORM', 'TENANT'] as const;
export type RoleScope = (typeof roleScopeOptions)[number];

// Step 2: Create Role Schema
export const createRoleSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
  description: z.string().optional(),
  scope: z.enum(roleScopeOptions, {
    errorMap: () => ({ message: 'Invalid scope value' }),
  }),
  permissionIds: z.array(z.string()).optional(),
});

// Step 3: Update Role Schema (partial of create)
export const updateRoleSchema = createRoleSchema.partial().extend({
  permissionIds: z.array(z.string()).optional(), // re-assert optionality for partial
});

// Step 4: Types
export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
