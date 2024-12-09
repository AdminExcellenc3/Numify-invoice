import { type Database } from '@sqlite.org/sqlite-wasm';

let db: Database | null = null;
let initialized = false;

export async function initDb() {
  if (initialized) return;

  const sqlite3 = await import('@sqlite.org/sqlite-wasm');
  const SQL = await sqlite3.default();
  
  db = new SQL.oo1.DB('/data.db');
  
  // Create tables if they don't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'employee',
      companyId TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (companyId) REFERENCES companies (id)
    );

    CREATE TABLE IF NOT EXISTS companies (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      vatNumber TEXT NOT NULL,
      logo TEXT,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      companyId TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      address TEXT NOT NULL,
      phone TEXT NOT NULL,
      vatNumber TEXT,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (companyId) REFERENCES companies (id)
    );

    CREATE TABLE IF NOT EXISTS invoices (
      id TEXT PRIMARY KEY,
      companyId TEXT NOT NULL,
      customerId TEXT NOT NULL,
      number TEXT NOT NULL,
      date TEXT NOT NULL,
      dueDate TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      subtotal REAL NOT NULL,
      vatTotal REAL NOT NULL,
      total REAL NOT NULL,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (companyId) REFERENCES companies (id),
      FOREIGN KEY (customerId) REFERENCES customers (id)
    );

    CREATE TABLE IF NOT EXISTS invoice_items (
      id TEXT PRIMARY KEY,
      invoiceId TEXT NOT NULL,
      description TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unitPrice REAL NOT NULL,
      vatRate REAL NOT NULL,
      FOREIGN KEY (invoiceId) REFERENCES invoices (id)
    );
  `);

  initialized = true;
}

export function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initDb() first.');
  }
  return db;
}

// Helper function to prepare and execute a statement
function prepare(sql: string, params: any[] = []) {
  const stmt = getDb().prepare(sql);
  return stmt.bind(params);
}

// Prepared statements as functions
export const dbOps = {
  // Users
  createUser: (params: any[]) => 
    prepare('INSERT INTO users (id, email, name, password, role, companyId) VALUES (?, ?, ?, ?, ?, ?)', params).step(),
  
  getUserByEmail: (email: string) => 
    prepare('SELECT * FROM users WHERE email = ?', [email]).get(),
  
  // Companies
  createCompany: (params: any[]) =>
    prepare('INSERT INTO companies (id, name, address, phone, email, vatNumber, logo) VALUES (?, ?, ?, ?, ?, ?, ?)', params).step(),
  
  updateCompany: (params: any[]) =>
    prepare(`
      UPDATE companies
      SET name = ?, address = ?, phone = ?, email = ?, vatNumber = ?, logo = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `, params).step(),
  
  getCompany: (id: string) =>
    prepare('SELECT * FROM companies WHERE id = ?', [id]).get(),
  
  // Customers
  getCustomers: (companyId: string) =>
    prepare('SELECT * FROM customers WHERE companyId = ? ORDER BY name ASC', [companyId]).all(),
  
  createCustomer: (params: any[]) =>
    prepare('INSERT INTO customers (id, companyId, name, email, address, phone, vatNumber) VALUES (?, ?, ?, ?, ?, ?, ?)', params).step(),
  
  updateCustomer: (params: any[]) =>
    prepare(`
      UPDATE customers
      SET name = ?, email = ?, address = ?, phone = ?, vatNumber = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `, params).step(),
  
  deleteCustomer: (id: string) =>
    prepare('DELETE FROM customers WHERE id = ?', [id]).step(),
  
  // Invoices
  getInvoices: (companyId: string) =>
    prepare(`
      SELECT i.*, c.name as customerName
      FROM invoices i
      JOIN customers c ON i.customerId = c.id
      WHERE i.companyId = ?
      ORDER BY i.date DESC
    `, [companyId]).all(),
  
  createInvoice: (params: any[]) =>
    prepare(`
      INSERT INTO invoices (id, companyId, customerId, number, date, dueDate, status, subtotal, vatTotal, total)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, params).step(),
  
  createInvoiceItem: (params: any[]) =>
    prepare(`
      INSERT INTO invoice_items (id, invoiceId, description, quantity, unitPrice, vatRate)
      VALUES (?, ?, ?, ?, ?, ?)
    `, params).step(),
  
  updateInvoiceStatus: (params: any[]) =>
    prepare(`
      UPDATE invoices
      SET status = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `, params).step(),
};