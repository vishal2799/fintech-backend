import { PERMISSIONS } from '../constants/permissions';
import { db } from '../db';
import { permissions } from '../db/schema';
import { eq } from 'drizzle-orm';

// Utility to decide scope per permission name
function getPermissionScope(name: string): 'PLATFORM' | 'TENANT' | 'BOTH' {
  // Add logic here if some permissions are PLATFORM-only or TENANT-only
  const platformOnlyModules = ['tenants', 'apiClients'];
  const tenantOnlyModules = ['funds'];

  const module = name.split(':')[0];

  if (platformOnlyModules.includes(module)) return 'PLATFORM';
  if (tenantOnlyModules.includes(module)) return 'TENANT';

  return 'BOTH'; // Default case
}

async function seedPermissions() {
  console.log('🌱 Seeding permissions (skipping existing)...');

  const permissionValues = Object.values(PERMISSIONS).map((permName) => ({
    name: permName,
    module: permName.split(':')[0], // e.g., 'users:create' → 'users'
    description: `${permName} permission`,
    scope: getPermissionScope(permName), // 'PLATFORM' | 'TENANT' | 'BOTH'
  }));

  for (const perm of permissionValues) {
    const exists = await db.query.permissions.findFirst({
      where: eq(permissions.name, perm.name),
    });

    if (!exists) {
      await db.insert(permissions).values(perm);
      console.log(`✅ Inserted: ${perm.name}`);
    } else {
      console.log(`⚠️ Skipped (already exists): ${perm.name}`);
    }
  }

  console.log('✅ Done: Permission seeding complete');
}

seedPermissions()
  .catch((err) => {
    console.error('❌ Error in permission seeding:', err);
  })
  .finally(() => process.exit());
