import { eq } from 'drizzle-orm';
import { db } from '../db';
import { permissions, rolePermissions, roles } from '../db/schema';
import { Roles } from '../constants/roles';

async function assignPermissionsToSuperAdmin() {
  const superAdminRole = await db.query.roles.findFirst({
    where: eq(roles.name, Roles.SUPER_ADMIN),
  });

  if (!superAdminRole) {
    console.error('❌ SUPER_ADMIN role not found!');
    return;
  }

  const allPerms = await db.select().from(permissions);

  const rolePerms = allPerms.map((perm) => ({
    roleId: superAdminRole.id,
    permissionId: perm.id,
  }));

  console.log('🔗 Assigning permissions to SUPER_ADMIN (skip duplicates)...');

  for (const rp of rolePerms) {
    await db
      .insert(rolePermissions)
      .values(rp)
      .onConflictDoNothing(); // requires unique constraint on (roleId, permissionId)
  }

  console.log('✅ Done: Permissions assigned to SUPER_ADMIN');
}

assignPermissionsToSuperAdmin()
  .catch((err) => {
    console.error('❌ Error assigning permissions:', err);
  })
  .finally(() => process.exit());
