import { neon, neonConfig } from '@neondatabase/serverless';
import { Pool } from 'pg';
import { DATABASE_URL } from './env';
import { randomBytes } from 'crypto';

// Enable WebSocket for Neon in production
if (process.env.NODE_ENV === 'production') {
  neonConfig.webSocketConstructor = require('ws');
}

// Lazily initialize sql
let _sql: ReturnType<typeof neon> | null = null;

/**
 * Returns the lazily initialized Neon SQL client.
 */
export function getSql() {
  if (!_sql) {
    if (!DATABASE_URL) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('DATABASE_URL is required in production');
      }
      console.warn('DATABASE_URL not set; SQL client will not be initialized in development');
      return null;
    }
    _sql = neon(DATABASE_URL);
  }
  return _sql;
}

/**
 * Export the `sql` object directly for convenience.
 * Only use if DATABASE_URL is guaranteed to be present.
 */
export const sql = getSql();

// PostgreSQL connection pool (e.g., for transactions)
export const pool = DATABASE_URL
  ? new Pool({ connectionString: DATABASE_URL })
  : null;

/**
 * Executes a query using the pool.
 */
export async function query(text: string, params?: any[]) {
  if (!pool) {
    throw new Error('Database pool not initialized; check DATABASE_URL');
  }
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Generates a unique ID using crypto.
 */
export function generateId(): string {
  return randomBytes(16).toString('hex');
}