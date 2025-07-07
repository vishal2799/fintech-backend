import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('❌ DATABASE_URL is not defined in .env file');
}

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
