import { type Database } from '@sqlite.org/sqlite-wasm';
import { randomUUID } from 'crypto';

export async function seedDemoData(db: Database) {
  try {
    // Check if we already have data
    const hasUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count > 0;
    if (hasUsers) return;

    const companyId = randomUUID();
    const userId = randomUUID();

    // Create demo company
    db.prepare(`
      INSERT INTO companies (id, name, address, phone, email, vatNumber)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind([
      companyId,
      'Demo Company',
      '123 Main Street, 1234 AB Amsterdam',
      '+31 20 123 4567',
      'info@democompany.com',
      'NL123456789B01'
    ]).step();

    // Create admin user
    db.prepare(`
      INSERT INTO users (id, email, name, password, role, companyId)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind([
      userId,
      'admin@democompany.com',
      'Admin User',
      'admin123', // TODO: Add proper password hashing
      'admin',
      companyId
    ]).step();

    console.log('Demo data seeded successfully');
  } catch (error) {
    console.error('Failed to seed demo data:', error);
    throw error;
  }
}