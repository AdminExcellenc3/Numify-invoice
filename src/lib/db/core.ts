import { type Database } from '@sqlite.org/sqlite-wasm';
import { schema } from './schema';
import { seedDemoData } from './seed';

let db: Database | null = null;
let initialized = false;

export async function initDb() {
  if (initialized) return;

  try {
    const sqlite3 = await import('@sqlite.org/sqlite-wasm');
    const SQL = await sqlite3.default();
    
    db = new SQL.oo1.DB(':memory:', 'ct'); // Use in-memory database for web environment
    db.exec(schema);
    
    // Seed demo data if needed
    await seedDemoData(db);
    
    initialized = true;
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

export function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initDb() first.');
  }
  return db;
}

export function prepare(sql: string, params: any[] = []) {
  const stmt = getDb().prepare(sql);
  return stmt.bind(params);
}