// lib/db.ts
import { neon, neonConfig } from '@neondatabase/serverless';
import { Pool } from 'pg';
import { DATABASE_URL } from './env';

// Enable WebSocket for Neon in production
if (process.env.NODE_ENV === 'production') {
  neonConfig.webSocketConstructor = require('ws');
}

// Initialize database connection lazily
let sql: any = null;

export function getSql() {
  if (!sql) {
    if (!DATABASE_URL) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('DATABASE_URL is required in production');
      }
      console.warn('DATABASE_URL not set; database operations will be skipped in development');
      return null; // Avoid build-time errors
    }
    sql = neon(DATABASE_URL);
  }
  return sql;
}

// Create a connection pool for more complex operations
export const pool = DATABASE_URL
  ? new Pool({ connectionString: DATABASE_URL })
  : null;

// Helper function to execute queries using pool
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

// Helper function to generate a unique ID
export function generateId(): string {
  return require('crypto').randomBytes(16).toString('hex'); // More robust than random string
}