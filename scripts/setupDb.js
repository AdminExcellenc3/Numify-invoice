import { initDb, dbOps } from '../src/lib/db.js';
import { randomUUID } from 'crypto';

async function setupDb() {
  await initDb();

  const companyId = randomUUID();
  const userId = randomUUID();

  // Create demo company
  dbOps.createCompany([
    companyId,
    'Demo Company',
    '123 Main Street, 1234 AB Amsterdam',
    '+31 20 123 4567',
    'info@democompany.com',
    'NL123456789B01',
    null
  ]);

  // Create admin user
  dbOps.createUser([
    userId,
    'admin@democompany.com',
    'Admin User',
    'admin123', // TODO: Add proper password hashing
    'admin',
    companyId
  ]);

  console.log('Database initialized with demo data');
  console.log('Admin login:');
  console.log('Email: admin@democompany.com');
  console.log('Password: admin123');
}

setupDb().catch(console.error);