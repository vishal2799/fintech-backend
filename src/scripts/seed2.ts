import { db } from '../db';
import { tenants, users } from '../db/schema';
import { hashPassword } from '../utils/hash';

const runSeed = async () => {
  console.log('🌱 Seeding Super Admin...');

  // // 1. Create default platform tenant
  // const [tenant] = await db.insert(tenants).values({
  //   name: 'Platform Root Tenant',
  //   slug: 'platform',
  //   status: 'ACTIVE',
  // }).returning();

  // 2. Create Super Admin user
  const passwordHash = await hashPassword('admin123');
  await db.insert(users).values({
    tenantId: 'c26b3a84-ac3b-4df7-b1dc-8f333697ddde',
    name: 'Super Admin',
    email: 'admin@vmudra.com',
    mobile: '9999999999',
    username: 'savmudra',
    passwordHash,
    isVerified: true,
    staticRole: 'SUPER_ADMIN',  // ✅ Core part
    isEmployee: false           // optional, defaults to false if omitted
  });

  console.log('✅ Super Admin seed complete!');
};

runSeed().catch((err) => {
  console.error('❌ Seeding failed:', err);
});


// import { db } from '../db';
// import { permissions, rolePermissions, roles, tenants, userRoles, users } from '../db/schema';
// import { hashPassword } from '../utils/hash';

// const runSeed = async () => {
//   console.log('🌱 Seeding database...');

//   // 1. Create default tenant for Super Admin
//   const [tenant] = await db.insert(tenants).values({
//     name: 'Platform Root Tenant',
//     slug: 'platform',
//     status: 'ACTIVE'
//   }).returning();

//   // 2. Create Super Admin user
//   const passwordHash = await hashPassword('admin123');
//   const [superAdmin] = await db.insert(users).values({
//     tenantId: tenant.id,
//     name: 'Super Admin',
//     email: 'admin@vmudra.com',
//     mobile: '9999999999',
//     passwordHash,
//     isVerified: true
//   }).returning();

//   // 3. Create Super Admin Role
//   const [superAdminRole] = await db.insert(roles).values({
//     name: 'SUPER_ADMIN',
//     description: 'Full access across platform',
//     scope: 'PLATFORM'
//   }).returning();

//   // 4. Insert basic permissions
//   const permissionList = [
//     { name: 'tenants:read', module: 'Tenants', description: 'View tenants' },
//     { name: 'tenants:create', module: 'Tenants', description: 'Create tenants' },
//     { name: 'users:read', module: 'Users', description: 'View users' },
//     { name: 'users:create', module: 'Users', description: 'Create users' },
//     { name: 'services:read', module: 'Services', description: 'View services' },
//     { name: 'services:update', module: 'Services', description: 'Update services' },
//     // Add more as needed...
//   ];

//   const insertedPermissions = await db.insert(permissions).values(permissionList).returning();

//   // 5. Map permissions to Super Admin role
//   await db.insert(rolePermissions).values(
//     insertedPermissions.map((perm) => ({
//       roleId: superAdminRole.id,
//       permissionId: perm.id,
//     }))
//   );

//   // 6. Assign role to Super Admin user
//   await db.insert(userRoles).values({
//     userId: superAdmin.id,
//     roleId: superAdminRole.id,
//     assignedBy: superAdmin.id
//   });

//   console.log('✅ Seed completed!');
// };

// runSeed().catch((err) => {
//   console.error('❌ Seed failed:', err);
// });
