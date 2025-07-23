import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('❌ DATABASE_URL is not defined in .env file');
}

// Create Neon pool (WebSocket-backed)
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// ✅ Drizzle with full transaction support
export const db = drizzle(pool, { schema });
