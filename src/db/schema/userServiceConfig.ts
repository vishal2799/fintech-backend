import { pgTable, boolean, uuid } from 'drizzle-orm/pg-core'
import { users } from './users';
import { services } from './services';

export const userServiceConfig = pgTable('user_service_config', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  serviceId: uuid('service_id').notNull().references(() => services.id),
  isEnabled: boolean('is_enabled').default(true),
});
