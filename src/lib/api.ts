import { randomUUID } from 'crypto';
import { dbOps } from './db';
import type { User, Company, Customer, Invoice, InvoiceItem } from '../types';

// Auth
export async function login(email: string, password: string): Promise<User | null> {
  const user = dbOps.getUserByEmail(email) as User | undefined;
  
  if (!user) return null;
  // TODO: Add proper password hashing
  if (password !== user.password) return null;
  
  return user;
}

// Company
export async function getCompany(id: string): Promise<Company | null> {
  return dbOps.getCompany(id) as Company | null;
}

export async function updateCompany(id: string, data: Partial<Company>): Promise<Company> {
  const { name, address, phone, email, vatNumber, logo } = data;
  dbOps.updateCompany([name, address, phone, email, vatNumber, logo, id]);
  return dbOps.getCompany(id) as Company;
}

// Customers
export async function getCustomers(companyId: string): Promise<Customer[]> {
  return dbOps.getCustomers(companyId) as Customer[];
}

export async function createCustomer(data: Omit<Customer, 'id'>): Promise<Customer> {
  const id = randomUUID();
  const { companyId, name, email, address, phone, vatNumber } = data;
  
  dbOps.createCustomer([id, companyId, name, email, address, phone, vatNumber]);
  return { id, ...data };
}

export async function updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
  const { name, email, address, phone, vatNumber } = data;
  dbOps.updateCustomer([name, email, address, phone, vatNumber, id]);
  return { id, ...data } as Customer;
}

export async function deleteCustomer(id: string): Promise<void> {
  dbOps.deleteCustomer(id);
}

// Invoices
export async function getInvoices(companyId: string): Promise<Invoice[]> {
  return dbOps.getInvoices(companyId) as Invoice[];
}

export async function createInvoice(
  data: Omit<Invoice, 'id'> & { items: Omit<InvoiceItem, 'id' | 'invoiceId'>[] }
): Promise<Invoice> {
  const id = randomUUID();
  const { companyId, customerId, number, date, dueDate, status, subtotal, vatTotal, total, items } = data;
  
  dbOps.createInvoice([
    id,
    companyId,
    customerId,
    number,
    date,
    dueDate,
    status,
    subtotal,
    vatTotal,
    total
  ]);
  
  for (const item of items) {
    const itemId = randomUUID();
    dbOps.createInvoiceItem([
      itemId,
      id,
      item.description,
      item.quantity,
      item.unitPrice,
      item.vatRate
    ]);
  }
  
  return { id, ...data };
}

export async function updateInvoiceStatus(id: string, status: Invoice['status']): Promise<Invoice> {
  dbOps.updateInvoiceStatus([status, id]);
  return dbOps.getInvoices(id) as Invoice;
}