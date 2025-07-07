import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { roles } from "./roles";
import { permissions } from "./permissions";

export const rolePermissions = pgTable('role_permissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  roleId: uuid('role_id').references(() => roles.id),
  permissionId: uuid('permission_id').references(() => permissions.id),
  createdAt: timestamp('created_at').defaultNow()
});