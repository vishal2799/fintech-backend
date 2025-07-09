import { PERMISSIONS } from '../constants/permissions';
import { db } from '../db';
import { permissions } from '../db/schema';

async function seedPermissions() {
  const allPermissions = Object.values(PERMISSIONS).map((name) => ({
    name,
    module: name.split(':')[0],
    description: `${name} permission`,
  }));

  console.log('🌱 Seeding permissions (skip existing)...');

  for (const perm of allPermissions) {
    await db
      .insert(permissions)
      .values(perm)
      .onConflictDoNothing(); // requires 'name' to be unique in schema
  }

  console.log('✅ Done: Permission seeding complete');
}

seedPermissions()
  .catch((err) => {
    console.error('❌ Error in permission seeding:', err);
  })
  .finally(() => process.exit());
