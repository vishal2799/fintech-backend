// src/scripts/seedRoles.ts
import { eq } from 'drizzle-orm';
import { Roles } from '../constants/roles';
import { roles } from '../db/schema';
import { db } from '../db';

const roleDescriptions: Record<string, string> = {
  SUPER_ADMIN: 'Platform-level admin with full access',
  WL_ADMIN: 'White-label partner administrator',
  SUPER_DISTRIBUTOR: 'Manages distributors',
  DISTRIBUTOR: 'Manages retailers',
  RETAILER: 'End user who performs transactions',
  API_CLIENT: 'External client integrating via API',
};

const seedRoles = async () => {
  for (const roleName of Object.values(Roles)) {
    const exists = await db.query.roles.findFirst({ where: eq(roles.name, roleName) });
    if (!exists) {
      await db.insert(roles).values({
        name: roleName,
        scope: ['SUPER_ADMIN', 'API_CLIENT'].includes(roleName) ? 'PLATFORM' : 'TENANT',
        description: roleDescriptions[roleName],
      });
      console.log(`✅ Seeded role: ${roleName}`);
    } else {
      console.log(`ℹ️ Role already exists: ${roleName}`);
    }
  }
};

seedRoles()
  .then(() => {
    console.log('🎉 Roles seeding completed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error seeding roles:', err);
    process.exit(1);
  });
