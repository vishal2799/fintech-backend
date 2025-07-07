import { db } from '../db'; // your drizzle db client
import { roles, users, userRoles, tenants } from '../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

async function seed() {

    const tenantId = uuidv4();

await db.insert(tenants).values({
  id: tenantId,
  name: 'Master Tenant',
  slug: 'master',
  status: 'ACTIVE'
});



  const roleNames = ['SUPER_ADMIN', 'WL_ADMIN', 'SUPER_DISTRIBUTOR', 'DISTRIBUTOR', 'RETAILER'];

  // Insert roles
  for (const name of roleNames) {
    const exists = await db.select().from(roles).where(eq(roles.name, name));
    if (exists.length === 0) {
      await db.insert(roles).values({
        id: uuidv4(),
        name,
        scope: name === 'SUPER_ADMIN' ? 'PLATFORM' : 'TENANT',
        description: `${name} role`
      });
    }
  }

  // Insert Super Admin user
  const superAdminEmail = 'superadmin@example.com';
  const existing = await db.select().from(users).where(eq(users.email, superAdminEmail));
  if (existing.length === 0) {
    const passwordHash = await bcrypt.hash('SuperSecure123', 10);
    const userId = uuidv4();

    await db.insert(users).values({
      id: userId,
      name: 'Super Admin',
      email: superAdminEmail,
      mobile: '9999999999',
      passwordHash,
      isVerified: true,
      status: 'ACTIVE',
      tenantId // dummy tenant, or null if SUPER_ADMIN is exempt
    });

    const saRole = await db.select().from(roles).where(eq(roles.name, 'SUPER_ADMIN'));
    if (saRole.length) {
      await db.insert(userRoles).values({
        id: uuidv4(),
        userId,
        roleId: saRole[0].id,
        assignedBy: userId
      });
    }
  }

  console.log('✅ Roles + Super Admin seeded');
  process.exit(0);
}

seed();
